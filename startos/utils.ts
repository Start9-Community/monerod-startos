export const rpcRestrictedPort = 18089
export const rpcPort = 18081
export const p2pPort = 18080
export const p2pLocalBindPort = 18084
export const zmqPort = 18082
export const zmqPubsubPort = 18083
export const walletRpcPort = 28088

export const torProxyAddress = '10.0.3.1:9050'

export interface TorPreferences {
  toronly: boolean
  maxsocksconns: number
  maxonionconns: number
  dandelion: boolean
}

export const torDefaults: TorPreferences = {
  toronly: true,
  maxsocksconns: 16,
  maxonionconns: 16,
  dandelion: true,
}

export const moneroConfDefaults = {
  // Static
  'data-dir': '/home/monero/.bitmonero',
  'log-level': '0,blockchain:INFO',
  'log-file': '/home/monero/.bitmonero/logs/monerod.log',
  'max-log-file-size': 10000000,
  'max-log-files': 2,
  'p2p-bind-ip': '0.0.0.0',
  'p2p-bind-port': p2pPort,
  'rpc-bind-ip': '0.0.0.0',
  'rpc-bind-port': rpcPort,
  'confirm-external-bind': 1,
  'rpc-access-control-origins': '*',
  'rpc-restricted-bind-ip': '0.0.0.0',
  'rpc-restricted-bind-port': rpcRestrictedPort,
  'db-sync-mode': 'safe:sync',
  'enforce-dns-checkpointing': 0,
  'disable-dns-checkpoints': 1,
  'check-updates': 'disabled',
  // Direct-mapped (user configurable)
  'out-peers': 12,
  'in-peers': 24,
  'limit-rate-up': 2048,
  'limit-rate-down': 8192,
  'max-txpool-weight': 648000000,
  // Conditional (undefined = omitted from file)
  'rpc-login': undefined as string | undefined,
  'no-zmq': 1 as number | undefined,
  'zmq-rpc-bind-ip': undefined as string | undefined,
  'zmq-rpc-bind-port': undefined as number | undefined,
  'zmq-pub': undefined as string | undefined,
  'disable-rpc-ban': 1 as number | undefined,
  'hide-my-port': undefined as number | undefined,
  igd: 'disabled' as string | undefined,
  'public-node': undefined as number | undefined,
  'prune-blockchain': undefined as number | undefined,
  'pad-transactions': 1 as number | undefined,
  'ban-list': '/home/monero/ban_list.txt' as string | undefined,
  'block-notify': undefined as string | undefined,
  'add-peer': undefined as string[] | undefined,
  'add-priority-node': undefined as string[] | undefined,
  'add-exclusive-node': undefined as string[] | undefined,
  // Tor composite (default: toronly mode)
  'tx-proxy': `tor,${torProxyAddress},${torDefaults.maxsocksconns}` as
    | string
    | undefined,
  proxy: torProxyAddress as string | undefined,
  'anonymous-inbound': undefined as string | undefined,
} as const

export const walletRpcConfDefaults = {
  'wallet-dir': '/home/monero/wallet',
  'log-file': '/home/monero/wallet/logs/monero-wallet-rpc.log',
  'max-log-file-size': 10000000,
  'max-log-files': 2,
  'trusted-daemon': 1,
  'daemon-port': rpcRestrictedPort,
  'confirm-external-bind': 1,
  'rpc-bind-ip': '0.0.0.0',
  'rpc-bind-port': walletRpcPort,
  'rpc-login': undefined as string | undefined,
  'disable-rpc-login': 1 as number | undefined,
  'daemon-login': undefined as string | undefined,
} as const

export function toTorSettings(prefs: TorPreferences) {
  if (!prefs.toronly) {
    return {
      'tx-proxy': undefined,
      proxy: undefined,
      'anonymous-inbound': undefined,
      'pad-transactions': undefined as number | undefined,
    }
  }

  let txProxy = `tor,${torProxyAddress},${prefs.maxsocksconns}`
  if (!prefs.dandelion) txProxy += ',disable_noise'

  return {
    'tx-proxy': txProxy,
    proxy: torProxyAddress,
    'anonymous-inbound': undefined as string | undefined,
    'pad-transactions': 1 as number | undefined,
  }
}

export function fromTorSettings(conf: {
  proxy?: string
  'tx-proxy'?: string
  'anonymous-inbound'?: string
}): TorPreferences {
  const toronly = conf.proxy !== undefined
  const txParts = conf['tx-proxy']?.split(',') ?? []
  const anonParts = conf['anonymous-inbound']?.split(',') ?? []

  return {
    toronly,
    maxsocksconns: Number(txParts[2]) || torDefaults.maxsocksconns,
    maxonionconns: Number(anonParts[2]) || torDefaults.maxonionconns,
    dandelion: conf['tx-proxy']
      ? !conf['tx-proxy'].includes('disable_noise')
      : torDefaults.dandelion,
  }
}

export function anonymousInbound(
  peerTorAddress: string,
  maxonionconns: number,
): string {
  return `${peerTorAddress}:${p2pPort},127.0.0.1:${p2pLocalBindPort},${maxonionconns}`
}
