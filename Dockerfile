FROM node:24.22.3-bookworm-slim@sha256:dc26ae92c9fb15cf6b1d63e20f0944b2efe0f115b20e00be48fb23fceb061c54 AS driver-node
FROM unclecode/crawl4ai:0.9.4@sha256:9021b3cb5c6f12570bbcd5395638495e0a06969b3148e377b953d174af2ebc9b
USER root
# The base image's CA store and its certifi are only as current as its last release.
# Bootstrap pip through repaired system trust, not its vendored roots.
RUN apt-get update && apt-get install -y --no-install-recommends --only-upgrade ca-certificates && rm -rf /var/lib/apt/lists/* \
 && ! grep -q MIICTjCCAdOgAwIBAgIKPPYHqWhwDtqLhDAKBggqhkjOPQQDAzBr /etc/ssl/certs/ca-certificates.crt \
 && python -m pip --isolated install --no-cache-dir --upgrade \
      --use-deprecated=legacy-certs --cert /etc/ssl/certs/ca-certificates.crt \
      'certifi>=2026.10.19' 'pillow>=13.0.0,<14' \
 && ! find /usr/local/lib -path '*/certifi/cacert.pem' -not -path '*/pip/_vendor/*' -exec grep -l MIICTjCCAdOgAwIBAgIKPPYHqWhwDtqLhDAKBggqhkjOPQQDAzBr {} + | grep -q .
# Driver Node replacements must preserve the major and never downgrade.
RUN --mount=type=bind,from=driver-node,source=/usr/local/bin/node,target=/tmp/node \
    new="$(/tmp/node --version)" \
 && for driver in playwright patchright; do \
      bundled="$(python -c "from $driver._impl._driver import compute_driver_executable; print(compute_driver_executable()[0])")" \
      && old="$("$bundled" --version)" \
      && [ "${old%%.*}" = "${new%%.*}" ] && [ "$old" != "$new" ] \
      && [ "$(printf '%s\n' "$old" "$new" | sort -V | head -n 1)" = "$old" ] \
      && install -m 755 /tmp/node "$bundled" \
      || { echo "$driver requires a newer replacement in its existing Node major" >&2; exit 1; }; \
    done
USER appuser
