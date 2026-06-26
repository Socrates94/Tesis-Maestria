#!/bin/bash

# stop_acapy.sh
# Este script detiene el agente ACA-Py.

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
ACAPY_DIR="$DIR/../../identidad"

echo "Deteniendo el Agente ACA-Py..."
cd "$ACAPY_DIR"

docker compose -f docker-compose.acapy.yml down

echo "ACA-Py detenido."
