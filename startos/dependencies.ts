import { storeJson } from './fileModels/store.json'
import { torDescription } from './manifest/i18n'
import { sdk } from './sdk'

const tor = sdk.Dependency.optional('tor', {
  description: torDescription,
  metadata: {
    title: 'Tor',
    icon: 'https://raw.githubusercontent.com/Start9Labs/tor-startos/65faea17febc739d910e8c26ff4e61f6333487a8/icon.svg',
  },
  kind: 'running',
  // 0.4.9.17:4 is the first Tor with Set Onion Target.
  versionRange: '>=0.4.9.17:4',
  healthChecks: [],
  enabled: async ({ effects }) =>
    !!(await storeJson
      .read((s) => s.outboundProxy === 'tor' || s.torOutbound || s.torInbound)
      .const(effects)),
})

export const dependencies = sdk.Dependencies.of().addDependency(tor)
