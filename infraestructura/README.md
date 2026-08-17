# Infraestructura SSI (Blockchain Indy)

Este directorio contiene la infraestructura descentralizada base de la tesis. Aquí reside **Hyperledger Indy**, la blockchain de consorcio donde viven los DIDs (Identificadores Descentralizados) y los Esquemas Criptográficos públicos.

## Árbol del Directorio

```text
codigo/infraestructura/
├── von-network/             # Red Indy "en una caja" mantenida por el Gob. de BC.
│   ├── manage               # Script de orquestación de Docker Compose para la red.
│   └── docker-compose.yml   # Nodos validadores de la blockchain y webserver.
├── indy-pool/               # Configuraciones adicionales del pool de Indy.
└── scripts/                 # Scripts bash auxiliares para manejar la infraestructura.
    ├── start_indy_network.sh
    ├── stop_indy_network.sh
    ├── start_acapy.sh
    └── stop_acapy.sh
```

## Sobre `von-network`

Para simular una red Hyperledger Indy en la computadora local de forma rápida, utilizamos **VON (Verifiable Organizations Network)**. Es un entorno Docker portátil que levanta **4 nodos validadores** de Indy y un explorador web donde se pueden visualizar todas las transacciones de la red.

## Scripts de Administración (`/scripts`)

Para facilitar el levantamiento de los componentes principales del ecosistema SSI sin tener que escribir los largos comandos de Docker o recordar parámetros complejos, se proveen 4 scripts ejecutables en la carpeta `scripts/`.

### 1. `start_indy_network.sh`
Este script se encarga de iniciar los 4 nodos validadores de la blockchain utilizando el entorno de `von-network`. Es el primer componente que **siempre** debe levantarse, ya que el resto de microservicios dependen de él.
*   **Comando interno principal:** Llama a `./manage start` dentro de `von-network`.
*   **Servicios expuestos:** Ledger Browser en `http://localhost:9000`.

### 2. `stop_indy_network.sh`
Detiene los contenedores de la blockchain local de Indy sin borrar los datos del ledger (DIDs, Esquemas, etc).

### 3. `start_acapy.sh`
Levanta el agente criptográfico Aries Cloud Agent Python (ACA-Py). Para funcionar, requiere que la red Indy ya esté arriba, ya que el script le pasará el "Genesis file" de la blockchain.
*   **Puertos por defecto:** 8000 (HTTP de comunicación) y 8001 (Swagger / API Admin).

### 4. `stop_acapy.sh`
Detiene el proceso del agente criptográfico de manera segura.

## Modo Orquestado (Recomendación)

> [!TIP]
> Aunque los scripts de esta carpeta funcionan perfectamente de manera independiente, se recomienda utilizar el archivo maestro `docker-compose.yml` ubicado en la raíz (`/codigo`) para levantar todo el proyecto (Base de datos, Backend, Frontend, y ACA-Py) simultáneamente con un solo comando.
