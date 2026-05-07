#!/bin/sh
set -e

if [ "$1" = "test" ]; then
  export NODE_ENV=test
  DATABASE_DIALECT=postgres npm run db:create
  DATABASE_DIALECT=postgres npm run db:migrate
  npm run test:postgres
  DATABASE_DIALECT=sqlite npm run db:create
  DATABASE_DIALECT=sqlite npm run db:migrate
  npm run test:sqlite
  npm run lint
  exec npm run typecheck
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