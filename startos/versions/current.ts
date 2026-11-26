import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.18.5.4:6',
  releaseNotes: {
    en_US:
      "Monero's unrestricted RPC is now reachable only from inside the Monero service, not from other services on your server, and web pages from other sites can no longer read from the node's RPC through your browser. Wallets and services that use your node connect through the RPC Interface as before.",
    es_ES:
      'El RPC sin restricciones de Monero ahora solo es accesible desde dentro del servicio Monero, no desde otros servicios de su servidor, y las páginas web de otros sitios ya no pueden leer el RPC del nodo a través de su navegador. Los monederos y servicios que usan su nodo se conectan mediante la interfaz RPC como antes.',
    de_DE:
      'Das uneingeschränkte RPC von Monero ist jetzt nur noch innerhalb des Monero-Dienstes erreichbar, nicht mehr von anderen Diensten auf Ihrem Server, und Webseiten anderer Websites können das RPC des Knotens nicht mehr über Ihren Browser auslesen. Wallets und Dienste, die Ihren Knoten nutzen, verbinden sich wie bisher über die RPC-Schnittstelle.',
    pl_PL:
      'Nieograniczone RPC Monero jest teraz dostępne tylko z wnętrza usługi Monero, a nie z innych usług na Twoim serwerze, a strony internetowe z innych witryn nie mogą już odczytywać RPC węzła przez Twoją przeglądarkę. Portfele i usługi korzystające z Twojego węzła łączą się przez interfejs RPC tak jak dotąd.',
    fr_FR:
      "Le RPC sans restriction de Monero n'est désormais accessible que depuis le service Monero lui-même, et non depuis les autres services de votre serveur, et les pages web d'autres sites ne peuvent plus lire le RPC du nœud via votre navigateur. Les portefeuilles et les services qui utilisent votre nœud se connectent via l'interface RPC comme avant.",
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
