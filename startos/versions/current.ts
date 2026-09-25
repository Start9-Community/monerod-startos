import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.18.5.1:6',
  releaseNotes: {
    en_US: `DB Salvage now repairs the database: monerod runs with --db-salvage for its next start.`,
    es_ES: `DB Salvage ahora repara la base de datos: monerod se ejecuta con --db-salvage en su siguiente inicio.`,
    de_DE: `DB Salvage repariert jetzt die Datenbank: monerod läuft beim nächsten Start mit --db-salvage.`,
    pl_PL: `DB Salvage naprawia teraz bazę danych: monerod działa z --db-salvage przy następnym starcie.`,
    fr_FR: `DB Salvage répare désormais la base de données : monerod s'exécute avec --db-salvage à son prochain démarrage.`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
