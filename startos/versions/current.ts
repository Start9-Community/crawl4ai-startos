import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.9.4:1',
  releaseNotes: {
    en_US: `- Set API Token asks for confirmation before it replaces an existing token.`,
    es_ES: `- Establecer Token de API pide confirmación antes de reemplazar un token existente.`,
    de_DE: `- API-Token festlegen fragt vor dem Ersetzen eines vorhandenen Tokens nach einer Bestätigung.`,
    pl_PL: `- Ustaw token API prosi o potwierdzenie przed zastąpieniem istniejącego tokenu.`,
    fr_FR: `- Définir le token API demande une confirmation avant de remplacer un token existant.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
