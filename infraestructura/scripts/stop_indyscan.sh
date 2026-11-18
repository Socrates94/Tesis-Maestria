#!/bin/bash

# stop_indyscan.sh
# Detiene los servicios de IndyScan (Elasticsearch, Daemon, API, WebApp y Daemon-UI).

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
INDYSCAN_DIR="$DIR/../indyscan"

echo "Deteniendo IndyScan..."
cd "$INDYSCAN_DIR"
docker compose down

echo "IndyScan se ha detenido correctamente."
