<p align="center">
  <img src="icon.png" alt="Monero Logo" width="21%">
</p>

# Monero on StartOS

> Everything not listed in this document should behave the same as upstream
> Monero. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[Monero](https://github.com/monero-project/monero) is a private, untraceable digital currency; `monerod` is its full node. This package runs the node and a wallet RPC server beside it, manages both configuration files itself, and turns monerod's Tor plumbing into a set of intents rather than a set of command-line flags.

- **Upstream repo:** <https://github.com/monero-project/monero>
- **Wrapper repo:** <https://github.com/Start9-Community/monerod-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

Two images from the same third-party build, one per daemon.

| Property      | Value                                                            |
| ------------- | ---------------------------------------------------------------- |
| Images        | `ghcr.io/sethforprivacy/simple-monerod` and its wallet-RPC twin  |
| Architectures | x86_64, aarch64                                                  |
| Command       | `monerod` and `monero-wallet-rpc`, each against a managed config |

| Subcontainer | Purpose                                          |
| ------------ | ------------------------------------------------ |
| `monerod`    | The node — the one to `attach` to                |
| `wallet-rpc` | The wallet RPC server, pointed at the local node |

**These are not the Monero project's own images.** They are a widely used third-party build tracking upstream releases, and both move together.

Four oneshots run before the daemons:

| Oneshot         | Purpose                                                              |
| --------------- | -------------------------------------------------------------------- |
| `nocow`         | Marks the data directory `nodatacow` on Btrfs                        |
| `seed-ban-list` | Copies the image's bundled ban list into the volume when it is empty |
| `chown-monerod` | Gives the data directory to the node's user                          |
| `chown-wallet`  | The same for the wallet volume                                       |

**The `nocow` oneshot is not cosmetic.** Copy-on-write fragments LMDB into millions of extents, which degrades the node and can stall StartOS's pre-update volume snapshot for minutes. `chattr +C` marks directories and empty files, and new files inherit it — so an existing database only picks it up after a resync.

## Volume and Data Layout

Three volumes, treated very differently.

| Volume    | Mount Point               | Purpose                                  |
| --------- | ------------------------- | ---------------------------------------- |
| `main`    | — not mounted             | The package's own store                  |
| `monerod` | `/home/monero/.bitmonero` | The blockchain, the config, the ban list |
| `wallet`  | `/home/monero/wallet`     | Wallet files and the wallet RPC config   |

| Path                     | Written by | Holds                               |
| ------------------------ | ---------- | ----------------------------------- |
| `lmdb/`                  | monerod    | The blockchain database             |
| `monero.conf`            | Actions    | The node configuration              |
| `ban_list.txt`           | An action  | Peers banned at start               |
| `monero-wallet-rpc.conf` | Actions    | The wallet RPC configuration        |
| `store.json` (on `main`) | Actions    | The anonymity intents and two flags |

**`main` is never mounted into a container.** It holds only the package's own store, which is read and written by this package's code rather than by either daemon — which is also why it is the one volume neither daemon can corrupt.

## File Models

Four models, and the interesting part is what they refuse to hold.

| File                     | Format | Modelled                | Written by |
| ------------------------ | ------ | ----------------------- | ---------- |
| `monero.conf`            | INI    | Yes — `FileHelper.ini`  | Actions    |
| `monero-wallet-rpc.conf` | INI    | Yes — `FileHelper.ini`  | Actions    |
| `store.json`             | JSON   | Yes — `FileHelper.json` | Actions    |
| `ban_list.txt`           | text   | Yes — `FileHelper.raw`  | An action  |

Each config file splits three ways:

- **Enforced.** Data directory, log settings, bind addresses, both RPC ports, the database sync mode, the ban-list path, and the update check being off are `z.literal(...).catch(...)` — **repaired on read**, so a hand-edit is reverted rather than honored. The interfaces and health checks are built on those values.
- **Configurable.** Peer limits, rate limits, mempool size, pruning, ZMQ, the block-notify command, the peer lists, and the RPC credentials.
- **Enforced _absent_.** The proxy, transaction proxy, anonymous-inbound and transaction-padding keys are forced to `undefined`, so writing them into the file does nothing. They are passed as command-line flags instead, composed at start from the store.

**That last group is the design of the package.** Tor settings depend on values that only exist at start — the live address of the Tor service, and whether the Peer interface has an onion address yet — so the file records the user's _intent_ and the flags are computed from it each time.

The ban list is a plain text file with its own model: one address or subnet per line, comments stripped on read, and seeded once from the list bundled in the image.

## Dependencies

One, optional, and **declared only while it is wanted**.

| Dependency | Required               | Kind      | Why                           |
| ---------- | ---------------------- | --------- | ----------------------------- |
| Tor        | No — only if Tor is on | `running` | Outbound and inbound over Tor |

Enabling any Tor intent adds the dependency; turning them all off removes it.

**The Tor SOCKS address is resolved with a fallback**, so it stays constant whether Tor is installed, updated, or removed. That is deliberate: it means installing or restarting Tor never restarts the node, and a dead address is simply a refused connection until Tor is up.

**Inbound over Tor additionally needs an onion address on the Peer interface**, added by the user through the interface's address settings. Until it exists, the node cannot advertise a hidden service, and the Tor health check says so rather than failing silently. Because monerod refuses to accept anonymous inbound without a transaction proxy on the same zone, turning inbound on turns outbound on with it.

## Network Access and Interfaces

Up to five interfaces, two of which exist only when ZMQ is enabled.

| Interface      | Id               | Type | Port  | Description                         |
| -------------- | ---------------- | ---- | ----- | ----------------------------------- |
| Peer           | `peer`           | p2p  | 18080 | The peer-to-peer network            |
| RPC            | `rpc-restricted` | api  | 18089 | The restricted RPC, for wallets     |
| Wallet RPC     | `rpc-wallet`     | api  | 28088 | Server-side wallet management       |
| ZeroMQ         | `zmq`            | api  | 18082 | Block and transaction notifications |
| ZeroMQ Pub-Sub | `zmq-pubsub`     | api  | 18083 | The publish-subscribe stream        |

The peer and ZeroMQ bindings are raw TCP with the external port preserved; the two RPC bindings are HTTP.

**The unrestricted RPC port is not exported.** monerod listens on it inside the service, and nothing publishes an address for it — the restricted port is what wallets and dependents are given.

**The ZeroMQ pair is conditional.** They are exported only while ZMQ is enabled in the configuration, so enabling it and restarting is what makes them appear.

**The Wallet RPC is exported and, by default, unauthenticated.** Credentials are off out of the box, which means anyone who can reach that address can create and open wallets on this server and spend from them. Set wallet RPC credentials before exposing it anywhere, and treat the address as sensitive regardless.

Daemon RPC credentials are separate and also off by default. Setting them applies to both RPC ports at once, and the package's own sync check authenticates with them over HTTP Digest.

## Installation and First-Run Flow

Install seeds both configuration files with their enforced values and the store with its defaults: no proxy, no Tor, no credentials.

The node then starts and **syncs the Monero blockchain**, which is a long, disk-heavy operation. The sync check reports progress as a percentage the whole way.

There is no task and no wizard — a fresh install is a working clearnet node. Everything else is opt-in: Tor, credentials, pruning, ZMQ, and the peer policy are all actions.

## Actions

Nine actions, in two groups plus one hidden.

### Configuration

#### Peer Settings

Inbound and outbound peer limits, rate limits, port gossip, remote-node advertisement, and the peer list.

- **What it changes:** the networking keys in the node configuration.
- **Note:** the "specific nodes only" toggle changes how the peer list is written — as exclusive nodes rather than as ordinary and priority ones.

#### Anonymity Networks

The Tor intents: outbound proxy, transaction broadcast, inbound hidden service, per-zone connection limits, Dandelion++ noise, and transaction padding.

- **What it changes:** the store, and through it the flags the node is started with and whether Tor is a dependency.
- **Repeat safety:** idempotent. Enabling inbound **forces outbound on**, in the form and in what is stored, because monerod requires both.

#### Edit Ban List

The list of addresses and subnets the node bans at start.

- **What it changes:** the ban-list file, which monerod reads at start.
- Comments and blank lines in a hand-edited file are dropped when the action rewrites it.

#### Daemon RPC Settings

The username and password for the node's RPC.

- **What it changes:** the credentials in the node configuration, **and** the matching daemon login in the wallet RPC configuration, so the wallet server keeps working.

#### Wallet RPC Settings

The credentials for the wallet RPC server.

- **What it changes:** the wallet RPC configuration. Whether credentials are set decides which mutually exclusive flag the server is started with, so the file is never the source of truth for the "disabled" case.

#### Other Settings

Mempool size, ZMQ, pruning, and the block-notify command.

- **Pruning saves roughly two thirds of the disk**, and enabling it on an already-synced node does not shrink the existing database — that needs a resync.

### Maintenance

#### DB Salvage

Runs the node once with its salvage flag, then starts normally.

- **For a database that will not open.** It restarts the service if running, and is otherwise applied on the next start.

#### Resync Blockchain

Deletes the blockchain database so it is downloaded again.

- **Irreversible and expensive** — a full re-sync, measured in days on modest hardware.
- Wallets are untouched; only the chain is deleted.

### Hidden

#### Auto-Configure

Not shown in the UI. It lets a dependent service write the node settings it needs, with the fields it supplies locked in the form.

## Tasks

None. This package raises no tasks, so the service is never held on a prompt and its ordinary controls are always available.

## Health Checks

Two daemon checks and three standalone ones.

| Check           | Displayed as               | Method                                          |
| --------------- | -------------------------- | ----------------------------------------------- |
| `monerod`       | "Monero Daemon"            | The restricted RPC port is listening            |
| `wallet-rpc`    | "Wallet RPC"               | The wallet RPC port is listening                |
| `sync-progress` | "Blockchain Sync Progress" | The node's own status, over authenticated RPC   |
| `tor`           | "Tor"                      | What the Tor intents actually resolved to       |
| `clearnet`      | "Clearnet"                 | Whether clearnet is in use, and inbound-capable |

**The sync check speaks the node's RPC, not a port test**, and authenticates with HTTP Digest when credentials are set — so it keeps reporting after the RPC is locked down, and it reports a percentage rather than a binary.

**The Tor and Clearnet checks are status displays rather than failures.** They report "disabled" when a path is not in use, and the Tor one turns red in exactly one situation: inbound is enabled but the Peer interface has no onion address — the one misconfiguration a user cannot otherwise see.

## Backups and Restore

All three volumes are copied, with the heavy and rebuildable parts excluded — `sdk.Backups.ofVolumes(...).setOptions({ exclude })`.

**The blockchain database is excluded**, along with the logs and the peer-state files. It is public data that re-downloads, and including it would make every backup as large as the chain. **A restored node therefore syncs from scratch**, which is the intended trade.

Everything that cannot be recovered from the network is kept: the **wallet volume**, both configuration files, the ban list, and the store — which is where the anonymity intents live, so a restored node comes back routing its traffic the way the original did.

## Limitations and Differences

1. **The blockchain is not backed up.** A restore re-syncs from the network.
2. **The Wallet RPC is exported with no credentials by default**, and it can spend from any wallet it can open.
3. **Tor inbound needs an onion address added by hand** to the Peer interface before it can work.
4. **The images are a third-party build**, not the Monero project's own.
5. **Several config keys cannot be set in the file** — the proxy and inbound flags are computed at start and stripped from the file on read.
6. **Enabling pruning does not shrink an existing database**; only a resync does.
7. **The unrestricted RPC has no exported address.**
8. **ZeroMQ interfaces only exist while ZMQ is enabled**, and appear after a restart.

---

## Quick Reference for AI Consumers

```yaml
package_id: monerod
image: ghcr.io/sethforprivacy/simple-monerod # plus simple-monero-wallet-rpc, same version
architectures:
  - x86_64
  - aarch64
subcontainers:
  - monerod
  - wallet-rpc
volumes:
  main: null # store.json only; not mounted into any container, but is backed up
  monerod: /home/monero/.bitmonero
  wallet: /home/monero/wallet
file_models:
  - monero.conf # ini; enforced literals + keys forced undefined because they are CLI args
  - monero-wallet-rpc.conf # ini; disable-rpc-login forced undefined, added as a flag instead
  - store.json # anonymity intents, dbSalvage and resync flags
  - ban_list.txt # raw; seeded from the image's bundled list
startos_managed_env_vars: [] # everything is config files plus computed CLI args
dependencies:
  - tor # optional, kind: running, declared only while a Tor intent is enabled
interfaces:
  peer: { type: p2p, port: 18080 }
  rpc-restricted: { type: api, port: 18089 }
  rpc-wallet: { type: api, port: 28088 } # unauthenticated by default
  zmq: { type: api, port: 18082 } # only while ZMQ is enabled
  zmq-pubsub: { type: api, port: 18083 } # only while ZMQ is enabled
  # the unrestricted RPC (18081) is bound in-container but never exported
actions:
  - peers-config
  - anonymity-config
  - ban-list-config
  - rpc-config
  - wallet-rpc-config
  - other-config
  - autoconfig # hidden; for dependent services
  - db-salvage
  - resync-blockchain
tasks: []
health_checks:
  - monerod
  - wallet-rpc
  - sync-progress # authenticated JSON-RPC get_info, reports a percentage
  - tor # status display; fails only when inbound is on with no .onion
  - clearnet # status display
```
