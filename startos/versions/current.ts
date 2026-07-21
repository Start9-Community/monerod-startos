import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.18.5.1:0',
  releaseNotes: {
    en_US:
      'Updated Monero to 0.18.5.1 (Fluorine Fermi), a follow-up point release to 0.18.5.0. The 0.18.5 line adds SOCKS v5 support to the daemon and wallet, a restricted RPC mode for ZMQ, and numerous wallet and RPC hardening fixes. It removes UPnP port mapping (the --igd option is now a no-op). Full notes: https://github.com/monero-project/monero/releases/tag/v0.18.5.1. Also includes internal updates for start-sdk 2.0 (requires StartOS 0.4.0-beta.10 or later).',
    es_ES:
      'Monero actualizado a 0.18.5.1 (Fluorine Fermi), una versión puntual posterior a la 0.18.5.0. La línea 0.18.5 añade compatibilidad con SOCKS v5 en el demonio y la cartera, un modo RPC restringido para ZMQ y numerosas correcciones de seguridad en la cartera y RPC. Elimina el mapeo de puertos UPnP (la opción --igd ahora no tiene efecto). Notas completas: https://github.com/monero-project/monero/releases/tag/v0.18.5.1. También incluye actualizaciones internas para start-sdk 2.0 (requiere StartOS 0.4.0-beta.10 o posterior).',
    de_DE:
      'Monero auf 0.18.5.1 aktualisiert (Fluorine Fermi), ein Folge-Point-Release zu 0.18.5.0. Die 0.18.5-Reihe fügt SOCKS-v5-Unterstützung für Daemon und Wallet, einen eingeschränkten RPC-Modus für ZMQ sowie zahlreiche Sicherheitskorrekturen an Wallet und RPC hinzu. Sie entfernt das UPnP-Port-Mapping (die Option --igd ist nun wirkungslos). Vollständige Hinweise: https://github.com/monero-project/monero/releases/tag/v0.18.5.1. Enthält außerdem interne Aktualisierungen für start-sdk 2.0 (erfordert StartOS 0.4.0-beta.10 oder neuer).',
    pl_PL:
      'Zaktualizowano Monero do 0.18.5.1 (Fluorine Fermi), wydania punktowego następującego po 0.18.5.0. Linia 0.18.5 dodaje obsługę SOCKS v5 w demonie i portfelu, tryb ograniczonego RPC dla ZMQ oraz liczne poprawki bezpieczeństwa portfela i RPC. Usuwa mapowanie portów UPnP (opcja --igd nie ma już działania). Pełne informacje: https://github.com/monero-project/monero/releases/tag/v0.18.5.1. Zawiera również wewnętrzne aktualizacje dla start-sdk 2.0 (wymaga StartOS 0.4.0-beta.10 lub nowszego).',
    fr_FR:
      'Monero mis à jour vers 0.18.5.1 (Fluorine Fermi), une version ponctuelle faisant suite à la 0.18.5.0. La série 0.18.5 ajoute la prise en charge de SOCKS v5 au démon et au portefeuille, un mode RPC restreint pour ZMQ, ainsi que de nombreux correctifs de sécurité du portefeuille et du RPC. Elle supprime le mappage de ports UPnP (l’option --igd est désormais sans effet). Notes complètes : https://github.com/monero-project/monero/releases/tag/v0.18.5.1. Inclut également des mises à jour internes pour start-sdk 2.0 (nécessite StartOS 0.4.0-beta.10 ou une version ultérieure).',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
