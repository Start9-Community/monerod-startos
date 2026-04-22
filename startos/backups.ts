import { sdk } from './sdk'

export const { createBackup, restoreInit } = sdk.setupBackups(async () =>
  sdk.Backups.ofVolumes('monerod', 'wallet').setOptions({
    exclude: [
      // monerod
      'lmdb/',
      'logs/',
      'p2pstate.bin',
      'p2pstate_stripped.bin',
      'net_stat.bin',
      'dns_checkpoints.dat',
    ],
  }),
)
