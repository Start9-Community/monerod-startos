import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.18.5.1:9',
  releaseNotes: {
    en_US: 'A failing Tor health check is retried every 30 seconds.',
    es_ES:
      'Una comprobación de estado de Tor fallida se reintenta cada 30 segundos.',
    de_DE:
      'Eine fehlgeschlagene Tor-Statusprüfung wird alle 30 Sekunden wiederholt.',
    pl_PL: 'Nieudana kontrola stanu Tor jest ponawiana co 30 sekund.',
    fr_FR:
      "Une vérification d'état Tor en échec est relancée toutes les 30 secondes.",
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
