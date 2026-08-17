import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.18.5.1:5',
  releaseNotes: {
    en_US: `Backups now include your Anonymity Networks settings.

Until now a restored node came back with those settings at their defaults — no Tor proxy, no Tor broadcast, no inbound over Tor — because the file holding them was left out of the backup. It is included from this version on, so a restored node routes its traffic the way the original did. Take a fresh backup to capture your current settings.

The blockchain is still deliberately excluded: it re-downloads from the network, and including it would make every backup as large as the chain.`,
    es_ES: `Las copias de seguridad ahora incluyen la configuración de Redes de Anonimato.

Hasta ahora, un nodo restaurado volvía con esos ajustes en sus valores predeterminados —sin proxy Tor, sin difusión por Tor, sin conexiones entrantes por Tor— porque el archivo que los contiene quedaba fuera de la copia. A partir de esta versión sí se incluye, de modo que un nodo restaurado enruta su tráfico igual que el original. Haz una copia de seguridad nueva para guardar tu configuración actual.

La cadena de bloques sigue excluida a propósito: se vuelve a descargar de la red, e incluirla haría que cada copia fuera tan grande como la cadena.`,
    de_DE: `Sicherungen enthalten jetzt Ihre Einstellungen für Anonymitätsnetzwerke.

Bisher kam ein wiederhergestellter Knoten mit den Standardwerten zurück – kein Tor-Proxy, keine Übertragung über Tor, keine eingehenden Tor-Verbindungen –, weil die Datei mit diesen Einstellungen nicht mitgesichert wurde. Ab dieser Version ist sie enthalten, sodass ein wiederhergestellter Knoten seinen Verkehr genauso leitet wie das Original. Erstellen Sie eine neue Sicherung, um Ihre aktuellen Einstellungen zu erfassen.

Die Blockchain bleibt bewusst ausgeschlossen: Sie wird aus dem Netzwerk neu geladen, und sie mitzusichern würde jede Sicherung so groß machen wie die Blockchain selbst.`,
    pl_PL: `Kopie zapasowe zawierają teraz ustawienia Sieci anonimizujących.

Do tej pory przywrócony węzeł wracał z domyślnymi ustawieniami — bez proxy Tor, bez rozgłaszania przez Tor, bez połączeń przychodzących przez Tor — ponieważ plik z tymi ustawieniami nie trafiał do kopii. Od tej wersji jest w niej zawarty, więc przywrócony węzeł kieruje ruch tak samo jak oryginał. Wykonaj nową kopię zapasową, aby zapisać bieżące ustawienia.

Łańcuch bloków nadal jest celowo pomijany: pobiera się ponownie z sieci, a jego dołączenie sprawiłoby, że każda kopia byłaby tak duża jak sam łańcuch.`,
    fr_FR: `Les sauvegardes incluent désormais vos réglages de Réseaux d'anonymat.

Jusqu'ici, un nœud restauré revenait avec ces réglages à leurs valeurs par défaut — pas de proxy Tor, pas de diffusion via Tor, pas d'entrées via Tor — car le fichier qui les contient était exclu de la sauvegarde. Il y est inclus à partir de cette version, de sorte qu'un nœud restauré achemine son trafic comme l'original. Effectuez une nouvelle sauvegarde pour enregistrer vos réglages actuels.

La chaîne de blocs reste volontairement exclue : elle se retélécharge depuis le réseau, et l'inclure rendrait chaque sauvegarde aussi volumineuse que la chaîne.`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
