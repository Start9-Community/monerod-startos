import { rm } from 'fs/promises'
import { moneroConfFile } from './fileModels/monero.conf'
import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import {
  p2pLocalBindPort,
  p2pPort,
  rpcRestrictedPort,
  torSocksPort,
  walletRpcPort,
} from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  /**
   * ======================== Setup ========================
   */
  console.info(i18n('Starting Monero!'))

  // Watch monero.conf so daemon restarts when the file changes
  await moneroConfFile.read().const(effects)

  // Anonymity intents live in store.json and drive the Tor CLI args below.
  // init seeds store.json, so the read is guaranteed non-null here.
  const store = (await storeJson.read().const(effects))!
  const anyTorUse =
    store.outboundProxy === 'tor' || store.torOutbound || store.torInbound

  // Tor container IP — restarts monerod if it changes
  const torIp = await sdk.getContainerIp(effects, { packageId: 'tor' }).const()

  // Peer interface's own onion URL — restarts monerod if it changes.
  // Needed to construct --anonymous-inbound.
  const peerOnionUrl = await sdk.serviceInterface
    .getOwn(effects, 'peer', (iface) =>
      (iface?.addressInfo?.public.format() || []).find((url) =>
        url.includes('.onion'),
      ),
    )
    .const()
  const peerOnionHost = peerOnionUrl ? new URL(peerOnionUrl).hostname : ''

  // Track Tor running status for health check display (no restart)
  let torRunning = false
  if (torIp) {
    sdk.getStatus(effects, { packageId: 'tor' }).onChange((status) => {
      torRunning = status?.desired.main === 'running'
      return { cancel: false }
    })
  }

  const anonymityArgs: string[] = []
  if (torIp && store.outboundProxy === 'tor') {
    anonymityArgs.push('--proxy', `${torIp}:${torSocksPort}`)
  }
  if (torIp && store.torOutbound) {
    const txProxy =
      `tor,${torIp}:${torSocksPort},${store.torMaxOutboundConns ?? 16}` +
      (store.torDandelionNoise === false ? ',disable_noise' : '')
    anonymityArgs.push('--tx-proxy', txProxy)
  }
  if (torIp && store.torInbound && peerOnionHost) {
    anonymityArgs.push(
      '--anonymous-inbound',
      `${peerOnionHost}:${p2pPort},127.0.0.1:${p2pLocalBindPort},${store.torMaxInboundConns ?? 16}`,
    )
  }
  if (store.padTransactions) {
    anonymityArgs.push('--pad-transactions')
  }

  const inboundReady = torIp && store.torInbound && !!peerOnionHost

  /**
   * ======================== Subcontainers ========================
   */
  const monerodSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'monerod' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'monerod',
      subpath: null,
      mountpoint: '/home/monero/.bitmonero',
      readonly: false,
    }),
    'monerod',
  )

  const walletRpcSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'wallet-rpc' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'wallet',
      subpath: null,
      mountpoint: '/home/monero/wallet',
      readonly: false,
    }),
    'wallet-rpc',
  )

  /**
   * ======================== Maintenance flags ========================
   */
  const { dbSalvage, resync } = (await storeJson.read().once()) || {
    dbSalvage: false,
    resync: false,
  }

  if (dbSalvage) {
    await monerodSub.exec(
      [
        'monerod',
        '--non-interactive',
        '--db-salvage',
        '--data-dir',
        '/home/monero/.bitmonero',
      ],
      { user: 'root' },
    )
    await storeJson.merge(effects, { dbSalvage: false })
  }

  if (resync) {
    await rm(`${monerodSub.rootfs}/home/monero/.bitmonero/lmdb`, {
      force: true,
      recursive: true,
    })
    await storeJson.merge(effects, { resync: false })
  }

  /**
   * ======================== Daemons ========================
   */
  return sdk.Daemons.of(effects)
    .addOneshot('chown-monerod', {
      subcontainer: monerodSub,
      exec: {
        command: ['chown', '-R', 'monero:monero', '/home/monero/.bitmonero'],
        user: 'root',
      },
      requires: [],
    })
    .addOneshot('chown-wallet', {
      subcontainer: walletRpcSub,
      exec: {
        command: ['chown', '-R', 'monero:monero', '/home/monero/wallet'],
        user: 'root',
      },
      requires: [],
    })
    .addDaemon('monerod', {
      subcontainer: monerodSub,
      exec: {
        command: [
          'monerod',
          '--non-interactive',
          '--config-file',
          '/home/monero/.bitmonero/monero.conf',
          ...anonymityArgs,
        ],
      },
      ready: {
        display: i18n('Monero Daemon'),
        gracePeriod: 30_000,
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, rpcRestrictedPort, {
            successMessage: i18n('Monero RPC is ready and accepting requests'),
            errorMessage: i18n('Monero RPC is unreachable'),
          }),
      },
      requires: ['chown-monerod'],
    })
    .addDaemon('wallet-rpc', {
      subcontainer: walletRpcSub,
      exec: {
        command: [
          'monero-wallet-rpc',
          '--non-interactive',
          '--config-file',
          '/home/monero/wallet/monero-wallet-rpc.conf',
        ],
      },
      ready: {
        display: i18n('Wallet RPC'),
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, walletRpcPort, {
            successMessage: i18n('Wallet RPC is ready'),
            errorMessage: i18n('Wallet RPC is unreachable'),
          }),
      },
      requires: ['monerod', 'chown-wallet'],
    })
    .addHealthCheck('sync-progress', {
      ready: {
        display: i18n('Blockchain Sync Progress'),
        fn: async () => {
          try {
            const res = await fetch(
              `http://127.0.0.1:${rpcRestrictedPort}/json_rpc`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  jsonrpc: '2.0',
                  id: '0',
                  method: 'get_info',
                }),
              },
            )

            if (!res.ok) {
              return {
                message: `${i18n('Unexpected RPC response')}: ${res.status}`,
                result: 'failure',
              }
            }

            const info = ((await res.json()) as any)?.result
            if (info?.synchronized) {
              return {
                message: i18n('Monero is fully synced'),
                result: 'success',
              }
            }

            const height = info?.height ?? 0
            const target = info?.target_height ?? 0
            if (target > 0 && target > height) {
              const percentage = ((height * 100) / target).toFixed(2)
              return {
                message: i18n('Syncing blocks...${percentage}%', {
                  percentage,
                }),
                result: 'loading',
              }
            }

            return {
              message: i18n('Syncing blocks...'),
              result: 'loading',
            }
          } catch {
            return {
              message: i18n('Monero is starting…'),
              result: 'starting',
            }
          }
        },
      },
      requires: ['monerod'],
    })
    .addHealthCheck('tor', {
      ready: {
        display: 'Tor',
        fn: () => {
          if (!anyTorUse) {
            return {
              result: 'disabled',
              message: i18n('No Tor intents enabled'),
            }
          }
          if (!torIp) {
            return {
              result: 'disabled',
              message: i18n('Tor is not installed'),
            }
          }
          if (!torRunning) {
            return {
              result: 'disabled',
              message: i18n('Tor is not running'),
            }
          }
          return {
            result: 'success',
            message: inboundReady
              ? i18n('Inbound and outbound connections')
              : i18n('Outbound only'),
          }
        },
      },
      requires: [],
    })
    .addHealthCheck('clearnet', {
      ready: {
        display: i18n('Clearnet'),
        fn: () => {
          if (store.outboundProxy !== 'none') {
            return {
              result: 'disabled',
              message: i18n('Excluded by outbound proxy'),
            }
          }
          return {
            result: 'success',
            message: i18n('Inbound and outbound connections'),
          }
        },
      },
      requires: [],
    })
})
