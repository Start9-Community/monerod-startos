import { moneroConfFile } from './fileModels/monero.conf'
import { sdk } from './sdk'

const torDep = {
  tor: {
    kind: 'running' as const,
    versionRange: '>=0.4.9.5:0-beta.0',
    healthChecks: [],
  },
}

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const toronly = await moneroConfFile.read((c) => c?.toronly).const(effects)
  return toronly ? torDep : {}
})
