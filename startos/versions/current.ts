import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.9.4:3',
  releaseNotes: {
    en_US:
      'Fixes security vulnerabilities in image processing and in how the bundled browser drivers handle compressed data, TLS and HTTP.',
    es_ES:
      'Corrige vulnerabilidades de seguridad en el procesamiento de imágenes y en cómo los controladores de navegador incluidos manejan datos comprimidos, TLS y HTTP.',
    de_DE:
      'Behebt Sicherheitslücken in der Bildverarbeitung und darin, wie die mitgelieferten Browsertreiber komprimierte Daten, TLS und HTTP verarbeiten.',
    pl_PL:
      'Naprawia luki bezpieczeństwa w przetwarzaniu obrazów oraz w sposobie, w jaki dołączone sterowniki przeglądarki obsługują skompresowane dane, TLS i HTTP.',
    fr_FR:
      'Corrige des failles de sécurité dans le traitement d’images et dans la façon dont les pilotes de navigateur intégrés traitent les données compressées, TLS et HTTP.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
