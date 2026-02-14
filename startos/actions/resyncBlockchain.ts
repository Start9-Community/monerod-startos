import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
import { i18n } from '../i18n'

export const resyncBlockchain = sdk.Action.withoutInput(
  'resync-blockchain',

  async ({ effects }) => ({
    name: i18n('Resync Blockchain'),
    description: i18n(
      'Delete the blockchain database and re-download it from the network. This is the only way to fully rebuild the database from scratch.',
    ),
    warning: i18n(
      'This will delete all blockchain data and re-sync from the network. For pruned nodes, this means downloading the entire blockchain again, which could take days or weeks depending on hardware and network speed.',
    ),
    allowedStatuses: 'any',
    group: i18n('Maintenance'),
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    await storeJson.merge(effects, { resync: true })

    const started = (await sdk.getStatus(effects, { packageId: 'monerod' }))
      .started

    if (started) {
      await sdk.restart(effects)
      return {
        version: '1',
        title: i18n('Success'),
        message: i18n(
          'Restarting monerod. The blockchain database will be deleted and re-synced from the network.',
        ),
        result: null,
      }
    }

    return {
      version: '1',
      title: i18n('Success'),
      message: i18n(
        'The next time monerod starts, the blockchain database will be deleted and re-synced from the network.',
      ),
      result: null,
    }
  },
)
