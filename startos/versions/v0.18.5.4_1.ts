import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const v_0_18_5_4_1 = VersionInfo.of({
  version: '0.18.5.4:1',
  releaseNotes: {
    en_US:
      'Monero starts with ZMQ enabled. The ZeroMQ interface (port 18082) is no longer exported; block and transaction notifications remain on the ZeroMQ Pub-Sub interface (port 18083). Any domain or address setting on the ZeroMQ interface is removed with it.',
    es_ES:
      'Monero arranca con ZMQ activado. La interfaz ZeroMQ (puerto 18082) ya no se exporta; las notificaciones de bloques y transacciones siguen disponibles en la interfaz de publicación-suscripción ZeroMQ (puerto 18083). Cualquier dominio o ajuste de dirección de la interfaz ZeroMQ se elimina con ella.',
    de_DE:
      'Monero startet mit aktiviertem ZMQ. Die ZeroMQ-Schnittstelle (Port 18082) wird nicht mehr exportiert; Block- und Transaktionsbenachrichtigungen bleiben über die ZeroMQ-Pub-Sub-Schnittstelle (Port 18083) verfügbar. Domains und Adresseinstellungen der ZeroMQ-Schnittstelle werden mit ihr entfernt.',
    pl_PL:
      'Monero uruchamia się z włączonym ZMQ. Interfejs ZeroMQ (port 18082) nie jest już eksportowany; powiadomienia o blokach i transakcjach pozostają dostępne w interfejsie publikacji-subskrypcji ZeroMQ (port 18083). Domeny i ustawienia adresów interfejsu ZeroMQ są usuwane razem z nim.',
    fr_FR:
      "Monero démarre avec ZMQ activé. L'interface ZeroMQ (port 18082) n'est plus exportée ; les notifications de blocs et de transactions restent disponibles sur l'interface de publication-abonnement ZeroMQ (port 18083). Les domaines et paramètres d'adresse de l'interface ZeroMQ sont supprimés avec elle.",
  },
  migrations: {
    up: async ({ effects }) => {
      await sdk.MultiHost.of(effects, 'zmq').retire()
    },
    down: IMPOSSIBLE,
  },
})
