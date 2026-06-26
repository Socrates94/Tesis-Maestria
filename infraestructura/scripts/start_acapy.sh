#!/bin/bash

# start_acapy.sh
# Este script levanta el agente ACA-Py (Controlador Institucional).

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
ACAPY_DIR="$DIR/../../identidad"

echo "Iniciando el Agente ACA-Py..."
cd "$ACAPY_DIR"

# Asegurar que la red de Indy está accesible
# ACA-Py necesita que genesis-url sea accesible, y docker-compose usará host.docker.internal
# Si estás en linux puro, puede que host.docker.internal necesite configurarse.
# Docker compose v2+ usualmente maneja extra_hosts de host.docker.internal a host-gateway.

docker compose -f docker-compose.acapy.yml up -d

echo "ACA-Py se ha iniciado en segundo plano."
echo "API Admin disponible en: http://localhost:8001"
