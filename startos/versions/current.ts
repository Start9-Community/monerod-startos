import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.18.5.4:4',
  releaseNotes: {
    en_US:
      'Requires StartOS 0.4.1 or later. Peers can now connect to your node over its IPv6 addresses.',
    es_ES:
      'Requiere StartOS 0.4.1 o posterior. Los pares ahora pueden conectarse a tu nodo a través de sus direcciones IPv6.',
    de_DE:
      'Erfordert StartOS 0.4.1 oder neuer. Peers können sich jetzt über die IPv6-Adressen deines Knotens mit ihm verbinden.',
    pl_PL:
      'Wymaga StartOS 0.4.1 lub nowszego. Peery mogą teraz łączyć się z twoim węzłem przez jego adresy IPv6.',
    fr_FR:
      'Nécessite StartOS 0.4.1 ou une version ultérieure. Les pairs peuvent désormais se connecter à votre nœud via ses adresses IPv6.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
