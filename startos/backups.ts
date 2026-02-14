import { sdk } from './sdk'

export const { createBackup, restoreInit } = sdk.setupBackups(
  async ({ effects }) =>
    sdk.Backups.ofVolumes('wallet').addVolume('monerod', {
      options: { delete: false, exclude: ['lmdb', 'logs'] },
    }),
)
