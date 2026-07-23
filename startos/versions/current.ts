import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.18.5.1:1',
  releaseNotes: {
    en_US:
      'Marks the Monero data directory nodatacow (chattr +C) on every startup, as Bitcoin Core does. On btrfs, copy-on-write severely fragments the LMDB database over time, which degrades daemon performance and can stall service updates for many minutes while StartOS snapshots the volume beforehand. New and resynced installations are protected from the start. An already-synced database cannot be converted in place — if updates have become very slow, run the Resync Blockchain action (re-downloads the entire blockchain) to rebuild the database with the flag applied.',
    es_ES:
      'Marca el directorio de datos de Monero como nodatacow (chattr +C) en cada arranque, igual que Bitcoin Core. En btrfs, el copy-on-write fragmenta gravemente la base de datos LMDB con el tiempo, lo que degrada el rendimiento del demonio y puede detener las actualizaciones del servicio durante muchos minutos mientras StartOS toma antes la instantánea del volumen. Las instalaciones nuevas y resincronizadas quedan protegidas desde el principio. Una base de datos ya sincronizada no puede convertirse en el sitio: si las actualizaciones se han vuelto muy lentas, ejecute la acción Resync Blockchain (vuelve a descargar toda la cadena de bloques) para reconstruir la base de datos con la marca aplicada.',
    de_DE:
      'Markiert das Monero-Datenverzeichnis bei jedem Start als nodatacow (chattr +C), wie es Bitcoin Core tut. Unter btrfs fragmentiert Copy-on-Write die LMDB-Datenbank mit der Zeit stark, was die Leistung des Daemons mindert und Dienst-Updates viele Minuten lang aufhalten kann, während StartOS zuvor den Volume-Snapshot erstellt. Neue und neu synchronisierte Installationen sind von Anfang an geschützt. Eine bereits synchronisierte Datenbank kann nicht direkt umgewandelt werden — wenn Updates sehr langsam geworden sind, führen Sie die Aktion Resync Blockchain aus (lädt die gesamte Blockchain erneut herunter), um die Datenbank mit gesetztem Flag neu aufzubauen.',
    pl_PL:
      'Oznacza katalog danych Monero jako nodatacow (chattr +C) przy każdym uruchomieniu, tak jak robi to Bitcoin Core. Na btrfs mechanizm copy-on-write z czasem silnie fragmentuje bazę danych LMDB, co obniża wydajność demona i może wstrzymywać aktualizacje usługi na wiele minut, gdy StartOS wykonuje wcześniej migawkę wolumenu. Nowe i ponownie zsynchronizowane instalacje są chronione od początku. Już zsynchronizowanej bazy danych nie można przekonwertować w miejscu — jeśli aktualizacje stały się bardzo wolne, uruchom akcję Resync Blockchain (ponownie pobiera cały łańcuch bloków), aby odbudować bazę danych z ustawioną flagą.',
    fr_FR:
      'Marque le répertoire de données de Monero en nodatacow (chattr +C) à chaque démarrage, comme le fait Bitcoin Core. Sur btrfs, le copy-on-write fragmente fortement la base de données LMDB au fil du temps, ce qui dégrade les performances du démon et peut bloquer les mises à jour du service pendant de longues minutes pendant que StartOS réalise au préalable l’instantané du volume. Les installations neuves ou resynchronisées sont protégées dès le départ. Une base de données déjà synchronisée ne peut pas être convertie sur place — si les mises à jour sont devenues très lentes, lancez l’action Resync Blockchain (retélécharge l’intégralité de la blockchain) pour reconstruire la base de données avec l’attribut appliqué.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
