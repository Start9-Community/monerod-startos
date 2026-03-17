## How the upstream version is pulled
- dockerTags in `startos/manifest/index.ts`:
  - `ghcr.io/sethforprivacy/simple-monerod:v<version>`
  - `ghcr.io/sethforprivacy/simple-monero-wallet-rpc:v<version>`
- Both must be updated together.

> Uses third-party Docker images from sethforprivacy, not official Monero images.
