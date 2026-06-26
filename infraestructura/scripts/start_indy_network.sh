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

# Construir la imagen si es la primera vez
echo "Construyendo las imágenes de Docker para von-network (esto puede tomar unos minutos la primera vez)..."
./manage build

# Levantar los nodos
echo "Iniciando los nodos de Indy..."
./manage start

echo "La red local de Indy está corriendo."
echo "Puedes acceder al explorador web (Ledger Browser) en: http://localhost:9000"
