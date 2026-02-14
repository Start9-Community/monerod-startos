import { T } from '@start9labs/start-sdk'
import { moneroConfFile } from '../../fileModels/monero.conf'
import { walletRpcConfFile } from '../../fileModels/monero-wallet-rpc.conf'
import { sdk } from '../../sdk'
import { i18n } from '../../i18n'

const { InputSpec, Value, Variants } = sdk

const alphanumUnderscore = [
  {
    regex: '^[a-zA-Z0-9_]+$',
    description: i18n(
      'Must be alphanumeric and/or can contain an underscore',
    ),
  },
]

const rpcSpec = InputSpec.of({
  'rpc-credentials': Value.union({
    name: i18n('RPC Credentials'),
    description: i18n(
      'Enable or disable a username and password to access the Monero RPC. Default: Disabled',
    ),
    default: 'disabled',
    variants: Variants.of({
      disabled: {
        name: i18n('Disabled'),
        spec: InputSpec.of({}),
      },
      enabled: {
        name: i18n('Enabled'),
        spec: InputSpec.of({
          username: Value.text({
            name: i18n('RPC Username'),
            description: i18n(
              "The username for connecting to Monero's unrestricted RPC interface",
            ),
            warning: i18n(
              'Changing this value will necessitate a restart of all services that depend on Monero.',
            ),
            required: true,
            default: 'monero',
            patterns: alphanumUnderscore,
          }),
          password: Value.text({
            name: i18n('RPC Password'),
            description: i18n(
              "The password for connecting to Monero's unrestricted RPC interface",
            ),
            warning: i18n(
              'Changing this value will necessitate a restart of all services that depend on Monero.',
            ),
            required: true,
            default: { charset: 'a-z,A-Z,0-9', len: 22 },
            patterns: alphanumUnderscore,
            masked: true,
            generate: { charset: 'a-z,A-Z,0-9', len: 22 },
          }),
        }),
      },
    }),
  }),
  'wallet-rpc-credentials': Value.union({
    name: i18n('Wallet RPC Credentials'),
    description: i18n(
      'Enable or disable a username and password to access the Monero wallet RPC. Default: Disabled',
    ),
    default: 'disabled',
    variants: Variants.of({
      disabled: {
        name: i18n('Disabled'),
        spec: InputSpec.of({}),
      },
      enabled: {
        name: i18n('Enabled'),
        spec: InputSpec.of({
          username: Value.text({
            name: i18n('Wallet RPC Username'),
            description: i18n(
              "The username for connecting to Monero's wallet RPC interface",
            ),
            warning: i18n(
              "Changing this value will necessitate a restart of all services that depend on Monero's wallet RPC.",
            ),
            required: true,
            default: 'monero_wallet',
            patterns: alphanumUnderscore,
          }),
          password: Value.text({
            name: i18n('Wallet RPC Password'),
            description: i18n(
              "The password for connecting to Monero's wallet RPC interface",
            ),
            warning: i18n(
              "Changing this value will necessitate a restart of all services that depend on Monero's wallet RPC.",
            ),
            required: true,
            default: { charset: 'a-z,A-Z,0-9', len: 22 },
            patterns: alphanumUnderscore,
            masked: true,
            generate: { charset: 'a-z,A-Z,0-9', len: 22 },
          }),
        }),
      },
    }),
  }),
})

type RpcSpec = typeof rpcSpec._TYPE
type PartialRpcSpec = typeof rpcSpec._PARTIAL

export const rpcConfig = sdk.Action.withInput(
  'rpc-config',

  async ({ effects }) => ({
    name: i18n('RPC Settings'),
    description: i18n('Configure RPC and wallet RPC credentials'),
    warning: null,
    allowedStatuses: 'any',
    group: i18n('Configuration'),
    visibility: 'enabled',
  }),

  rpcSpec,

  ({ effects }) => read(effects),

  ({ effects, input }) => write(effects, input),
)

async function read(effects: any): Promise<PartialRpcSpec> {
  const conf = await moneroConfFile.read().const(effects)
  const walletConf = await walletRpcConfFile.read().const(effects)
  if (!conf) return {}

  let rpcCredentials: any = { selection: 'disabled', value: {} }
  if (conf['rpc-login']) {
    const colonIdx = conf['rpc-login'].indexOf(':')
    if (colonIdx > 0) {
      rpcCredentials = {
        selection: 'enabled',
        value: {
          username: conf['rpc-login'].substring(0, colonIdx),
          password: conf['rpc-login'].substring(colonIdx + 1),
        },
      }
    }
  }

  let walletRpcCredentials: any = { selection: 'disabled', value: {} }
  if (walletConf?.['rpc-login']) {
    const colonIdx = walletConf['rpc-login'].indexOf(':')
    if (colonIdx > 0) {
      walletRpcCredentials = {
        selection: 'enabled',
        value: {
          username: walletConf['rpc-login'].substring(0, colonIdx),
          password: walletConf['rpc-login'].substring(colonIdx + 1),
        },
      }
    }
  }

  return {
    'rpc-credentials': rpcCredentials,
    'wallet-rpc-credentials': walletRpcCredentials,
  }
}

async function write(effects: T.Effects, input: RpcSpec) {
  const rpcCreds = input['rpc-credentials']
  const walletCreds = input['wallet-rpc-credentials']

  const rpcLogin =
    rpcCreds.selection === 'enabled'
      ? `${rpcCreds.value.username}:${rpcCreds.value.password}`
      : undefined

  const walletRpcLogin =
    walletCreds.selection === 'enabled'
      ? `${walletCreds.value.username}:${walletCreds.value.password}`
      : undefined

  await moneroConfFile.merge(effects, {
    'rpc-login': rpcLogin,
  })

  await walletRpcConfFile.merge(effects, {
    'rpc-login': walletRpcLogin,
    'disable-rpc-login': walletRpcLogin ? undefined : 1,
    'daemon-login': rpcLogin,
  })
}
