import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto'
import {
  createServer as createHttpServer,
  IncomingMessage,
  request,
  ServerResponse,
} from 'node:http'
import {
  connect,
  createServer as createTcpServer,
  Server,
  Socket,
} from 'node:net'

export type RpcLogin = { username: string; password: string }

const realm = 'monero-rpc'
const nonceTtlMs = 10 * 60_000
const md5 = (s: string) => createHash('md5').update(s).digest('hex')

/**
 * Serves the loopback unrestricted RPC on `port` until `abort` fires. With `login` null, monerod
 * enforces its own RPC login, so connections are relayed byte for byte: monerod honours a Digest
 * nonce only on the connection that issued it. Otherwise every request must pass HTTP Digest
 * (MD5, `qop=auth`, the scheme P2Pool's libcurl client speaks) with `login`.
 * A nonce/client-nonce pair accepts only increasing nonce counts.
 */
export function serveUnrestrictedRpc(
  port: number,
  upstreamPort: number,
  login: RpcLogin | null,
  abort: AbortSignal,
): Promise<null> {
  const server = login ? digestGate(upstreamPort, login) : relay(upstreamPort)
  const sockets = new Set<Socket>()
  server.on('connection', (socket: Socket) => {
    sockets.add(socket)
    socket.once('close', () => sockets.delete(socket))
  })
  return new Promise((resolve, reject) => {
    server.once('error', reject)
    abort.addEventListener(
      'abort',
      () => {
        server.close(() => resolve(null))
        for (const socket of sockets) socket.destroy()
      },
      { once: true },
    )
    server.listen(port, '::')
  })
}

function relay(upstreamPort: number): Server {
  return createTcpServer((client) => {
    const upstream = connect(upstreamPort, '127.0.0.1')
    client.pipe(upstream).pipe(client)
    client.on('error', () => upstream.destroy())
    upstream.on('error', () => client.destroy())
  })
}

function digestGate(upstreamPort: number, login: RpcLogin) {
  const secret = randomBytes(32)
  const sign = (issued: string) =>
    createHmac('sha256', secret).update(issued).digest('hex')
  const newNonce = () => {
    const issued = Date.now().toString(16)
    return `${issued}.${sign(issued)}`
  }
  const ha1 = md5(`${login.username}:${realm}:${login.password}`)
  const nonceCounts = new Map<string, { count: number; expires: number }>()

  const challenge = (res: ServerResponse, stale: boolean) => {
    res.writeHead(401, {
      'WWW-Authenticate': `Digest realm="${realm}", qop="auth", algorithm=MD5, nonce="${newNonce()}", stale=${stale}`,
      'Content-Length': '0',
    })
    res.end()
  }

  return createHttpServer((req, res) => {
    const now = Date.now()
    const auth = parseDigest(req.headers.authorization)
    const [issued, signature] = auth?.nonce?.split('.') ?? []
    const nonceSigned =
      !!issued && !!signature && safeEqual(signature, sign(issued))
    if (!auth || !nonceSigned) return challenge(res, false)
    const expires = parseInt(issued, 16) + nonceTtlMs
    if (now >= expires) return challenge(res, true)
    const { username, uri, qop, nc, cnonce, response } = auth
    const expected = md5(
      `${ha1}:${auth.nonce}:${nc}:${cnonce}:${qop}:${md5(`${req.method}:${uri}`)}`,
    )
    if (
      username !== login.username ||
      auth.realm !== realm ||
      uri !== req.url ||
      qop !== 'auth' ||
      !/^[0-9a-f]{8}$/i.test(nc) ||
      !cnonce ||
      !response ||
      !safeEqual(response, expected)
    )
      return challenge(res, false)
    for (const [key, seen] of nonceCounts) {
      if (seen.expires <= now) nonceCounts.delete(key)
    }
    const key = JSON.stringify([auth.nonce, cnonce])
    const count = parseInt(nc, 16)
    if (count <= (nonceCounts.get(key)?.count ?? 0))
      return challenge(res, false)
    nonceCounts.set(key, { count, expires })
    forward(req, res, upstreamPort)
  })
}

function forward(
  req: IncomingMessage,
  res: ServerResponse,
  upstreamPort: number,
) {
  const { authorization: _, ...headers } = req.headers
  const upstream = request(
    {
      host: '127.0.0.1',
      port: upstreamPort,
      method: req.method,
      path: req.url,
      headers,
    },
    (answer) => {
      res.writeHead(answer.statusCode ?? 502, answer.headers)
      answer.pipe(res)
    },
  )
  upstream.on('error', () => {
    if (!res.headersSent) res.writeHead(502, { 'Content-Length': '0' })
    res.end()
  })
  req.pipe(upstream)
}

function parseDigest(header: string | undefined) {
  if (!header?.startsWith('Digest ')) return null
  const params: Record<string, string> = {}
  for (const [, key, quoted, bare] of header
    .slice(7)
    .matchAll(/([a-z]+)=(?:"((?:[^"\\]|\\.)*)"|([^,\s]*))/gi))
    params[key.toLowerCase()] = quoted ?? bare
  return params
}

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}
