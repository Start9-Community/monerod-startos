# Monero on StartOS

> **Upstream docs:** <https://docs.getmonero.org/>
>
> Everything not listed in this document should behave the same as upstream
> Monero v0.18.4.5 ("Fluorine Fermi"). If a feature, setting, or behavior is
> not mentioned here, the upstream documentation is accurate and fully
> applicable.

[Monero](https://github.com/monero-project/monero) is a private, decentralized cryptocurrency. This package runs two daemons — `monerod` (the full node) and `monero-wallet-rpc` (server-side wallet management) — and exposes all configuration through StartOS actions.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions](#actions-startos-ui)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Wallet Integrations](#wallet-integrations)

---

## Image and Container Runtime

| Property         | Value                                                                    |
| ---------------- | ------------------------------------------------------------------------ |
| monerod image    | `ghcr.io/sethforprivacy/simple-monerod:v0.18.4.5` (unmodified)           |
| wallet-rpc image | `ghcr.io/sethforprivacy/simple-monero-wallet-rpc:v0.18.4.5` (unmodified) |
| Architectures    | x86_64, aarch64                                                          |
| Entrypoint       | Bypassed — StartOS calls the binaries directly via config file           |

Both images are pulled directly from upstream with no modifications. The upstream entrypoint scripts (which use `fixuid`) are not used; instead, a `chown` oneshot runs before each daemon to set volume ownership.

Both daemons run as the `monero` user (not root).

---

## Volume and Data Layout

| Volume    | Mount Point                | Purpose                                         |
| --------- | -------------------------- | ----------------------------------------------- |
| `monerod` | `/home/monero/.bitmonero`  | Blockchain (lmdb), monero.conf, logs            |
| `wallet`  | `/home/monero/wallet`      | Wallet files, monero-wallet-rpc.conf, logs      |
| `main`    | _(not mounted at runtime)_ | Vestigial; exists only for migration from 0.3.x |

All persistent configuration lives in INI-format config files managed by StartOS file models:

- `monero.conf` — on the `monerod` volume
- `monero-wallet-rpc.conf` — on the `wallet` volume

---

## Installation and First-Run Flow

On fresh install, StartOS writes default config files before the daemons start for the first time:

- **Tor-only mode is enabled by default** — all traffic is routed through the StartOS Tor proxy at `10.0.3.1:9050`. Upstream Monero defaults to clearnet.
- **DNS checkpoints are disabled** — upstream enables DNS checkpointing by default.
- **Update checks are disabled** — StartOS manages package updates.
- **ZMQ is disabled by default** — can be enabled via the Other Settings action.
- **RPC ban is disabled by default** — prevents monerod from banning traffic originating from Tor. Upstream enables RPC bans by default.
- **Spy node ban list is enabled by default** — uses the ban list bundled in the upstream image at `/home/monero/ban_list.txt`.
- **Dandelion++ is enabled** — transaction padding (`pad-transactions=1`) is on by default in Tor-only mode.
- **Wallet RPC starts with `--disable-rpc-login`** — no credentials required by default; can be enabled via the RPC Settings action.

No setup wizard is required. The node begins syncing immediately after install.

---

## Configuration Management

All settings are managed through StartOS config actions that write to `monero.conf` and `monero-wallet-rpc.conf`. There is no web UI or other configuration method.

### StartOS-Managed Settings

Settings are split across three config actions for organization. Any setting can also be changed by SSH-ing in and editing the conf files directly, but the file model will enforce type constraints and fill defaults for any missing required keys.

| Setting                  | Config File     | Action     | monero.conf Key                  |
| ------------------------ | --------------- | ---------- | -------------------------------- |
| Max incoming peers       | monero.conf     | Networking | `in-peers`                       |
| Max outgoing peers       | monero.conf     | Networking | `out-peers`                      |
| Upload speed limit       | monero.conf     | Networking | `limit-rate-up`                  |
| Download speed limit     | monero.conf     | Networking | `limit-rate-down`                |
| Peer gossip              | monero.conf     | Networking | `hide-my-port`                   |
| Spy node ban list        | monero.conf     | Networking | `ban-list`                       |
| Public node              | monero.conf     | Networking | `public-node`                    |
| Strict nodes mode        | monero.conf     | Networking | `add-exclusive-node`             |
| Custom peers             | monero.conf     | Networking | `add-peer` / `add-priority-node` |
| Tor-only mode            | monero.conf     | Networking | `proxy`, `tx-proxy`              |
| RPC ban                  | monero.conf     | Networking | `disable-rpc-ban`                |
| Dandelion++              | monero.conf     | Networking | `tx-proxy` suffix                |
| Max Tor connections      | monero.conf     | Networking | `tx-proxy`, `anonymous-inbound`  |
| RPC credentials          | monero.conf     | RPC        | `rpc-login`                      |
| Wallet RPC credentials   | wallet-rpc.conf | RPC        | `rpc-login`                      |
| Max TX pool size         | monero.conf     | Other      | `max-txpool-weight`              |
| ZMQ interface            | monero.conf     | Other      | `no-zmq`, `zmq-*`                |
| Pruning                  | monero.conf     | Other      | `prune-blockchain`               |
| BTCPayServer integration | monero.conf     | Other      | `block-notify`                   |

### Hardcoded (Not User-Configurable)

These differ from upstream defaults and cannot be changed through the UI:

| Setting                      | Value                     | Reason                         |
| ---------------------------- | ------------------------- | ------------------------------ |
| `data-dir`                   | `/home/monero/.bitmonero` | Matches volume mount           |
| `rpc-bind-ip`                | `0.0.0.0`                 | Container networking           |
| `confirm-external-bind`      | `1`                       | Required for `0.0.0.0` binding |
| `rpc-access-control-origins` | `*`                       | Services connect internally    |
| `db-sync-mode`               | `safe:sync`               | Data integrity                 |
| `disable-dns-checkpoints`    | `1`                       | DNS not available in Tor-only  |
| `check-updates`              | `disabled`                | StartOS manages updates        |

---

## Network Access and Interfaces

| Interface      | Internal Port | External Port (LAN) | External Port (Tor) | Protocol | Purpose                             |
| -------------- | ------------- | ------------------- | ------------------- | -------- | ----------------------------------- |
| Peer (P2P)     | 18080         | 18080               | 18080               | TCP      | Block/transaction exchange          |
| Restricted RPC | 18089         | 443 (SSL)           | 18089               | HTTP     | Wallet connections, read-only API   |
| Wallet RPC     | 28088         | 28088 (SSL)         | 28088               | HTTP     | Server-side wallet management       |
| ZMQ*           | 18082         | 18082               | 18082               | TCP      | Block/tx notifications              |
| ZMQ Pub-Sub*   | 18083         | 18083               | 18083               | TCP      | Publish-subscribe                   |

*\*ZMQ interfaces only appear when ZMQ is enabled in Other Settings. They are not created by default.*

The full (unrestricted) RPC on port 18081 is **not exposed** as a StartOS interface. It is accessible only from within the container network. External wallet connections use the restricted RPC on port 18089.

---

## Actions (StartOS UI)

### Networking Settings

- **ID:** `networking-config`
- **Group:** Configuration
- **Availability:** Any status
- **Purpose:** Configure peer connections, Tor settings, rate limits, and privacy features
- **Key inputs:** in-peers, out-peers, gossip toggle, Tor-only toggle, Dandelion++, bandwidth limits, custom peer list, strict-nodes mode, spy node ban list, public node, RPC ban

### RPC Settings

- **ID:** `rpc-config`
- **Group:** Configuration
- **Availability:** Any status
- **Purpose:** Configure authentication for the daemon RPC and wallet RPC
- **Key inputs:** RPC credentials (username/password, enabled/disabled), Wallet RPC credentials (username/password, enabled/disabled)
- **Note:** When RPC credentials are enabled, the wallet RPC `daemon-login` is automatically set to match, so the wallet can authenticate with the daemon

### Other Settings

- **ID:** `other-config`
- **Group:** Configuration
- **Availability:** Any status
- **Purpose:** Configure mempool size, ZMQ, pruning, and BTCPayServer integration
- **Key inputs:** Max TX pool size (MiB), ZMQ toggle, pruning toggle, BTCPayServer toggle

### DB Salvage

- **ID:** `db-salvage`
- **Group:** Maintenance
- **Availability:** Any status
- **Purpose:** Attempt to repair a corrupted blockchain database by running monerod with `--db-salvage`
- **Warning:** Only use if monerod is failing to start due to database corruption
- **Behavior:** Sets a flag; on next start, monerod runs `--db-salvage` before starting normally. If the service is running, it triggers a restart.

### Resync Blockchain

- **ID:** `resync-blockchain`
- **Group:** Maintenance
- **Availability:** Any status
- **Purpose:** Delete the blockchain database (`lmdb/`) and re-download it from the network
- **Warning:** For pruned nodes, this means downloading the entire blockchain again, which could take days or weeks
- **Behavior:** Sets a flag; on next start, the `lmdb/` directory is deleted before monerod launches. If the service is running, it triggers a restart.

---

## Backups and Restore

| Volume    | Included | Exclusions                         |
| --------- | -------- | ---------------------------------- |
| `wallet`  | Full     | None                               |
| `monerod` | Partial  | `lmdb/` (blockchain data), `logs/` |

The blockchain database (`lmdb/`) is excluded from backups because it can be re-synced from the network. Config files on the `monerod` volume (like `monero.conf`) **are** backed up.

**Restore behavior:** Restoring will overwrite current wallet data. You will lose any transactions recorded in watch-only wallets and any funds received to the hot wallet since the last backup.

---

## Health Checks

### Monero Daemon

- **Method:** Port listening check on 18089
- **Grace period:** 30 seconds
- **Success:** "Monero RPC is ready and accepting requests"
- **Failure:** "Monero RPC is unreachable"

### Wallet RPC

- **Method:** Port listening check on 28088
- **Success:** "Wallet RPC is ready"
- **Failure:** "Wallet RPC is unreachable"

### Blockchain Sync Progress

- **Method:** JSON-RPC call to `get_info` on restricted RPC
- **States:**
  - _Starting:_ "Monero is starting..."
  - _Loading:_ "Syncing blocks...XX.XX%"
  - _Success:_ "Monero is fully synced"
  - _Failure:_ "Unexpected RPC response: [status code]"

---

## Limitations and Differences

1. **Tor-only by default** — upstream defaults to clearnet. Users must explicitly disable Tor-only mode to use clearnet P2P.
2. **No mining support** — the `--start-mining`, `--mining-threads`, and `--bg-mining-enable` options are not exposed.
3. **No I2P support** — only Tor is available as an anonymity network.
4. **No bootstrap daemon** — `--bootstrap-daemon-address` is not exposed; the node does a full sync.
5. **Unrestricted RPC not externally accessible** — port 18081 is internal only. Wallets connect via the restricted RPC on 18089.
6. **Pruning is one-way** — once enabled, the blockchain cannot be un-pruned without a full re-sync.
7. **DNS features disabled** — DNS checkpointing and DNS blocklist are disabled since DNS is not reliable in Tor-only mode.
8. **Initial sync is slow over Tor** — syncing the full blockchain over Tor can take significantly longer than clearnet. Consider temporarily disabling Tor-only mode for the initial sync if privacy during sync is not a concern.

---

## What Is Unchanged from Upstream

- Full blockchain validation (no light/SPV mode)
- All standard RPC methods available on the restricted endpoint
- Wallet RPC functionality (create wallets, send/receive, view balance)
- Transaction relay and mempool behavior
- P2P protocol and block propagation
- Pruning implementation and storage savings
- Dandelion++ privacy protocol
- All cryptographic operations

---

## Wallet Integrations

See [docs/wallet-integrations.md](docs/wallet-integrations.md) for step-by-step guides connecting wallets to your Monero node:

- Anonero (Android)
- Cake Wallet (Android / iOS)
- Feather Wallet (Linux / Mac / Windows)
- Monero GUI (Linux / Mac / Windows)
- Monerujo (Android)
- Haveno RetoSwap (Linux / Mac / Windows)

---

## Quick Reference for AI Consumers

```yaml
package_id: monerod
upstream_version: 0.18.4.5
images:
  monerod: ghcr.io/sethforprivacy/simple-monerod:v0.18.4.5
  wallet-rpc: ghcr.io/sethforprivacy/simple-monero-wallet-rpc:v0.18.4.5
architectures: [x86_64, aarch64]
volumes:
  monerod: /home/monero/.bitmonero
  wallet: /home/monero/wallet
  main: not mounted (migration only)
ports:
  peer: 18080
  rpc-restricted: 18089
  rpc-wallet: 28088
  zmq: 18082
  zmq-pubsub: 18083
dependencies: none
config_files:
  - monero.conf (monerod volume)
  - monero-wallet-rpc.conf (wallet volume)
actions:
  - networking-config
  - rpc-config
  - other-config
  - db-salvage
  - resync-blockchain
```
