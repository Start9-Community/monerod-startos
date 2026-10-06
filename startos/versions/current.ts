import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.18.5.1:7',
  releaseNotes: {
    en_US: `DB Salvage now repairs the database: monerod runs with --db-salvage for its next start.

- "Route all outbound traffic via", "RPC Credentials" and "Wallet RPC Credentials" describe each of their options.
- "Pad transactions" explains what it defends against.
- An invalid peer hostname says what to enter instead.`,
    es_ES: `DB Salvage ahora repara la base de datos: monerod se ejecuta con --db-salvage en su siguiente inicio.

- «Enrutar todo el tráfico saliente vía», «Credenciales RPC» y «Credenciales RPC del monedero» describen cada una de sus opciones.
- «Relleno de transacciones» explica contra qué protege.
- Un nombre de host de par no válido indica qué introducir en su lugar.`,
    de_DE: `DB Salvage repariert jetzt die Datenbank: monerod läuft beim nächsten Start mit --db-salvage.

- „Gesamten ausgehenden Verkehr leiten über", „RPC-Anmeldeinformationen" und „Wallet-RPC-Anmeldeinformationen" beschreiben jede ihrer Optionen.
- „Transaktionen auffüllen" erklärt, wogegen es schützt.
- Ein ungültiger Peer-Hostname sagt, was stattdessen einzugeben ist.`,
    pl_PL: `DB Salvage naprawia teraz bazę danych: monerod działa z --db-salvage przy następnym starcie.

- „Kieruj cały ruch wychodzący przez", „Poświadczenia RPC" i „Poświadczenia RPC portfela" opisują każdą ze swoich opcji.
- „Wypełniaj transakcje" wyjaśnia, przed czym chroni.
- Nieprawidłowa nazwa hosta peera informuje, co należy wpisać.`,
    fr_FR: `DB Salvage répare désormais la base de données : monerod s'exécute avec --db-salvage à son prochain démarrage.

- « Router tout le trafic sortant via », « Identifiants RPC » et « Identifiants RPC du portefeuille » décrivent chacune de leurs options.
- « Remplir les transactions » explique contre quoi il protège.
- Un nom d'hôte de pair invalide indique quoi saisir à la place.`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
