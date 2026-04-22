import { sdk } from '../sdk'
import { anonymityConfig } from './config/anonymity'
import { autoconfig } from './config/autoconfig'
import { banListConfig } from './config/banList'
import { otherConfig } from './config/other'
import { peersConfig } from './config/peers'
import { rpcConfig } from './config/rpc'
import { walletRpcConfig } from './config/walletRpc'
import { dbSalvage } from './dbSalvage'
import { resyncBlockchain } from './resyncBlockchain'

export const actions = sdk.Actions.of()
  .addAction(peersConfig)
  .addAction(anonymityConfig)
  .addAction(banListConfig)
  .addAction(rpcConfig)
  .addAction(walletRpcConfig)
  .addAction(otherConfig)
  .addAction(autoconfig)
  .addAction(dbSalvage)
  .addAction(resyncBlockchain)
