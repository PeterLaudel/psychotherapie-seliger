#!/bin/sh
set -e

if [ "$1" = "test" ]; then
  export NODE_ENV=test
  npm run db:create
  npm run db:migrate
  exec npm run test:ci
elif [ "$1" = "e2e" ]; then
  NODE_ENV=e2e npm run db:create
  NODE_ENV=e2e npm run db:migrate
  NODE_ENV=e2e npm run db:seed
  npx playwright install --with-deps chromium
  exec npm run e2e
elif [ "$1" = "run" ]; then
  exec npm start
else
  # Fallback: run whatever command was passed
  exec "$@"
fi