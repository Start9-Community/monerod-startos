import { sdk } from './sdk'

export const { createBackup, restoreInit } = sdk.setupBackups(async () =>
  // Only paths that re-download or regenerate on the next start may be excluded.
  sdk.Backups.ofVolumes('main', 'monerod', 'wallet').setOptions({
    exclude: [
      'lmdb/',
      'logs/',
      'p2pstate.bin',
      'p2pstate_stripped.bin',
      'net_stat.bin',
      'dns_checkpoints.dat',
    ],
  }),
)
