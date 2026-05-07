#!/bin/sh
set -e

if [ "$1" = "test" ]; then
  export NODE_ENV=test
  export DATABASE_DIALECT=postgres
  npm run db:create
  npm run db:migrate
  npm run test
  export DATABASE_DIALECT=sqlite
  npm run db:create
  npm run db:migrate
  npm run test
  npm run lint
  exec npm run typecheck
elif [ "$1" = "e2e" ]; then
  npx playwright install --with-deps chromium
  export NODE_ENV=e2e
  export DATABASE_DIALECT=postgres
  npm run db:create
  npm run db:migrate
  npm run db:seed
  npm run e2e
  export DATABASE_DIALECT=sqlite
  npm run db:create
  npm run db:migrate
  npm run db:seed
  exec npm run e2e
elif [ "$1" = "run" ]; then
  exec npm start
else
  # Fallback: run whatever command was passed
  exec "$@"
fi