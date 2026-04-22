import { moneroConfFile } from './fileModels/monero.conf'
import { i18n } from './i18n'
import { sdk } from './sdk'
import {
  p2pPort,
  rpcRestrictedPort,
  walletRpcPort,
  zmqPort,
  zmqPubsubPort,
} from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const receipts = []

  // Peer-to-peer interface
  const peerMulti = sdk.MultiHost.of(effects, 'peer')
  const peerOrigin = await peerMulti.bindPort(p2pPort, {
    protocol: null,
    addSsl: null,
    preferredExternalPort: p2pPort,
    secure: { ssl: false },
  })
  const peer = sdk.createInterface(effects, {
    name: i18n('Peer Interface'),
    id: 'peer',
    description: i18n(
      'The peer-to-peer interface for exchanging blocks and transactions',
    ),
    type: 'p2p',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })
  receipts.push(await peerOrigin.export([peer]))

  // Restricted RPC interface
  const rpcMulti = sdk.MultiHost.of(effects, 'rpc-restricted')
  const rpcOrigin = await rpcMulti.bindPort(rpcRestrictedPort, {
    protocol: 'http',
    preferredExternalPort: rpcRestrictedPort,
  })
  const rpc = sdk.createInterface(effects, {
    name: i18n('RPC Interface'),
    id: 'rpc-restricted',
    description: i18n('The restricted RPC interface for wallet connections'),
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })
  receipts.push(await rpcOrigin.export([rpc]))

  // Wallet RPC interface
  const walletMulti = sdk.MultiHost.of(effects, 'rpc-wallet')
  const walletOrigin = await walletMulti.bindPort(walletRpcPort, {
    protocol: 'http',
    preferredExternalPort: walletRpcPort,
  })
  const wallet = sdk.createInterface(effects, {
    name: i18n('Wallet RPC Interface'),
    id: 'rpc-wallet',
    description: i18n(
      'The wallet RPC interface for server-side wallet management',
    ),
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })
  receipts.push(await walletOrigin.export([wallet]))

  // ZMQ interfaces (only when ZMQ is enabled in config)
  const conf = await moneroConfFile.read().once()
  if (conf && conf.zmq) {
    const zmqMulti = sdk.MultiHost.of(effects, 'zmq')
    const zmqOrigin = await zmqMulti.bindPort(zmqPort, {
      preferredExternalPort: zmqPort,
      addSsl: null,
      secure: { ssl: false },
      protocol: null,
    })
    const zmq = sdk.createInterface(effects, {
      name: i18n('ZeroMQ Interface'),
      id: 'zmq',
      description: i18n(
        'The ZeroMQ interface for block and transaction notifications',
      ),
      type: 'api',
      masked: false,
      schemeOverride: null,
      username: null,
      path: '',
      query: {},
    })
    receipts.push(await zmqOrigin.export([zmq]))

    const zmqPubMulti = sdk.MultiHost.of(effects, 'zmq-pubsub')
    const zmqPubOrigin = await zmqPubMulti.bindPort(zmqPubsubPort, {
      preferredExternalPort: zmqPubsubPort,
      protocol: null,
      addSsl: null,
      secure: { ssl: false },
    })
    const zmqPub = sdk.createInterface(effects, {
      name: i18n('ZeroMQ Pub-Sub Interface'),
      id: 'zmq-pubsub',
      description: i18n('The ZeroMQ publish-subscribe interface'),
      type: 'api',
      masked: false,
      schemeOverride: null,
      username: null,
      path: '',
      query: {},
    })
    receipts.push(await zmqPubOrigin.export([zmqPub]))
  }

  return receipts
})
