import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v_0_18_5_4_1 } from './v0.18.5.4_1'

export const versionGraph = VersionGraph.of({
  current,
  other: [v_0_18_5_4_1],
})
