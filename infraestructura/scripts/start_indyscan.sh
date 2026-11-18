#!/bin/bash

# start_indyscan.sh
# Inicia los servicios de IndyScan (Elasticsearch, Daemon, API, WebApp y Daemon-UI).

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
INDYSCAN_DIR="$DIR/../indyscan"

# Verificar si la red von_von existe (creada por von-network)
if ! docker network ls --format '{{.Name}}' | grep -q '^von_von$'; then
    echo "Aviso: La red 'von_von' de Indy no existe todavía."
    echo "Asegúrate de haber iniciado von-network con ./start_indy_network.sh primero."
    echo "Creando red temporal von_von si no existe..."
    docker network create von_von || true
fi

# Intentar actualizar el archivo génesis si von-network ya está activo
"$DIR/sync_genesis.sh" || true

echo "Iniciando IndyScan..."
cd "$INDYSCAN_DIR"
docker compose up -d

echo ""
echo "=========================================================="
echo " IndyScan ha sido iniciado con éxito."
echo "=========================================================="
echo " - WebApp (Explorador de Transacciones): http://localhost:3707"
echo " - Red Configurada: http://localhost:3707/home/LOCAL_NETWORK"
echo " - API REST de IndyScan:                http://localhost:3708"
echo " - Daemon Monitor UI:                   http://localhost:3710"
echo " - Elasticsearch:                       http://localhost:9200"
echo "=========================================================="
