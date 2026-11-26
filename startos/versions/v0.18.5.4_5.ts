import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import {
  generateWalletRpcLogin,
  parseWalletRpcLogin,
  walletRpcConfFile,
} from '../fileModels/monero-wallet-rpc.conf'

export const v_0_18_5_4_5 = VersionInfo.of({
  version: '0.18.5.4:5',
  releaseNotes: {
    en_US:
      'The Wallet RPC now always requires a username and password. If you had not set them, new ones have been generated: run the **Wallet RPC Credentials** action to view them, and enter them in every client that connects to the Wallet RPC Interface. You can change them in **Wallet RPC Settings**.',
    es_ES:
      'El RPC del monedero ahora siempre requiere un nombre de usuario y una contraseña. Si no los había configurado, se han generado unos nuevos: ejecute la acción **Credenciales RPC del monedero** para verlos e introdúzcalos en todos los clientes que se conecten a la interfaz RPC del monedero. Puede cambiarlos en **Ajustes RPC del monedero**.',
    de_DE:
      'Das Wallet-RPC verlangt jetzt immer einen Benutzernamen und ein Passwort. Falls Sie keine festgelegt hatten, wurden neue erzeugt: Führen Sie die Aktion **Wallet-RPC-Anmeldeinformationen** aus, um sie anzuzeigen, und tragen Sie sie in jedem Client ein, der sich mit der Wallet-RPC-Schnittstelle verbindet. Ändern können Sie sie unter **Wallet-RPC-Einstellungen**.',
    pl_PL:
      'RPC portfela wymaga teraz zawsze nazwy użytkownika i hasła. Jeśli ich nie ustawiono, wygenerowano nowe: uruchom akcję **Poświadczenia RPC portfela**, aby je wyświetlić, i wprowadź je w każdym kliencie łączącym się z interfejsem RPC portfela. Możesz je zmienić w **Ustawieniach RPC portfela**.',
    fr_FR:
      "Le RPC du portefeuille exige désormais toujours un nom d'utilisateur et un mot de passe. Si vous ne les aviez pas définis, de nouveaux identifiants ont été générés : lancez l'action **Identifiants RPC du portefeuille** pour les afficher, puis saisissez-les dans chaque client qui se connecte à l'interface RPC du portefeuille. Vous pouvez les modifier dans **Paramètres RPC du portefeuille**.",
  },
  migrations: {
    up: async ({ effects }) => {
      const login = await walletRpcConfFile.read((c) => c['rpc-login']).once()
      if (!parseWalletRpcLogin(login))
        await walletRpcConfFile.merge(effects, {
          'rpc-login': generateWalletRpcLogin(),
        })
    },
    down: IMPOSSIBLE,
  },
})
