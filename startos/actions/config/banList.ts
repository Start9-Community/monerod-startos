import { T } from '@start9labs/start-sdk'
import { banListFile } from '../../fileModels/banList'
import { i18n } from '../../i18n'
import { sdk } from '../../sdk'

const { InputSpec, Value, List } = sdk

const banListSpec = InputSpec.of({
  entries: Value.list(
    List.text(
      {
        name: i18n('Entries'),
        description: i18n(
          'One IP address or IPv4 CIDR subnet per entry. Examples: 192.0.2.1, 192.0.2.0/24',
        ),
        default: [],
        minLength: null,
        maxLength: null,
      },
      {
        placeholder: '192.0.2.0/24',
        inputmode: 'text',
        patterns: [],
        masked: false,
        generate: null,
      },
    ),
  ),
})

type BanListSpec = typeof banListSpec._TYPE

export const banListConfig = sdk.Action.withInput(
  'ban-list-config',

  async () => ({
    name: i18n('Edit Ban List'),
    description: i18n('View, add, or remove peers that monerod bans at startup.'),
    warning: null,
    allowedStatuses: 'any',
    group: i18n('Configuration'),
    visibility: 'enabled',
  }),

  banListSpec,

  async () => {
    const data = await banListFile.read().once()
    return { entries: data?.entries ?? [] }
  },

  async ({ effects, input }: { effects: T.Effects; input: BanListSpec }) => {
    await banListFile.merge(effects, { entries: input.entries })
  },
)
