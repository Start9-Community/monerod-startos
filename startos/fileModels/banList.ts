import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

/**
 * monerod --ban-list expects one IP or IPv4 CIDR per line. `#` starts a
 * comment; blank lines are ignored. Invalid lines are logged and skipped.
 * We enforce this path via zod in monero.conf; this file model owns the
 * contents.
 *
 * Source: monero-project/monero src/p2p/net_node.inl:549-575
 */
export const banListPath = '/home/monero/.bitmonero/ban_list.txt'

const shape = z.object({
  entries: z.array(z.string()).catch([]),
})

function parse(raw: string) {
  const entries: string[] = []
  for (const line of raw.split('\n')) {
    // strip trailing comments and surrounding whitespace
    const hash = line.indexOf('#')
    const trimmed = (hash >= 0 ? line.slice(0, hash) : line).trim()
    if (trimmed) entries.push(trimmed)
  }
  return { entries }
}

function stringify(data: { entries?: string[] }) {
  return (data.entries ?? []).join('\n') + '\n'
}

export const banListFile = FileHelper.raw(
  {
    base: sdk.volumes.monerod,
    subpath: 'ban_list.txt',
  },
  stringify,
  parse,
  (data) => shape.parse(data),
)
