import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
import { i18n } from '../i18n'

export const dbSalvage = sdk.Action.withoutInput(
  'db-salvage',

  async ({ effects }) => ({
    name: i18n('DB Salvage'),
    description: i18n(
      'Attempt to salvage a corrupted blockchain database. Monerod will run with --db-salvage on next start, then restart normally.',
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

    const started = (await sdk.getStatus(effects, { packageId: 'monerod' }))
      .started

    if (started) {
      await sdk.restart(effects)
      return {
        version: '1',
        title: i18n('Success'),
        message: i18n(
          'Restarting monerod with --db-salvage. It will restart normally after salvage completes.',
        ),
        result: null,
      }
    }

    return {
      version: '1',
      title: i18n('Success'),
      message: i18n(
        'The next time monerod starts, it will run --db-salvage before starting normally.',
      ),
      result: null,
    }
  },
)
