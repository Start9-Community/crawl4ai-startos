import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.9.4:3',
  releaseNotes: {
    en_US:
      'Updates Pillow and the browser driver’s Node.js runtime to fix image-processing and Brotli security flaws. Crawl4AI and its browser version are unchanged.',
    es_ES:
      'Actualiza Pillow y el entorno Node.js del controlador del navegador para corregir fallos de seguridad en el procesamiento de imágenes y Brotli. Crawl4AI y la versión del navegador no cambian.',
    de_DE:
      'Aktualisiert Pillow und die Node.js-Laufzeit des Browsertreibers, um Sicherheitslücken in der Bildverarbeitung und Brotli zu beheben. Crawl4AI und die Browserversion bleiben unverändert.',
    pl_PL:
      'Aktualizuje Pillow i środowisko Node.js sterownika przeglądarki, naprawiając luki bezpieczeństwa w przetwarzaniu obrazów i Brotli. Crawl4AI i wersja przeglądarki pozostają bez zmian.',
    fr_FR:
      'Met à jour Pillow et le moteur Node.js du pilote du navigateur pour corriger des failles de traitement d’images et de Brotli. Crawl4AI et la version du navigateur restent inchangés.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
