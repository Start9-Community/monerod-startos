import { FileHelper, utils, z } from '@start9labs/start-sdk'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { rpcRestrictedPort, walletRpcPort } from '../utils'

const iniString = z
  .union([z.array(z.string()).transform((a) => a.at(-1)!), z.string()])
  .optional()
  .catch(undefined)

const shape = z.looseObject({
  // Enforced
  'wallet-dir': z.literal('/home/monero/wallet').catch('/home/monero/wallet'),
  'log-file': z
    .literal('/home/monero/wallet/logs/monero-wallet-rpc.log')
    .catch('/home/monero/wallet/logs/monero-wallet-rpc.log'),
  'max-log-file-size': z.literal(10000000).catch(10000000),
  'max-log-files': z.literal(2).catch(2),
  'trusted-daemon': z.literal(1).catch(1),
  'daemon-port': z.literal(rpcRestrictedPort).catch(rpcRestrictedPort),
  'confirm-external-bind': z.literal(1).catch(1),
  'rpc-bind-ip': z.literal('0.0.0.0').catch('0.0.0.0'),
  'rpc-bind-port': z.literal(walletRpcPort).catch(walletRpcPort),
  // Conditional
  'rpc-login': iniString,
  'daemon-login': iniString,
  // Enforced undefined: the shape is loose, so a legacy value would otherwise survive.
  'disable-rpc-login': z.undefined().catch(undefined),
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
  { onRead: (a) => a, onWrite },
)

// ── InputSpec & read helper ─────────────────────────────────────────

const { InputSpec, Value } = sdk

const alphanumUnderscore = [
  {
    regex: '^[a-zA-Z0-9_]+$',
    description: i18n('Must be alphanumeric and/or can contain an underscore'),
  },
]

export const walletRpcConfigSpec = InputSpec.of({
  username: Value.text({
    name: i18n('Wallet RPC Username'),
    description: null,
    warning: i18n(
      "Changing this value will necessitate a restart of all services that depend on Monero's wallet RPC.",
    ),
    required: true,
    default: 'monero_wallet',
    patterns: alphanumUnderscore,
  }),
  password: Value.text({
    name: i18n('Wallet RPC Password'),
    description: null,
    warning: i18n(
      "Changing this value will necessitate a restart of all services that depend on Monero's wallet RPC.",
    ),
    required: true,
    default: { charset: 'a-z,A-Z,0-9', len: 22 },
    patterns: alphanumUnderscore,
    masked: true,
    generate: { charset: 'a-z,A-Z,0-9', len: 22 },
  }),
})

export const generateWalletRpcLogin = () =>
  `monero_wallet:${utils.getDefaultString({ charset: 'a-z,A-Z,0-9', len: 22 })}`

export const parseWalletRpcLogin = (login: string | null | undefined) => {
  const colonIdx = login?.indexOf(':') ?? -1
  return login && colonIdx > 0
    ? {
        username: login.substring(0, colonIdx),
        password: login.substring(colonIdx + 1),
      }
    : null
}
