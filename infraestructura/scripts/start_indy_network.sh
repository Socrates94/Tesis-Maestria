#!/bin/bash

# start_indy_network.sh
# Este script levanta la red local de Hyperledger Indy utilizando von-network.

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
VON_DIR="$DIR/../von-network"

if [ ! -d "$VON_DIR" ]; then
    echo "von-network no encontrado. Clonando el repositorio..."
    git clone https://github.com/bcgov/von-network.git "$VON_DIR"
fi

echo "Levantando la red local de Indy (von-network)..."
cd "$VON_DIR"

# Obtener IP local para la génesis de Indy (evita el fallback a 192.168.65.9)
# Usamos la IP de la interfaz de docker (172.17.0.1) para evitar bloqueos de red en laptops
HOST_IP="${1:-172.17.0.1}"
if [ -z "$HOST_IP" ]; then
    HOST_IP="127.0.0.1"
fi

# Construir la imagen si es la primera vez
echo "Construyendo las imágenes de Docker para von-network..."
./manage build

# Levantar los nodos (utilizará el DNS interno de Docker automáticamente)
echo "Iniciando los nodos de Indy con DNS interno..."
./manage start "von-node1-1,von-node2-1,von-node3-1,von-node4-1,von-node5-1,von-node6-1,von-node7-1"

echo "La red local de Indy está corriendo."
echo "Puedes acceder al explorador web (Ledger Browser) en: http://localhost:9000"

