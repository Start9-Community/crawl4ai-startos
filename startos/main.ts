import { i18n } from './i18n'
import { sdk } from './sdk'
import { storeJson } from './fileModels/store.json'
import { uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Crawl4AI'))

  const apiToken = await storeJson.read((s) => s.apiToken).const(effects)

  // Never mount over /home/appuser/.cache — the Playwright browsers are baked
  // in there and an empty mount shadows them.
  const mounts = sdk.Mounts.of().mountVolume({
    volumeId: 'main',
    subpath: 'outputs',
    mountpoint: '/var/lib/crawl4ai/outputs',
    readonly: false,
  })

  return sdk.Daemons.of(effects)
    .addOneshot('fix-permissions', {
      subcontainer: sdk.SubContainer.of(
        effects,
        { imageId: 'crawl4ai' },
        mounts,
        'crawl4ai-fixperms',
      ),
      exec: {
        // The volume subpath arrives root-owned; the server writes it as appuser.
        command: [
          'sh',
          '-c',
          'chown -R appuser:appuser /var/lib/crawl4ai/outputs && chmod 700 /var/lib/crawl4ai/outputs',
        ],
        user: 'root',
      },
      requires: [],
    })
    .addDaemon('crawl4ai', {
      subcontainer: sdk.SubContainer.of(
        effects,
        { imageId: 'crawl4ai' },
        mounts,
        'crawl4ai-sub',
      ),
      exec: {
        // entrypoint.sh execs supervisord, which has to be PID 1.
        command: sdk.useEntrypoint(),
        runAsInit: true,
        env: {
          CRAWL4AI_API_TOKEN: apiToken ?? '',
          PYTHON_ENV: 'production',
        },
      },
      ready: {
        display: i18n('Web Interface'),
        gracePeriod: 60_000,
        fn: () =>
          sdk.healthCheck.checkWebUrl(
            effects,
            `http://127.0.0.1:${uiPort}/health`,
            {
              successMessage: i18n('The web interface is ready'),
              errorMessage: i18n('The web interface is not ready'),
            },
          ),
      },
      requires: ['fix-permissions'],
    })
})
