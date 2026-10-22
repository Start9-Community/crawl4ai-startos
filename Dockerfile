ARG IMAGE
FROM ${IMAGE}
USER root
# The base image's CA store and its certifi are only as current as its last release.
RUN apt-get update && apt-get install -y --no-install-recommends --only-upgrade ca-certificates && rm -rf /var/lib/apt/lists/* \
 && ! grep -q MIICTjCCAdOgAwIBAgIKPPYHqWhwDtqLhDAKBggqhkjOPQQDAzBr /etc/ssl/certs/ca-certificates.crt \
 && pip install --no-cache-dir --upgrade 'certifi>=2026.10.19' \
 && ! find /usr/local/lib -path '*/certifi/cacert.pem' -not -path '*/pip/_vendor/*' -exec grep -l MIICTjCCAdOgAwIBAgIKPPYHqWhwDtqLhDAKBggqhkjOPQQDAzBr {} + | grep -q .
USER appuser
