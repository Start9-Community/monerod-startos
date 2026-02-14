import { T } from '@start9labs/start-sdk'
import { moneroConfFile } from '../../fileModels/monero.conf'
import { sdk } from '../../sdk'
import { i18n } from '../../i18n'
import { moneroConfDefaults, zmqPort, zmqPubsubPort } from '../../utils'

const { InputSpec, Value } = sdk

const defaultMaxbytesMiB = moneroConfDefaults['max-txpool-weight'] / 1000000

const otherSpec = InputSpec.of({
  maxbytes: Value.number({
    name: i18n('Maximum TX Pool Size'),
    description: i18n(
      'Keep the unconfirmed transaction memory pool at or below this many megabytes. You may wish to decrease this if you are low on RAM, or increase if you are mining. Default: 648 MiB.',
    ),
    required: true,
    default: defaultMaxbytesMiB,
    integer: true,
    min: 1,
    units: i18n('MiB'),
  }),
  zmq: Value.toggle({
    name: i18n('ZMQ Interface'),
    description: i18n(
      'Enable the ZeroMQ interface for real-time block and transaction notifications. Required by some services such as block explorers and mining software. Default: Disabled',
    ),
    default: moneroConfDefaults['no-zmq'] === undefined,
  }),
  pruning: Value.toggle({
    name: i18n('Pruning'),
    description: i18n(
      'Blockchain pruning prunes proof data from transactions after verification but before storage. Saves roughly 2/3 of disk space. Default: Disabled',
    ),
    default: moneroConfDefaults['prune-blockchain'] !== undefined,
  }),
  btcpayserver: Value.toggle({
    name: i18n('BTCPayServer'),
    description: i18n(
      'Send notifications of new Monero blocks to the BTCPayServer back-end. Default: Disabled',
    ),
    default: moneroConfDefaults['block-notify'] !== undefined,
  }),
})

type OtherSpec = typeof otherSpec._TYPE
type PartialOtherSpec = typeof otherSpec._PARTIAL

export const otherConfig = sdk.Action.withInput(
  'other-config',

  async ({ effects }) => ({
    name: i18n('Other Settings'),
    description: i18n('Configure mempool, ZMQ, pruning, and integrations'),
    warning: null,
    allowedStatuses: 'any',
    group: i18n('Configuration'),
    visibility: 'enabled',
  }),

  otherSpec,

  ({ effects }) => read(effects),

  ({ effects, input }) => write(effects, input),
)

async function read(effects: any): Promise<PartialOtherSpec> {
  const conf = await moneroConfFile.read().const(effects)
  if (!conf) return {}

  const maxbytes = Math.round(conf['max-txpool-weight'] / 1000000)
  const zmq = conf['no-zmq'] === undefined || conf['no-zmq'] === 0
  const pruning =
    conf['prune-blockchain'] !== undefined && conf['prune-blockchain'] !== 0
  const btcpayserver = conf['block-notify'] !== undefined

  return { maxbytes, zmq, pruning, btcpayserver }
}

async function write(effects: T.Effects, input: OtherSpec) {
  await moneroConfFile.merge(effects, {
    'max-txpool-weight': input.maxbytes * 1000000,
    'prune-blockchain': input.pruning ? 1 : undefined,
    'block-notify': input.btcpayserver
      ? '/usr/bin/curl -so /dev/null -X GET http://btcpayserver.embassy:23000/monerolikedaemoncallback/block?cryptoCode=xmr&hash=%s'
      : undefined,
    'no-zmq': input.zmq ? undefined : 1,
    'zmq-rpc-bind-ip': input.zmq ? '0.0.0.0' : undefined,
    'zmq-rpc-bind-port': input.zmq ? zmqPort : undefined,
    'zmq-pub': input.zmq ? `tcp://0.0.0.0:${zmqPubsubPort}` : undefined,
  })
}
