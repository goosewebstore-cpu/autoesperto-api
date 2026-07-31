#!/bin/sh
set -e
echo "Starting AutoEsperto API..."
exec node dist/index.js
