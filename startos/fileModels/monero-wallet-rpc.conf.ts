import { FileHelper, matches } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { walletRpcConfDefaults } from '../utils'

const stringArray = matches.array(matches.string)
const iniString = stringArray.map(([a]) => a).orParser(matches.string)
const iniNatural = iniString.map((a) => Number(a)).orParser(matches.natural)

const shape = matches.object({
  'wallet-dir': iniString.onMismatch(walletRpcConfDefaults['wallet-dir']),
  'log-file': iniString.onMismatch(walletRpcConfDefaults['log-file']),
  'max-log-file-size': iniNatural.onMismatch(
    walletRpcConfDefaults['max-log-file-size'],
  ),
  'max-log-files': iniNatural.onMismatch(
    walletRpcConfDefaults['max-log-files'],
  ),
  'trusted-daemon': iniNatural.onMismatch(
    walletRpcConfDefaults['trusted-daemon'],
  ),
  'daemon-port': iniNatural.onMismatch(walletRpcConfDefaults['daemon-port']),
  'confirm-external-bind': iniNatural.onMismatch(
    walletRpcConfDefaults['confirm-external-bind'],
  ),
  'rpc-bind-ip': iniString.onMismatch(walletRpcConfDefaults['rpc-bind-ip']),
  'rpc-bind-port': iniNatural.onMismatch(
    walletRpcConfDefaults['rpc-bind-port'],
  ),
  // Conditional
  'rpc-login': iniString.optional().onMismatch(undefined),
  'disable-rpc-login': iniNatural.optional().onMismatch(undefined),
  'daemon-login': iniString.optional().onMismatch(undefined),
})

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

export const walletRpcConfFile = FileHelper.ini(
  {
    base: sdk.volumes.wallet,
    subpath: 'monero-wallet-rpc.conf',
  },
  shape,
  { bracketedArray: false },
  {
    onRead: (a) => a,
    onWrite,
  },
)
