#!/bin/bash

# stop_indy_network.sh
# Este script detiene la red local de Hyperledger Indy.

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
VON_DIR="$DIR/../von-network"

if [ ! -d "$VON_DIR" ]; then
    echo "von-network no encontrado en $VON_DIR."
    exit 1
fi

echo "Deteniendo la red local de Indy (von-network)..."
cd "$VON_DIR"
./manage down

echo "La red local de Indy se ha detenido."
