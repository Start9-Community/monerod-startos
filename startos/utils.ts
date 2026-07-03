export const rpcRestrictedPort = 18089
export const rpcPort = 18081
export const p2pPort = 18080
export const p2pLocalBindPort = 18084
export const zmqPort = 18082
export const zmqPubsubPort = 18083
export const walletRpcPort = 28088
export const torSocksPort = 9050

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
