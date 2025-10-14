#!/bin/bash
set -e

npm run build
npx tsc --project tsconfig.pkg.json --outDir .
npx pkg server.js --config pkg.json --output src-tauri/binary/psychotherapie-seliger-aarch64-apple-darwin