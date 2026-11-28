import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.18.5.4:7',
  releaseNotes: {
    en_US:
      "Other services on this server, such as P2Pool, can use Monero's unrestricted RPC again, now always behind a login and never from your network. If you had pointed P2Pool at this node by its address, it lost its connection when the previous update made the unrestricted RPC reachable only from inside Monero. To restore it, update P2Pool and choose **Monero on this server** in its **Configure** action: it connects with the login on its own.",
    es_ES:
      'Otros servicios de este servidor, como P2Pool, pueden volver a usar el RPC sin restricciones de Monero, ahora siempre con inicio de sesión y nunca desde su red. Si había apuntado P2Pool a este nodo por su dirección, perdió la conexión cuando la actualización anterior hizo que el RPC sin restricciones solo fuera accesible desde dentro de Monero. Para restaurarla, actualice P2Pool y elija **Monero en este servidor** en su acción **Configurar**: se conecta con el inicio de sesión por sí solo.',
    de_DE:
      'Andere Dienste auf diesem Server, etwa P2Pool, können das uneingeschränkte RPC von Monero wieder nutzen, jetzt stets mit Anmeldung und nie aus Ihrem Netzwerk. Falls Sie P2Pool über die Adresse dieses Knotens verbunden hatten, ging die Verbindung verloren, als das vorige Update das uneingeschränkte RPC nur noch innerhalb von Monero erreichbar machte. Um sie wiederherzustellen, aktualisieren Sie P2Pool und wählen Sie in dessen Aktion **Konfigurieren** die Option **Monero auf diesem Server**: P2Pool verbindet sich selbst mit der Anmeldung.',
    pl_PL:
      'Inne usługi na tym serwerze, takie jak P2Pool, mogą znów korzystać z nieograniczonego RPC Monero, teraz zawsze z logowaniem i nigdy z Twojej sieci. Jeśli P2Pool był skierowany na ten węzeł przez jego adres, utracił połączenie, gdy poprzednia aktualizacja udostępniła nieograniczone RPC tylko z wnętrza Monero. Aby je przywrócić, zaktualizuj P2Pool i wybierz **Monero na tym serwerze** w jego akcji **Konfiguruj**: sam połączy się z użyciem loginu.',
    fr_FR:
      "Les autres services de ce serveur, comme P2Pool, peuvent de nouveau utiliser le RPC sans restriction de Monero, désormais toujours avec un identifiant et jamais depuis votre réseau. Si vous aviez pointé P2Pool vers ce nœud par son adresse, il a perdu sa connexion lorsque la mise à jour précédente a rendu le RPC sans restriction accessible uniquement depuis Monero. Pour la rétablir, mettez P2Pool à jour et choisissez **Monero sur ce serveur** dans son action **Configurer** : il se connecte seul avec l'identifiant.",
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
