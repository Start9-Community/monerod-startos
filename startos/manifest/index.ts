import { setupManifest } from '@start9labs/start-sdk'
import { short, long, alertUninstall, alertRestore } from './i18n'

export const manifest = setupManifest({
  id: 'monerod',
  title: 'Monero',
  license: 'bsd-3-clause',
  wrapperRepo: 'https://github.com/kn0wmad/monerod-startos',
  upstreamRepo: 'https://github.com/monero-project/monero',
  supportSite: 'https://github.com/monero-project/monero',
  marketingSite: 'https://getmonero.org',
  docsUrl: 'https://docs.getmonero.org',
  donationUrl: null,
  description: { short, long },
  volumes: ['main', 'monerod', 'wallet'],
  images: {
    monerod: {
      source: {
        dockerTag: 'ghcr.io/sethforprivacy/simple-monerod:v0.18.4.5',
      },
      arch: ['x86_64', 'aarch64'],
    },
    'wallet-rpc': {
      source: {
        dockerTag:
          'ghcr.io/sethforprivacy/simple-monero-wallet-rpc:v0.18.4.5',
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  alerts: {
    install: null,
    update: null,
    uninstall: alertUninstall,
    restore: alertRestore,
    start: null,
    stop: null,
  },
  dependencies: {},
})
