import { FileHelper, matches } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { moneroConfDefaults } from '../utils'

const stringArray = matches.array(matches.string)
const iniString = stringArray.map(([a]) => a).orParser(matches.string)
const iniNatural = iniString.map((a) => Number(a)).orParser(matches.natural)

const {
  'data-dir': dataDir,
  'log-level': logLevel,
  'log-file': logFile,
  'max-log-file-size': maxLogFileSize,
  'max-log-files': maxLogFiles,
  'p2p-bind-ip': p2pBindIp,
  'p2p-bind-port': p2pBindPort,
  'rpc-bind-ip': rpcBindIp,
  'rpc-bind-port': rpcBindPort,
  'confirm-external-bind': confirmExternalBind,
  'rpc-access-control-origins': rpcAccessControlOrigins,
  'rpc-restricted-bind-ip': rpcRestrictedBindIp,
  'rpc-restricted-bind-port': rpcRestrictedBindPort,
  'db-sync-mode': dbSyncMode,
  'enforce-dns-checkpointing': enforceDnsCheckpointing,
  'disable-dns-checkpoints': disableDnsCheckpoints,
  'check-updates': checkUpdates,
  'out-peers': outPeers,
  'in-peers': inPeers,
  'limit-rate-up': limitRateUp,
  'limit-rate-down': limitRateDown,
  'max-txpool-weight': maxTxpoolWeight,
} = moneroConfDefaults

const shape = matches.object({
  // Static
  'data-dir': iniString.onMismatch(dataDir),
  'log-level': iniString.onMismatch(logLevel),
  'log-file': iniString.onMismatch(logFile),
  'max-log-file-size': iniNatural.onMismatch(maxLogFileSize),
  'max-log-files': iniNatural.onMismatch(maxLogFiles),
  'p2p-bind-ip': iniString.onMismatch(p2pBindIp),
  'p2p-bind-port': iniNatural.onMismatch(p2pBindPort),
  'rpc-bind-ip': iniString.onMismatch(rpcBindIp),
  'rpc-bind-port': iniNatural.onMismatch(rpcBindPort),
  'confirm-external-bind': iniNatural.onMismatch(confirmExternalBind),
  'rpc-access-control-origins': iniString.onMismatch(rpcAccessControlOrigins),
  'rpc-restricted-bind-ip': iniString.onMismatch(rpcRestrictedBindIp),
  'rpc-restricted-bind-port': iniNatural.onMismatch(rpcRestrictedBindPort),
  'db-sync-mode': iniString.onMismatch(dbSyncMode),
  'enforce-dns-checkpointing': iniNatural.onMismatch(enforceDnsCheckpointing),
  'disable-dns-checkpoints': iniNatural.onMismatch(disableDnsCheckpoints),
  'check-updates': iniString.onMismatch(checkUpdates),

  // Direct-mapped
  'out-peers': iniNatural.onMismatch(outPeers),
  'in-peers': iniNatural.onMismatch(inPeers),
  'limit-rate-up': iniNatural.onMismatch(limitRateUp),
  'limit-rate-down': iniNatural.onMismatch(limitRateDown),
  'max-txpool-weight': iniNatural.onMismatch(maxTxpoolWeight),

  // Conditional (undefined = omitted)
  'rpc-login': iniString.optional().onMismatch(undefined),
  'no-zmq': iniNatural.optional().onMismatch(undefined),
  'zmq-rpc-bind-ip': iniString.optional().onMismatch(undefined),
  'zmq-rpc-bind-port': iniNatural.optional().onMismatch(undefined),
  'zmq-pub': iniString.optional().onMismatch(undefined),
  'disable-rpc-ban': iniNatural.optional().onMismatch(undefined),
  'hide-my-port': iniNatural.optional().onMismatch(undefined),
  igd: iniString.optional().onMismatch(undefined),
  'public-node': iniNatural.optional().onMismatch(undefined),
  'prune-blockchain': iniNatural.optional().onMismatch(undefined),
  'pad-transactions': iniNatural.optional().onMismatch(undefined),
  'ban-list': iniString.optional().onMismatch(undefined),
  'block-notify': iniString.optional().onMismatch(undefined),

  // Peer arrays (repeated keys in INI)
  'add-peer': stringArray.orParser(iniString).optional().onMismatch(undefined),
  'add-priority-node': stringArray
    .orParser(iniString)
    .optional()
    .onMismatch(undefined),
  'add-exclusive-node': stringArray
    .orParser(iniString)
    .optional()
    .onMismatch(undefined),

  // Runtime composite (main.ts populates)
  'tx-proxy': iniString.optional().onMismatch(undefined),
  proxy: iniString.optional().onMismatch(undefined),
  'anonymous-inbound': iniString.optional().onMismatch(undefined),
}).onMismatch(moneroConfDefaults as any)

function onWrite(a: unknown): any {
  if (a && typeof a === 'object') {
    if (Array.isArray(a)) return a.map(onWrite)
    return Object.fromEntries(
      Object.entries(a).map(([k, v]) => [k, onWrite(v)]),
    )
  } else if (typeof a === 'boolean') {
    return a ? 1 : 0
  }
  return a
}

export const moneroConfFile = FileHelper.ini(
  {
    base: sdk.volumes.monerod,
    subpath: 'monero.conf',
  },
  shape,
  { bracketedArray: false },
  {
    onRead: (a) => a,
    onWrite,
  },
)
