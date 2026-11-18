#!/bin/bash

# sync_genesis.sh
# Sincroniza el archivo genesis desde von-network hacia la configuración de IndyScan.

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
GENESIS_TARGET="$DIR/../indyscan/app-configs-daemon/genesis/LOCAL_NETWORK.txn"

echo "Verificando conexión con von-network (http://localhost:9000/genesis)..."
if curl -s -f http://localhost:9000/genesis > /tmp/latest_genesis.txn; then
    mv /tmp/latest_genesis.txn "$GENESIS_TARGET"
    echo "Génesis actualizado exitosamente en $GENESIS_TARGET"
else
    echo "Advertencia: von-network no responde en http://localhost:9000. Manteniendo génesis existente."
fi
