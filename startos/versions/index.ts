import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v_0_18_5_4_1 } from './v0.18.5.4_1'
import { v_0_18_5_4_2 } from './v0.18.5.4_2'
import { v_0_18_5_4_5 } from './v0.18.5.4_5'

export const versionGraph = VersionGraph.of({
  current,
  other: [v_0_18_5_4_5, v_0_18_5_4_2, v_0_18_5_4_1],
})
