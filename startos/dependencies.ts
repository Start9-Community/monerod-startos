import { storeJson } from './fileModels/store.json'
import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const needsTor = await storeJson
    .read(
      (s) =>
        s?.outboundProxy === 'tor' ||
        s?.torOutbound === true ||
        s?.torInbound === true,
    )
    .const(effects)

  return needsTor
    ? {
        tor: {
          kind: 'running',
          versionRange: '>=0.4.9.5:0',
          healthChecks: [],
        },
      }
    : {}
})
