# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (architecture, for developers and LLMs) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Package id is `monerod`.** Two subcontainers: `monerod` (the `monerod` daemon) and `wallet-rpc` (`monero-wallet-rpc`).
- **`startos/utils.ts` exports host-id/interface-id constants** (`peerHostId`, `rpcRestrictedHostId`, `walletRpcHostId`, `zmqHostId`, `zmqPubsubHostId` and the matching `*InterfaceId`) for `sdk.host.getOwn`/`get` lookups. btcpayserver depends on this package — it imports the `manifest` export and the `autoconfig` action (`startos/actions/config/autoconfig.ts`). Treat those exports as a small API: keep the manifest `id`/volumes, the id constants, and the `autoconfig` action stable, and update the dependent in the same change if you must rename one.

## Inspecting a running install

To run a command inside the service's container (read its generated config, grep app logs), use `start-cli package attach monerod -n <name> -- <cmd>`. Select the subcontainer by **name** with `-n` (the name passed to `SubContainer.of` in `main.ts` — here `monerod` or `wallet-rpc`) or by image with `-i`. Note: `-s/--subcontainer` matches the internal **Guid**, not the name, so passing a name to `-s` fails with "no matching subcontainers".
