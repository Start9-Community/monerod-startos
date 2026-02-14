# Wallet Integrations

## Table of Contents

- [Anonero (Android)](#anonero)
- [Cake Wallet (Android / iOS)](#cake-wallet)
- [Feather Wallet (Linux / Mac / Windows)](#feather-wallet)
- [Monero GUI (Linux / Mac / Windows)](#monero-gui)
- [Monerujo (Android)](#monerujo)
- [Haveno RetoSwap (Linux / Mac / Windows)](#haveno-retoswap)

---

## Anonero

**Platform:** Android

> This guide assumes that you have setup [Tor](https://docs.start9.com/latest/user-manual/connecting/connecting-tor/tor-os/tor-android) connectivity on your Android device before continuing.

1. Download [Anonero](http://anonero5wmhraxqsvzq2ncgptq6gq45qoto6fnkfwughfl4gbt44swad.onion/) (onion link). There are two apps, Anon, and Nero.
1. Open Anon and create a wallet.
1. Copy your "Restricted RPC URL (Tor)" connection string from StartOS' Services -> Monero -> Properties.
1. Paste into the "Node" field, and modify the protocol prefix to `http://`. Leave the `:18089` port suffix as is. You can leave RPC user and password blank at this time.
1. If this does not connect right away, tap "Proxy Settings" and then "Set." Anon will connect to your node. Tap Next.
1. Create a passphrase. Save this, and the following seed phrase, somewhere safe. Don't fuck this up - freedom requires responsibility.
1. Continue to your wallet, and wait for it to sync to your node.

> Nero setup is similar, but you will be restoring an existing wallet instead of creating one.

---

## Cake Wallet

**Platform:** Android, iOS

> This guide assumes that you have setup [Tor](https://docs.start9.com/latest/user-manual/connecting/connecting-tor/tor-os/tor-android) connectivity on your device before continuing.

1. Download [Cake Wallet](https://cakewallet.com/).
1. Open Cake and create or restore a wallet.
1. Add Cake Wallet to your Orbot apps list.
1. Go to Settings -> Connection and sync -> Manage nodes and tap the "+" next to "Add new node."
1. Open StartOS -> Monero -> Properties and tap the QR icon next to "Restricted RPC URL (Tor)." You can also copy this information over manually.
1. Your node info will populate. Tap "Save."
1. On the "Manage nodes" screen, wait a moment for your node status icon to turn green.

> You can now return to the wallet home screen to observe the sync status. It is recommended that you keep the app open until initial sync is complete. You may also like to turn on "Background Sync" to keep your wallet up to date. This can be found in Cake's Settings -> Connection and sync -> Background sync.

---

## Feather Wallet

**Platform:** Linux, Mac, Windows

> This guide assumes that you have setup [LAN](https://docs.start9.com/latest/user-manual/connecting/connecting-lan) and/or [Tor](https://docs.start9.com/latest/user-manual/connecting/connecting-tor) connectivity on your desktop before continuing. LAN is recommended for local (home/office) use, and Tor is recommended for remote access.

1. Download for your OS from https://featherwallet.org/download/.
1. Go to File -> Settings -> Network (or click the network icon in the bottom right of the application), then click "Add Custom Node(s)."
1. Copy your "Restricted RPC URL" connection string (LAN or Tor) from StartOS -> Monero -> Properties and paste it in as a new line (or as the only line, removing others, to only use your private node), then click OK.
   - Be sure that the format is `yourUniqueString.local:443` (LAN) or `yourUniqueString.onion:18089` (Tor).
   - If you are using LAN, select the "Proxy" tab and select "None." Click OK.
   - If you are using Tor, select the "Proxy" tab, select "Tor," and then either use the internal daemon, or point to your own with `127.0.0.1` (Host), `9050` (Port), and disable the Feather internal daemon. Click OK.

---

## Monero GUI

**Platform:** Linux, Mac, Windows

> This guide assumes that you have setup [LAN](https://docs.start9.com/latest/user-manual/connecting/connecting-lan) and/or [Tor](https://docs.start9.com/latest/user-manual/connecting/connecting-tor) connectivity on your desktop before continuing. LAN is recommended for local (home/office) use, and Tor is recommended for remote access.

1. Download for your OS from https://www.getmonero.org/downloads/.
1. Go to Settings -> Node -> Remote Node, then click "+ Add Remote Node."
1. Copy your "Restricted RPC URL" connection string (LAN or Tor) from StartOS -> Monero -> Properties and paste it in.
   - Be sure that the format is `yourUniqueString.local` (LAN) or `yourUniqueString.onion` (Tor).
1. Enter the port `443` if you are using LAN, or `18089` if you are using Tor, and "Mark as Trusted Daemon," then click OK.
   - If you are using Tor, select the "Interface" tab, select "Socks5 Proxy," and then point to your system daemon at `127.0.0.1` (Host), `9050` (Port).

---

## Monerujo

**Platform:** Android

> This guide assumes that you have setup [Tor](https://docs.start9.com/latest/user-manual/connecting/connecting-tor/tor-os/tor-android) connectivity on your Android device before continuing.

1. Download Monerujo from your app registry of choice (Aurora, F-Droid, Play Store), or directly from the [GitHub repository](https://github.com/m2049r/xmrwallet/releases).
1. Open Monerujo and tap the globe image under "Network" to switch to Tor, then tap to the right of that (on either the existing node or the loading text) to enter the node selection screen. Then tap the `+` in the bottom-right.
1. Copy your "Restricted RPC URL (Tor)" connection string from StartOS -> Monero -> Properties and paste it into the "Hostname" field.
   - Be sure that the format is `yourUniqueString.onion` (Tor).
1. Enter the port `18089`, (optionally) name your node, and (optionally) "TEST" the connection, then click "OK."

---

## Haveno RetoSwap

**Platform:** Linux, Mac, Windows

Haveno (RetoSwap) is a peer-to-peer exchange (forked from Bisq).

1. Download [RetoSwap](https://retoswap.com/).
1. Open RetoSwap and navigate to Settings -> Network Info.
1. Select "Always" under "Use Tor for Monero network."
1. Select "Use custom Monero nodes" under "Monero nodes to connect to."
1. Copy your "Restricted RPC URL (Tor)" connection string from StartOS -> Monero -> Properties.
1. Paste into the "Use custom Monero nodes" field, and remove the protocol prefix `http://`. Leave the `:18089` port suffix as is.
1. When you click away from this field, you will be prompted to shut down and restart RetoSwap, do so.
1. On the next launch, you will see the "Connected" status next to your node address.

> You can add more nodes in the same fashion for redundancy. Using only Tor (onion) addresses is highly recommended.
