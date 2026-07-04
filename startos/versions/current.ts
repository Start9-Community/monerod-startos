import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.18.5.0:0',
  releaseNotes: {
    en_US:
      'Updated Monero to 0.18.5.0 (Fluorine Fermi, point release 5). Adds SOCKS v5 support to the daemon and wallet, a restricted RPC mode for ZMQ, and numerous wallet and RPC hardening fixes. Removes UPnP port mapping (the --igd option is now a no-op). Full notes: https://github.com/monero-project/monero/releases/tag/v0.18.5.0. Also includes internal updates for start-sdk 2.0.',
    es_ES:
      'Monero actualizado a 0.18.5.0 (Fluorine Fermi, versión puntual 5). Añade compatibilidad con SOCKS v5 en el demonio y la cartera, un modo RPC restringido para ZMQ y numerosas correcciones de seguridad en la cartera y RPC. Elimina el mapeo de puertos UPnP (la opción --igd ahora no tiene efecto). Notas completas: https://github.com/monero-project/monero/releases/tag/v0.18.5.0. También incluye actualizaciones internas para start-sdk 2.0.',
    de_DE:
      'Monero auf 0.18.5.0 aktualisiert (Fluorine Fermi, Point-Release 5). Fügt SOCKS-v5-Unterstützung für Daemon und Wallet, einen eingeschränkten RPC-Modus für ZMQ sowie zahlreiche Sicherheitskorrekturen an Wallet und RPC hinzu. Entfernt das UPnP-Port-Mapping (die Option --igd ist nun wirkungslos). Vollständige Hinweise: https://github.com/monero-project/monero/releases/tag/v0.18.5.0. Enthält außerdem interne Aktualisierungen für start-sdk 2.0.',
    pl_PL:
      'Zaktualizowano Monero do 0.18.5.0 (Fluorine Fermi, wydanie punktowe 5). Dodaje obsługę SOCKS v5 w demonie i portfelu, tryb ograniczonego RPC dla ZMQ oraz liczne poprawki bezpieczeństwa portfela i RPC. Usuwa mapowanie portów UPnP (opcja --igd nie ma już działania). Pełne informacje: https://github.com/monero-project/monero/releases/tag/v0.18.5.0. Zawiera również wewnętrzne aktualizacje dla start-sdk 2.0.',
    fr_FR:
      'Monero mis à jour vers 0.18.5.0 (Fluorine Fermi, version ponctuelle 5). Ajoute la prise en charge de SOCKS v5 au démon et au portefeuille, un mode RPC restreint pour ZMQ, ainsi que de nombreux correctifs de sécurité du portefeuille et du RPC. Supprime le mappage de ports UPnP (l’option --igd est désormais sans effet). Notes complètes : https://github.com/monero-project/monero/releases/tag/v0.18.5.0. Inclut également des mises à jour internes pour start-sdk 2.0.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
