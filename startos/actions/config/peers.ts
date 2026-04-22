import { fullConfigSpec, moneroConfFile } from '../../fileModels/monero.conf'
import { i18n } from '../../i18n'
import { sdk } from '../../sdk'

export const peersConfig = sdk.Action.withInput(
  'peers-config',

  async ({ effects }) => ({
    name: i18n('Peer Settings'),
    description: i18n('Configure peer and rate limit settings'),
    warning: null,
    allowedStatuses: 'any',
    group: i18n('Configuration'),
    visibility: 'enabled',
  }),

  fullConfigSpec.filter({
    'in-peers': true,
    'out-peers': true,
    'hide-my-port': true,
    'public-node': true,
    'strict-nodes': true,
    peer: true,
    'disable-rpc-ban': true,
    'limit-rate-down': true,
    'limit-rate-up': true,
  }),

  ({ effects }) => moneroConfFile.read().once(),

  ({ effects, input }) => moneroConfFile.merge(effects, input),
)
