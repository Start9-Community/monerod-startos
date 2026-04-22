import { banListFile } from '../fileModels/banList'
import { walletRpcConfFile } from '../fileModels/monero-wallet-rpc.conf'
import { moneroConfFile } from '../fileModels/monero.conf'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

export const taskInit = sdk.setupOnInit(async (effects) => {
  await Promise.all([
    moneroConfFile.merge(effects, {}),
    walletRpcConfFile.merge(effects, {
      'disable-rpc-login': 1,
    }),
    storeJson.merge(effects, {}),
    // monerod hard-fails at startup if --ban-list points to a missing file,
    // and the path is enforced in monero.conf, so guarantee it exists.
    banListFile.merge(effects, {}),
  ])
})
