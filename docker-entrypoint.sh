#!/bin/sh -e

if [ "$1" = "run" ]; then
    exec npm run start
else
    exec "$@"
fi
