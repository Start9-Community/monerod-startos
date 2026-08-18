# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

**Start every task at the recipe index** — `../start-technologies/projects/start-sdk/docs/src/recipes.md`
(or <https://docs.start9.com/packaging/recipes.html>). It maps an intent ("prompt the user to create
admin credentials", "expose a web UI") to the constructs, the reference pages, and a named production
package to copy. Find the recipe before you read this package's neighbours: a package you reach by
grepping may be non-conformant, and the recipe outranks it.

Freshly scaffolded? Work the
[New Package Checklist](../start-technologies/projects/start-sdk/docs/src/new-package-checklist.md)
(or <https://docs.start9.com/packaging/new-package-checklist.html>) from top to bottom. It is a
guide page, not a file in this repo — read it, don't copy it in.

Keep `README.md` (technical reference for an AI support or administering agent) and
`instructions.md` (end-user docs) in sync with your changes.

**Bugs and feature requests are GitHub issues on this repo** — file them as you find them.
Don't record work in the repo instead: no `TODO.md`, no `NOTES.md`, no `PLAN.md`. What you
verified, tried, and decided belongs in the commit message and the PR body.

## This repo

- **`startos/utils.ts`'s host-id and interface-id constants, the manifest `id`/volumes, and the `autoconfig` action are a public API.** btcpayserver imports them. Renaming one is a cross-repo change — update the dependent in the same PR.
- **Tor flags are CLI args, never conf keys.** `proxy`, `tx-proxy`, `anonymous-inbound` and `pad-transactions` are `z.undefined().catch(undefined)` in `monero.conf.ts` so a hand-edit is stripped on read; `main.ts` composes them from `store.json` plus values only available at start (Tor's live address, whether the Peer interface has an onion yet).
- **The `nocow` oneshot must run before monerod.** Btrfs CoW fragments LMDB into millions of extents and stalls the pre-update volume snapshot; `chattr +C` only takes on directories and empty files, so an existing `data.mdb` picks it up on the next resync.
- **`main` is not mounted into either subcontainer** — it exists only for `store.json`, which this package's own code reads and writes.
