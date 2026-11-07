#!/bin/sh
set -e

if [ "$1" = "test" ]; then
  npm run lint
  exec npm run typecheck
elif [ "$1" = "e2e" ]; then
  npx playwright install --with-deps chromium
  exec npm run e2e
elif [ "$1" = "run" ]; then
  exec npm start
else
  # Fallback: run whatever command was passed
  exec "$@"
fi
