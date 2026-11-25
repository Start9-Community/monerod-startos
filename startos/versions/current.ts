import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.18.5.4:6',
  releaseNotes: {
    en_US:
      "With **Accept inbound connections over Tor** on, peers that connect through your .onion address are now treated as Tor peers: they see a different node identity from your clearnet peers, as many of them as **Max Tor Inbound Connections** allows can be connected at once, and a ban on one does not affect the others. Requires Tor 0.4.9.17:4 or later. Monero's unrestricted RPC is now reachable only from inside the Monero service, not from other services on your server, and web pages from other sites can no longer read from the node's RPC through your browser. Wallets and services that use your node connect through the RPC Interface as before.",
    es_ES:
      'Con **Aceptar conexiones entrantes mediante Tor** activado, los pares que se conectan a través de su dirección .onion ahora se tratan como pares Tor: ven una identidad de nodo distinta de la que ven sus pares de clearnet, pueden estar conectados a la vez tantos como permita **Máximo de conexiones entrantes Tor**, y un bloqueo a uno no afecta a los demás. Requiere Tor 0.4.9.17:4 o posterior. El RPC sin restricciones de Monero ahora solo es accesible desde dentro del servicio Monero, no desde otros servicios de su servidor, y las páginas web de otros sitios ya no pueden leer el RPC del nodo a través de su navegador. Los monederos y servicios que usan su nodo se conectan mediante la interfaz RPC como antes.',
    de_DE:
      'Bei aktiviertem **Eingehende Verbindungen über Tor akzeptieren** werden Peers, die sich über Ihre .onion-Adresse verbinden, jetzt als Tor-Peers behandelt: Sie sehen eine andere Knotenidentität als Ihre Clearnet-Peers, es können so viele gleichzeitig verbunden sein, wie **Max. eingehende Tor-Verbindungen** erlaubt, und eine Sperre eines Peers betrifft die anderen nicht. Erfordert Tor 0.4.9.17:4 oder neuer. Das uneingeschränkte RPC von Monero ist jetzt nur noch innerhalb des Monero-Dienstes erreichbar, nicht mehr von anderen Diensten auf Ihrem Server, und Webseiten anderer Websites können das RPC des Knotens nicht mehr über Ihren Browser auslesen. Wallets und Dienste, die Ihren Knoten nutzen, verbinden sich wie bisher über die RPC-Schnittstelle.',
    pl_PL:
      'Przy włączonej opcji **Akceptuj połączenia przychodzące przez Tor** peery łączące się przez Twój adres .onion są teraz traktowane jako peery Tor: widzą inną tożsamość węzła niż Twoi peery z clearnetu, jednocześnie może być połączonych tylu, ile wynosi **Maks. przychodzących połączeń Tor**, a zablokowanie jednego nie wpływa na pozostałych. Wymaga Tor 0.4.9.17:4 lub nowszego. Nieograniczone RPC Monero jest teraz dostępne tylko z wnętrza usługi Monero, a nie z innych usług na Twoim serwerze, a strony internetowe z innych witryn nie mogą już odczytywać RPC węzła przez Twoją przeglądarkę. Portfele i usługi korzystające z Twojego węzła łączą się przez interfejs RPC tak jak dotąd.',
    fr_FR:
      "Avec **Accepter les connexions entrantes via Tor** activé, les pairs qui se connectent via votre adresse .onion sont désormais traités comme des pairs Tor : ils voient une identité de nœud différente de celle que voient vos pairs clearnet, autant d'entre eux que le permet **Connexions entrantes Tor max.** peuvent être connectés en même temps, et le bannissement de l'un n'affecte pas les autres. Nécessite Tor 0.4.9.17:4 ou une version ultérieure. Le RPC sans restriction de Monero n'est désormais accessible que depuis le service Monero lui-même, et non depuis les autres services de votre serveur, et les pages web d'autres sites ne peuvent plus lire le RPC du nœud via votre navigateur. Les portefeuilles et les services qui utilisent votre nœud se connectent via l'interface RPC comme avant.",
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
