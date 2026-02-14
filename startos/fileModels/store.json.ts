import { FileHelper, matches } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = matches.object({
  dbSalvage: matches.boolean,
  resync: matches.boolean,
})

export const storeJson = FileHelper.json(
  {
    base: sdk.volumes.main,
    subpath: '/store.json',
  },
  shape,
)

export const storeDefaults = {
  dbSalvage: false,
  resync: false,
}
