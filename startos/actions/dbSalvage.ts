import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
import { i18n } from '../i18n'

export const dbSalvage = sdk.Action.withoutInput(
  'db-salvage',

  async ({ effects }) => ({
    name: i18n('DB Salvage'),
    description: i18n(
      'Attempt to salvage a corrupted blockchain database. Monerod runs with --db-salvage on its next start; later starts are normal.',
    ),
    warning: i18n(
      'Only use this if monerod is failing to start due to database corruption. The service will restart if currently running.',
    ),
    allowedStatuses: 'any',
    group: i18n('Maintenance'),
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    await storeJson.merge(effects, { dbSalvage: true })

    const status = await sdk.getStatus(effects, { packageId: 'monerod' }).once()

    if (status?.started) {
      await sdk.restart(effects)
      return {
        version: '1',
        title: i18n('Success'),
        message: i18n(
          'Restarting monerod with --db-salvage. Later starts are normal.',
        ),
        result: null,
      }
    }

    return {
      version: '1',
      title: i18n('Success'),
      message: i18n(
        'The next time monerod starts, it will run with --db-salvage. Later starts are normal.',
      ),
      result: null,
    }
  },
)
