import { setupOnionTarget } from 'tor-startos/startos/utils/target'
import { manifest } from '../manifest'
import { sdk } from '../sdk'
import { p2pOnionPort, p2pPort, peerHostId } from '../utils'

export const onionTarget = setupOnionTarget(sdk, {
  packageId: manifest.id,
  hostId: peerHostId,
  internalPort: p2pPort,
  target: p2pOnionPort,
})
