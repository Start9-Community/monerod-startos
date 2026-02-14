import { T } from '@start9labs/start-sdk'
import { moneroConfFile } from '../../fileModels/monero.conf'
import { sdk } from '../../sdk'
import { i18n } from '../../i18n'
import {
  moneroConfDefaults,
  torDefaults,
  p2pPort,
  toTorSettings,
  fromTorSettings,
  anonymousInbound,
} from '../../utils'

const { InputSpec, Value, List } = sdk

const peerSpec = InputSpec.of({
  hostname: Value.text({
    name: i18n('Hostname'),
    description: i18n('Domain name, onion or IP address of Monero peer.'),
    required: true,
    default: null,
    patterns: [
      {
        regex:
          '(^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$)|((^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$)|(^[a-z2-7]{16}\\.onion$)|(^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$)',
        description: i18n('Hostname'),
      },
    ],
  }),
  port: Value.number({
    name: i18n('Port'),
    description: i18n(
      'TCP Port that peer is listening on for inbound p2p connections. Default: 18080',
    ),
    required: false,
    default: p2pPort,
    integer: true,
    min: 0,
    max: 65535,
  }),
  priority: Value.toggle({
    name: i18n('Priority Node'),
    description: i18n(
      'Attempt to stay perpetually connected to this peer',
    ),
    default: false,
  }),
})

const networkingSpec = InputSpec.of({
  'in-peers': Value.number({
    name: i18n('Max Peers Incoming'),
    description: i18n(
      'Maximum number of simultaneous peers connecting inbound to the Monero daemon. Default: 24',
    ),
    required: false,
    default: moneroConfDefaults['in-peers'],
    integer: true,
    min: 0,
    max: 9999,
  }),
  'out-peers': Value.number({
    name: i18n('Max Peers Outgoing'),
    description: i18n(
      'Maximum number of simultaneous peers for the Monero daemon to connect outbound to. Default: 12',
    ),
    required: false,
    default: moneroConfDefaults['out-peers'],
    integer: true,
    min: 0,
    max: 9999,
  }),
  gossip: Value.toggle({
    name: i18n('Peer Gossip'),
    description: i18n(
      'Disabling peer gossip will tell connected peers not to gossip your node info to their peers. This will make your node more private. Leaving this enabled will result in more connections for your node. Default: Enabled',
    ),
    default: moneroConfDefaults['hide-my-port'] === undefined,
  }),
  'ban-list': Value.toggle({
    name: i18n('Spy Nodes Ban List'),
    description: i18n(
      'Use a third-party provided list to ban known spy nodes. Default: Enabled',
    ),
    default: moneroConfDefaults['ban-list'] !== undefined,
  }),
  'public-node': Value.toggle({
    name: i18n('Advertise RPC Remote Node'),
    description: i18n(
      'Advertise on the P2P network that your restricted RPC port offers Remote Node services. Caution: this could significantly increase resource use. Default: Disabled',
    ),
    default: moneroConfDefaults['public-node'] !== undefined,
  }),
  'strict-nodes': Value.toggle({
    name: i18n('Specific Nodes Only'),
    description: i18n(
      'Only connect to the peers specified below and no other peers. Default: Disabled',
    ),
    default: moneroConfDefaults['add-exclusive-node'] !== undefined,
  }),
  peer: Value.list(
    List.obj(
      {
        name: i18n('Add Peers'),
        description: i18n(
          'Optionally add addresses of specific p2p nodes that your Monero node should connect to',
        ),
        default: [],
        minLength: null,
        maxLength: null,
      },
      {
        spec: peerSpec,
        displayAs: null,
        uniqueBy: null,
      },
    ),
  ),
  toronly: Value.toggle({
    name: i18n('Tor Only'),
    description: i18n(
      'Only communicate with Monero nodes via Tor. This is more private, but can be slower, especially during initial sync. Default: Enabled',
    ),
    default: torDefaults.toronly,
  }),
  'rpc-ban': Value.toggle({
    name: i18n('Ban Misbehaving RPC Clients'),
    description: i18n(
      'Ban hosts that generate RPC errors. Leaving disabled may help prevent monerod from banning traffic originating from the Tor daemon. Default: Disabled',
    ),
    default: moneroConfDefaults['disable-rpc-ban'] === undefined,
  }),
  maxonionconns: Value.number({
    name: i18n('Max Tor RPC Connections'),
    description: i18n(
      "Maximum number of simultaneous connections allowed to Monero's .onion RPC. Default: 16",
    ),
    required: true,
    default: torDefaults.maxonionconns,
    integer: true,
    min: 1,
    max: 256,
    units: i18n('Connections'),
  }),
  maxsocksconns: Value.number({
    name: i18n('Max Tor Broadcast Connections'),
    description: i18n(
      "Maximum number of simultaneous connections to Tor's SOCKS proxy when broadcasting transactions. Default: 16",
    ),
    required: true,
    default: torDefaults.maxsocksconns,
    integer: true,
    min: 1,
    max: 256,
    units: i18n('Connections'),
  }),
  dandelion: Value.toggle({
    name: i18n('Dandelion++'),
    description: i18n(
      'Enables white noise and Dandelion++ sender node obfuscation scheme. Default: Enabled',
    ),
    default: torDefaults.dandelion,
  }),
  'limit-rate-down': Value.number({
    name: i18n('Download Speed Limit'),
    description: i18n(
      "Keep the Monero p2p node's incoming bandwidth rate limited at or under this many kilobytes per second. Default: 8192 kB/s",
    ),
    required: true,
    default: moneroConfDefaults['limit-rate-down'],
    integer: true,
    min: 1,
    units: i18n('kB/s'),
  }),
  'limit-rate-up': Value.number({
    name: i18n('Upload Speed Limit'),
    description: i18n(
      "Keep the Monero p2p node's outgoing bandwidth rate limited at or under this many kilobytes per second. Default: 2048 kB/s",
    ),
    required: true,
    default: moneroConfDefaults['limit-rate-up'],
    integer: true,
    min: 1,
    units: i18n('kB/s'),
  }),
})

type NetworkingSpec = typeof networkingSpec._TYPE
type PartialNetworkingSpec = typeof networkingSpec._PARTIAL

export const networkingConfig = sdk.Action.withInput(
  'networking-config',

  async ({ effects }) => ({
    name: i18n('Networking Settings'),
    description: i18n('Configure peer, Tor, and rate limit settings'),
    warning: null,
    allowedStatuses: 'any',
    group: i18n('Configuration'),
    visibility: 'enabled',
  }),

  networkingSpec,

  ({ effects }) => read(effects),

  ({ effects, input }) => write(effects, input),
)

function parsePeerString(
  s: string,
): { hostname: string; port: number } | null {
  const [hostname, portStr] = s.split(':')
  if (!hostname) return null
  return { hostname, port: Number(portStr) || p2pPort }
}

function toArray(val: string | string[] | undefined): string[] {
  if (!val) return []
  return Array.isArray(val) ? val : [val]
}

async function read(effects: any): Promise<PartialNetworkingSpec> {
  const conf = await moneroConfFile.read().const(effects)
  if (!conf) return {}

  const gossip = conf['hide-my-port'] === undefined
  const strictNodes = conf['add-exclusive-node'] !== undefined
  const tor = fromTorSettings(conf)

  const peer: Array<{
    hostname: string
    port: number
    priority: boolean
  }> = []
  if (strictNodes) {
    for (const node of toArray(conf['add-exclusive-node'])) {
      const parsed = parsePeerString(node)
      if (parsed) peer.push({ ...parsed, priority: false })
    }
  } else {
    for (const node of toArray(conf['add-peer'])) {
      const parsed = parsePeerString(node)
      if (parsed) peer.push({ ...parsed, priority: false })
    }
    for (const node of toArray(conf['add-priority-node'])) {
      const parsed = parsePeerString(node)
      if (parsed) peer.push({ ...parsed, priority: true })
    }
  }

  return {
    'in-peers': conf['in-peers'],
    'out-peers': conf['out-peers'],
    gossip,
    'ban-list': conf['ban-list'] !== undefined,
    'public-node':
      conf['public-node'] !== undefined && conf['public-node'] !== 0,
    'strict-nodes': strictNodes,
    peer,
    ...tor,
    'rpc-ban': conf['disable-rpc-ban'] === undefined,
    'limit-rate-down': conf['limit-rate-down'],
    'limit-rate-up': conf['limit-rate-up'],
  }
}

async function write(effects: T.Effects, input: NetworkingSpec) {
  const peerHost = await effects.getHostInfo({ hostId: 'peer' })
  const peerTorAddress = peerHost?.onions?.[0] || ''

  const peerAddr = (p: { hostname: string; port: number | null }) =>
    p.port != null ? `${p.hostname}:${p.port}` : p.hostname
  const regular = input.peer.filter((p) => !p.priority)
  const priority = input.peer.filter((p) => p.priority)

  await moneroConfFile.merge(effects, {
    'out-peers': input['out-peers'] as number | undefined,
    'in-peers': input['in-peers'] as number | undefined,
    'limit-rate-up': input['limit-rate-up'],
    'limit-rate-down': input['limit-rate-down'],
    'disable-rpc-ban': input['rpc-ban'] ? undefined : 1,
    'public-node': input['public-node'] ? 1 : undefined,
    'ban-list': input['ban-list']
      ? '/home/monero/ban_list.txt'
      : undefined,
    'hide-my-port': input.gossip ? undefined : 1,
    igd: !input.gossip || input.toronly ? 'disabled' : undefined,
    'add-peer':
      !input['strict-nodes'] && regular.length > 0
        ? regular.map(peerAddr)
        : undefined,
    'add-priority-node':
      !input['strict-nodes'] && priority.length > 0
        ? priority.map(peerAddr)
        : undefined,
    'add-exclusive-node':
      input['strict-nodes'] && input.peer.length > 0
        ? input.peer.map(peerAddr)
        : undefined,
    ...toTorSettings({
      toronly: input.toronly,
      maxsocksconns: input.maxsocksconns,
      maxonionconns: input.maxonionconns,
      dandelion: input.dandelion,
    }),
    'anonymous-inbound':
      input.toronly && input.gossip && peerTorAddress
        ? anonymousInbound(peerTorAddress, input.maxonionconns)
        : undefined,
  })
}
