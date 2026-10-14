#!/bin/bash
set -e

# Cloud Run injects PORT (default 8080) - the public HTTP port served by nginx.
PUBLIC_PORT="${PORT:-8080}"
# ASP.NET listens only on this internal port; nginx proxies /api to it.
INTERNAL_PORT="${SERVER_PORT:-5000}"
export PUBLIC_PORT INTERNAL_PORT

# Render the nginx config. The packaged default site is removed so that our
# server block is the only default_server.
rm -f /etc/nginx/sites-enabled/default
envsubst '${PUBLIC_PORT} ${INTERNAL_PORT}' \
  < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

# Start the API in the background on the internal port only. Run it from its
# own directory so that appsettings.json is picked up (the content root is the
# current working directory).
cd /app/server
ASPNETCORE_URLS="http://127.0.0.1:${INTERNAL_PORT}" dotnet skillup.server.dll &
api_pid=$!

# Start nginx in the foreground on the public port.
nginx -g 'daemon off;' &
nginx_pid=$!

terminate() {
  kill -TERM "$api_pid" "$nginx_pid" 2>/dev/null || true
}
trap terminate TERM INT

# If either process dies, shut the container down so Cloud Run restarts it.
wait -n "$api_pid" "$nginx_pid"
exit_code=$?

terminate
wait || true
exit "$exit_code"
