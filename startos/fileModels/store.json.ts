import { FileHelper, utils, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.looseObject({
  dbSalvage: z.boolean().catch(false),
  resync: z.boolean().catch(false),

  // Anonymity intents — flat to match the Anonymity Networks action form 1:1.
  outboundProxy: z.enum(['none', 'tor']).catch('none'),
  padTransactions: z.boolean().catch(false),
  torOutbound: z.boolean().catch(false),
  torInbound: z.boolean().catch(false),
  // null on any of these three = use monerod's upstream default.
  torMaxOutboundConns: z.number().int().min(1).max(256).nullable().catch(null),
  torMaxInboundConns: z.number().int().min(1).max(256).nullable().catch(null),
  torDandelionNoise: z.boolean().nullable().catch(null),

  // The login the unrestricted RPC on rpcUnrestrictedPort requires while daemon RPC credentials are off.
  unrestrictedRpcLogin: z
    .string()
    .regex(/^[^:]+:.+$/)
    .catch(
      () =>
        `monerod:${utils.getDefaultString({ charset: 'a-z,A-Z,0-9', len: 22 })}`,
    ),
})

export type Store = z.infer<typeof shape>

export const storeJson = FileHelper.json(
  {
    base: sdk.volumes.main,
    subpath: '/store.json',
  },
  shape,
)
