import { FileHelper, IMPOSSIBLE, VersionInfo, z } from '@start9labs/start-sdk'
import { moneroConfFile, toMoneroConf } from '../fileModels/monero.conf'

export const current = VersionInfo.of({
  version: '0.18.5.4:2',
  releaseNotes: {
    en_US:
      'Monero now runs block-notify commands that contain `=`, such as the one BTCPay Server sets, and accepts peers added by IPv6 address.',
    es_ES:
      'Monero ahora ejecuta los comandos block-notify que contienen `=`, como el que configura BTCPay Server, y acepta los pares añadidos por dirección IPv6.',
    de_DE:
      'Monero führt jetzt Block-Notify-Befehle aus, die `=` enthalten, etwa den von BTCPay Server gesetzten, und akzeptiert Peers, die per IPv6-Adresse hinzugefügt wurden.',
    pl_PL:
      'Monero uruchamia teraz polecenia block-notify zawierające `=`, takie jak to ustawiane przez BTCPay Server, i akceptuje peery dodane przez adres IPv6.',
    fr_FR:
      'Monero exécute désormais les commandes block-notify contenant `=`, comme celle que définit BTCPay Server, et accepte les pairs ajoutés par adresse IPv6.',
  },
  migrations: {
    up: async ({ effects }) => {
      // Earlier releases wrote monero.conf with FileHelper.ini's quoting and escapes.
      const conf = await FileHelper.ini(
        moneroConfFile.path,
        z.looseObject({}),
        { bracketedArray: false },
      )
        .read()
        .once()
      if (conf)
        await FileHelper.string(moneroConfFile.path).write(
          effects,
          toMoneroConf(conf),
        )
    },
    down: IMPOSSIBLE,
  },
})
