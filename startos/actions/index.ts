import { sdk } from '../sdk'
import { networkingConfig } from './config/networking'
import { rpcConfig } from './config/rpc'
import { otherConfig } from './config/other'
import { dbSalvage } from './dbSalvage'
import { resyncBlockchain } from './resyncBlockchain'

export const actions = sdk.Actions.of()
  .addAction(networkingConfig)
  .addAction(rpcConfig)
  .addAction(otherConfig)
  .addAction(dbSalvage)
  .addAction(resyncBlockchain)
