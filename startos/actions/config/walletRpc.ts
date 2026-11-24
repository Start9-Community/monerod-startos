import {
  parseWalletRpcLogin,
  walletRpcConfFile,
  walletRpcConfigSpec,
} from '../../fileModels/monero-wallet-rpc.conf'
import { sdk } from '../../sdk'
import { i18n } from '../../i18n'

export const walletRpcConfig = sdk.Action.withInput(
  'wallet-rpc-config',

  async ({ effects }) => ({
    name: i18n('Wallet RPC Settings'),
    description: i18n('Configure Monero wallet RPC credentials'),
    warning: null,
    allowedStatuses: 'any',
    group: i18n('Configuration'),
    visibility: 'enabled',
  }),

  walletRpcConfigSpec,

  async ({ effects }) =>
    walletRpcConfFile.read((c) => parseWalletRpcLogin(c['rpc-login'])).once(),

  async ({ effects, input }) => {
    await walletRpcConfFile.merge(effects, {
      'rpc-login': `${input.username}:${input.password}`,
    })
  },
)

export const walletRpcCredentials = sdk.Action.withoutInput(
  'wallet-rpc-credentials',

  async ({ effects }) => ({
    name: i18n('Wallet RPC Credentials'),
    description: i18n(
      'Show the username and password that clients use to connect to the Wallet RPC Interface',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: i18n('Configuration'),
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const creds = await walletRpcConfFile
      .read((c) => parseWalletRpcLogin(c['rpc-login']))
      .once()
    if (!creds) throw new Error(i18n('Wallet RPC credentials are not set'))

    return {
      version: '1',
      title: i18n('Wallet RPC Credentials'),
      message: i18n(
        'Every client of the Wallet RPC Interface must authenticate with these credentials.',
      ),
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: i18n('Wallet RPC Username'),
            description: null,
            value: creds.username,
            masked: false,
            copyable: true,
            qr: false,
            launchable: false,
          },
          {
            type: 'single',
            name: i18n('Wallet RPC Password'),
            description: null,
            value: creds.password,
            masked: true,
            copyable: true,
            qr: false,
            launchable: false,
          },
        ],
      },
    }
  },
)
