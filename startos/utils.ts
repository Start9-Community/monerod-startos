import { T } from '@start9labs/start-sdk'
import { sdk } from './sdk'

/**
 * Bridge address (`10.0.3.1:<assigned external port>`) of a dependency's
 * binding, as a minimal reactive value. Chain `.const()` in main: the mapped
 * string only changes when the address itself does, so main restarts exactly
 * on dependency install/uninstall/port-change and never on dependency
 * updates. Chain `.once()` in an action context. `fallbackPort` keeps the
 * value non-null while the dependency is absent — sanctioned only for tor's
 * allocator-guaranteed SOCKS 9050. Drop-in for the planned SDK
 * `sdk.host.getBridgeAddress` helper.
 */
export function bridgeAddress(
  effects: T.Effects,
  opts: {
    packageId: string
    hostId: string
    internalPort: number
    fallbackPort: number
  },
): { const(): Promise<string>; once(): Promise<string> }
export function bridgeAddress(
  effects: T.Effects,
  opts: { packageId: string; hostId: string; internalPort: number },
): { const(): Promise<string | null>; once(): Promise<string | null> }
export function bridgeAddress(
  effects: T.Effects,
  opts: {
    packageId: string
    hostId: string
    internalPort: number
    fallbackPort?: number
  },
) {
  const watchable = async () => {
    const osIp = await sdk.getOsIp(effects)
    return sdk.host.get(
      effects,
      { packageId: opts.packageId, hostId: opts.hostId },
      (host) => {
        const port =
          host?.bindings[opts.internalPort]?.net.assignedPort ??
          opts.fallbackPort
        return port != null ? `${osIp}:${port}` : null
      },
    )
  }
  return {
    const: async () => (await watchable()).const(),
    once: async () => (await watchable()).once(),
  }
}

export const rpcRestrictedPort = 18089
export const rpcPort = 18081
export const p2pPort = 18080
export const p2pLocalBindPort = 18084
export const zmqPort = 18082
export const zmqPubsubPort = 18083
export const walletRpcPort = 28088

// Host ids (the `sdk.MultiHost.of` groups) — distinct from the interface ids
// exported on them. Used for `sdk.host.getOwn`/`get` lookups. Dependents
// (e.g. btcpayserver) import these rather than hardcoding string literals.
export const peerHostId = 'peer'
export const rpcRestrictedHostId = 'rpc-restricted'
export const walletRpcHostId = 'rpc-wallet'
export const zmqHostId = 'zmq'
export const zmqPubsubHostId = 'zmq-pubsub'

// Interface ids (the exported service interfaces on the hosts above).
export const peerInterfaceId = 'peer'
export const rpcRestrictedInterfaceId = 'rpc-restricted'
export const walletRpcInterfaceId = 'rpc-wallet'
export const zmqInterfaceId = 'zmq'
export const zmqPubsubInterfaceId = 'zmq-pubsub'
