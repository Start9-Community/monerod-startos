export const rpcRestrictedPort = 18089
export const rpcPort = 18081
export const p2pPort = 18080
/** Unexported port on the peer host where Tor delivers onion peers to monerod's anonymous-inbound listener. */
export const p2pOnionPort = 18084
export const zmqPort = 18082
export const zmqPubsubPort = 18083
export const walletRpcPort = 28088

// Dependents mount this volume read-only, never `monerod`, which holds the chain and the config.
export const rpcVolumeId = 'public'
// `username:password` while daemon RPC credentials are on; absent while they are off.
export const rpcLoginFileName = 'rpc-login'

// Host ids (the `sdk.MultiHost.of` groups) — distinct from the interface ids
// exported on them. Used for `sdk.host.getOwn`/`get` lookups. Dependents
// (e.g. btcpayserver) import these rather than hardcoding string literals.
export const peerHostId = 'peer'
export const rpcRestrictedHostId = 'rpc-restricted'
export const walletRpcHostId = 'rpc-wallet'
export const zmqPubsubHostId = 'zmq-pubsub'

// Interface ids (the exported service interfaces on the hosts above).
export const peerInterfaceId = 'peer'
export const rpcRestrictedInterfaceId = 'rpc-restricted'
export const walletRpcInterfaceId = 'rpc-wallet'
export const zmqPubsubInterfaceId = 'zmq-pubsub'
