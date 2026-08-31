import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.9.2:0',
  releaseNotes: {
    en_US: 'Initial release of Crawl4AI for StartOS.',
    es_ES: 'Versión inicial de Crawl4AI para StartOS.',
    de_DE: 'Erstveröffentlichung von Crawl4AI für StartOS.',
    pl_PL: 'Pierwsze wydanie Crawl4AI dla StartOS.',
    fr_FR: 'Version initiale de Crawl4AI pour StartOS.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
