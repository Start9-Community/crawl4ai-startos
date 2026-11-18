FROM node:24.22.1-bookworm-slim AS playwright-node
FROM unclecode/crawl4ai:0.9.4
USER root
# The base image's CA store and its certifi are only as current as its last release.
RUN apt-get update && apt-get install -y --no-install-recommends --only-upgrade ca-certificates && rm -rf /var/lib/apt/lists/* \
 && ! grep -q MIICTjCCAdOgAwIBAgIKPPYHqWhwDtqLhDAKBggqhkjOPQQDAzBr /etc/ssl/certs/ca-certificates.crt \
 && python -m pip install --no-cache-dir --upgrade 'certifi>=2026.10.19' 'pillow>=13.0.0,<14' \
 && ! find /usr/local/lib -path '*/certifi/cacert.pem' -not -path '*/pip/_vendor/*' -exec grep -l MIICTjCCAdOgAwIBAgIKPPYHqWhwDtqLhDAKBggqhkjOPQQDAzBr {} + | grep -q .
# Playwright uses its private Node, not a system installation.
RUN --mount=type=bind,from=playwright-node,source=/usr/local/bin/node,target=/tmp/playwright-node \
    install -m 755 /tmp/playwright-node "$(python -c 'from playwright._impl._driver import compute_driver_executable; print(compute_driver_executable()[0])')"
USER appuser
