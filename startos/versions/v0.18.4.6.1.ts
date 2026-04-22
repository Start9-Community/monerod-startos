import { IMPOSSIBLE, VersionInfo, YAML } from '@start9labs/start-sdk'
import { existsSync } from 'fs'
import { readdir, readFile, rename, rm } from 'fs/promises'
import { walletRpcConfFile } from '../fileModels/monero-wallet-rpc.conf'
import { moneroConfFile } from '../fileModels/monero.conf'
import { storeJson } from '../fileModels/store.json'
import { zmqPort, zmqPubsubPort } from '../utils'

interface OldCredentials {
  enabled: 'enabled' | 'disabled'
  username: string
  password: string
}

interface OldPeer {
  hostname: string
  port: number
  prioritynode: boolean
}

interface OldConfigYaml {
  rpc?: {
    'rpc-credentials'?: OldCredentials
    'wallet-rpc-credentials'?: OldCredentials
  }
  advanced?: {
    zmq?: boolean
    pruning?: boolean
    p2p?: {
      maxnumoutpeers?: number
      maxnuminpeers?: number
      letneighborsgossip?: boolean
      publicrpc?: boolean
      strictnodes?: boolean
      peer?: OldPeer[]
    }
    tor?: {
      rpcban?: boolean
      toronly?: boolean
      maxsocksconns?: number
      maxonionconns?: number
      dandelion?: boolean
    }
  }
  ratelimit?: {
    kbpsup?: number
    kbpsdown?: number
  }
  txpool?: {
    maxbytes?: number
  }
}

export const v_0_18_4_6_1 = VersionInfo.of({
  version: '0.18.4.6:1',
  releaseNotes: {
    en_US: 'Internal updates (start-sdk 1.2.0)',
    es_ES: 'Actualizaciones internas (start-sdk 1.2.0)',
    de_DE: 'Interne Aktualisierungen (start-sdk 1.2.0)',
    pl_PL: 'Aktualizacje wewnętrzne (start-sdk 1.2.0)',
    fr_FR: 'Mises à jour internes (start-sdk 1.2.0)',
  },
  migrations: {
    up: async ({ effects }) => {
      // Read old config.yaml if it exists
      const configYaml: OldConfigYaml | undefined = await readFile(
        '/media/startos/volumes/main/start9/config.yaml',
        'utf-8',
      ).then(YAML.parse, () => undefined)

      if (configYaml) {
        const { rpc, advanced, ratelimit, txpool } = configYaml
        const p2p = advanced?.p2p
        const tor = advanced?.tor
        const rpcCreds = rpc?.['rpc-credentials']
        const walletCreds = rpc?.['wallet-rpc-credentials']
        const peerAddr = (p: OldPeer) => `${p.hostname}:${p.port}`

        const gossipEnabled = p2p?.letneighborsgossip !== false

        // Migrate Tor intents into store.json. Tor-related monerod keys
        // (proxy / tx-proxy / anonymous-inbound / pad-transactions) are NOT
        // written to monero.conf — main.ts synthesises those CLI args at
        // runtime from the intents plus the live Tor container IP.
        if (tor) {
          const toronlyActive = tor.toronly === true
          await storeJson.merge(effects, {
            outboundProxy: toronlyActive ? 'tor' : 'none',
            padTransactions: false,
            torOutbound: toronlyActive,
            torInbound: toronlyActive,
            // null on these three = use monerod's upstream default (16, 16,
            // noise enabled). Only carry over explicit user values.
            torMaxOutboundConns: tor.maxsocksconns ?? null,
            torMaxInboundConns: tor.maxonionconns ?? null,
            torDandelionNoise: tor.dandelion === false ? false : null,
          })
        }

        // Build monero.conf from old config — zod .catch() fills missing defaults
        const confSettings: Record<string, any> = {}

        if (p2p?.maxnumoutpeers != null) {
          confSettings['out-peers'] = p2p.maxnumoutpeers
        }
        if (p2p?.maxnuminpeers != null) {
          confSettings['in-peers'] = p2p.maxnuminpeers
        }
        if (ratelimit?.kbpsup != null) {
          confSettings['limit-rate-up'] = ratelimit.kbpsup
        }
        if (ratelimit?.kbpsdown != null) {
          confSettings['limit-rate-down'] = ratelimit.kbpsdown
        }
        if (txpool?.maxbytes != null) {
          confSettings['max-txpool-weight'] = txpool.maxbytes * 1000000
        }

        if (rpcCreds?.enabled === 'enabled') {
          confSettings['rpc-login'] =
            `${rpcCreds.username}:${rpcCreds.password}`
        }

        if (advanced?.zmq) {
          confSettings['no-zmq'] = undefined
          confSettings['zmq-rpc-bind-ip'] = '0.0.0.0'
          confSettings['zmq-rpc-bind-port'] = zmqPort
          confSettings['zmq-pub'] = `tcp://0.0.0.0:${zmqPubsubPort}`
        }

        if (tor?.rpcban) {
          confSettings['disable-rpc-ban'] = undefined
        }

        if (!gossipEnabled) {
          confSettings['hide-my-port'] = 1
        }
        confSettings['igd'] = !gossipEnabled ? 'disabled' : undefined

        if (p2p?.publicrpc) {
          confSettings['public-node'] = 1
        }

        if (advanced?.pruning) {
          confSettings['prune-blockchain'] = 1
        }

        // `ban-list` path is enforced via zod literal in monero.conf; the
        // list contents are now managed via the Ban List action.
        //
        // `block-notify` is a free-text field managed via the Other Settings
        // action. It is not auto-configured here — dependent services that
        // want block notifications should set it via their own mechanisms.

        // Peers
        const peers = p2p?.peer
        if (peers && peers.length > 0) {
          if (p2p?.strictnodes) {
            confSettings['add-exclusive-node'] = peers.map(peerAddr)
          } else {
            const regular = peers.filter((p) => !p.prioritynode)
            const priority = peers.filter((p) => p.prioritynode)
            if (regular.length > 0) {
              confSettings['add-peer'] = regular.map(peerAddr)
            }
            if (priority.length > 0) {
              confSettings['add-priority-node'] = priority.map(peerAddr)
            }
          }
        }

        await moneroConfFile.write(effects, confSettings as any)

        // Build wallet-rpc conf — zod .catch() fills missing defaults
        const walletSettings: Record<string, any> = {}
        if (walletCreds?.enabled === 'enabled') {
          walletSettings['rpc-login'] =
            `${walletCreds.username}:${walletCreds.password}`
          walletSettings['disable-rpc-login'] = undefined
        }
        if (rpcCreds?.enabled === 'enabled') {
          walletSettings['daemon-login'] =
            `${rpcCreds.username}:${rpcCreds.password}`
        }
        await walletRpcConfFile.write(effects, walletSettings as any)
      } else {
        // No old config — write defaults (zod .catch() fills all defaults)
        await moneroConfFile.write(effects, {} as any)
        await walletRpcConfFile.write(effects, {} as any)
      }

      // Remove old files
      await rm('/media/startos/volumes/main/start9/config.yaml', {
        force: true,
      }).catch(console.error)
      await rm('/media/startos/volumes/main/start9/stats.yaml', {
        force: true,
      }).catch(console.error)

      // Move blockchain data from main volume to monerod volume
      for (const item of ['lmdb', 'p2pstate.bin', 'logs']) {
        const src = `/media/startos/volumes/main/${item}`
        if (existsSync(src)) {
          await rename(src, `/media/startos/volumes/monerod/${item}`).catch(
            console.error,
          )
        }
      }

      // Move wallet files from main volume to wallet volume root
      const walletSrc = '/media/startos/volumes/main/wallets'
      if (existsSync(walletSrc)) {
        const items = await readdir(walletSrc)
        for (const item of items) {
          await rename(
            `${walletSrc}/${item}`,
            `/media/startos/volumes/wallet/${item}`,
          ).catch(console.error)
        }
        await rm(walletSrc, { recursive: true, force: true }).catch(
          console.error,
        )
      }
    },
    down: IMPOSSIBLE,
  },
})
