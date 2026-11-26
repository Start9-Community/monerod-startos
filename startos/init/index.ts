import { sdk } from '../sdk'
import { dependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { versionGraph } from '../versions'
import { actions } from '../actions'
import { restoreInit } from '../backups'
import { onionTarget } from './onionTarget'
import { taskInit } from './taskInit'

export const init = sdk.setupInit(
  restoreInit,
  versionGraph,
  taskInit,
  setInterfaces,
  actions,
  dependencies,
  onionTarget,
)

export const uninit = sdk.setupUninit(versionGraph, onionTarget)
