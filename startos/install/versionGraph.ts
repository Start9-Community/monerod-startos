import { VersionGraph } from '@start9labs/start-sdk'
import { current, other } from './versions'
import { moneroConfFile } from '../fileModels/monero.conf'
import { walletRpcConfFile } from '../fileModels/monero-wallet-rpc.conf'
import { storeJson, storeDefaults } from '../fileModels/store.json'
import { moneroConfDefaults, walletRpcConfDefaults } from '../utils'

export const versionGraph = VersionGraph.of({
  current,
  other,
  preInstall: async (effects) => {
    await Promise.all([
      moneroConfFile.write(effects, moneroConfDefaults),
      walletRpcConfFile.write(effects, walletRpcConfDefaults),
      storeJson.write(effects, storeDefaults),
    ])
  },
})
