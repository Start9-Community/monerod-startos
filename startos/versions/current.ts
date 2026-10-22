import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.18.5.4:0',
  releaseNotes: {
    en_US:
      'Updates Monero to 0.18.5.4, with improved peer connections and block relay, privacy hardening of the restricted RPC, and many wallet fixes. The Blockchain Sync Progress health check now works when RPC credentials are enabled.',
    es_ES:
      'Actualiza Monero a 0.18.5.4, con conexiones entre pares y retransmisión de bloques mejoradas, mayor privacidad en el RPC restringido y numerosas correcciones en el monedero. La comprobación de estado Progreso de sincronización de la cadena de bloques ahora funciona con las credenciales RPC activadas.',
    de_DE:
      'Aktualisiert Monero auf 0.18.5.4, mit verbesserten Peer-Verbindungen und Blockweiterleitung, besserem Datenschutz im eingeschränkten RPC und zahlreichen Wallet-Korrekturen. Die Zustandsprüfung Blockchain-Synchronisierungsfortschritt funktioniert jetzt auch bei aktivierten RPC-Zugangsdaten.',
    pl_PL:
      'Aktualizuje Monero do 0.18.5.4, z ulepszonymi połączeniami z peerami i przekazywaniem bloków, lepszą ochroną prywatności w ograniczonym RPC oraz licznymi poprawkami portfela. Kontrola stanu Postęp synchronizacji łańcucha bloków działa teraz przy włączonych danych logowania RPC.',
    fr_FR:
      'Met à jour Monero vers 0.18.5.4, avec des connexions entre pairs et un relais de blocs améliorés, une meilleure confidentialité du RPC restreint et de nombreux correctifs du portefeuille. Le contrôle de santé Progression de la synchronisation de la blockchain fonctionne désormais lorsque les identifiants RPC sont activés.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
