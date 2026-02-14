import { rm } from 'fs/promises'
import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { rpcRestrictedPort, walletRpcPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  /**
   * ======================== Setup ========================
   */
  console.info(i18n('Starting Monero!'))

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
                result: 'failure' as const,
              }
            }

            const info = ((await res.json()) as any)?.result
            if (info?.synchronized) {
              return {
                message: i18n('Monero is fully synced'),
                result: 'success' as const,
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
                result: 'loading' as const,
              }
            }

            return {
              message: i18n('Syncing blocks...'),
              result: 'loading' as const,
            }
          } catch {
            return {
              message: i18n('Monero is starting…'),
              result: 'starting' as const,
            }
          }
        },
      },
      requires: ['monerod'],
    })
})
