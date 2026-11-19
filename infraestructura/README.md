# Infraestructura SSI (Blockchain Indy)

Este directorio contiene la infraestructura descentralizada base de la tesis. Aquí reside **Hyperledger Indy**, la blockchain de consorcio donde viven los DIDs (Identificadores Descentralizados) y los Esquemas Criptográficos públicos.

El repositorio base para la red local de pruebas se clonó originalmente de:
[https://github.com/bcgov/von-network](https://github.com/bcgov/von-network)

## Árbol del Directorio

```text
codigo/infraestructura/
├── von-network/             # Red Indy "en una caja" mantenida por el Gob. de BC.
│   ├── manage               # Script de orquestación de Docker Compose para la red.
│   └── docker-compose.yml   # Nodos validadores de la blockchain y webserver.
├── indyscan/                # Explorador avanzado de transacciones y auditoría (Elasticsearch + UI).
│   ├── app-config-api/      # Configuración de redes para indyscan-api.
│   ├── app-configs-daemon/  # Configuración de workers y archivo génesis para indyscan-daemon.
│   └── docker-compose.yml   # Orquestador de Elasticsearch, Daemon, API y WebApp de IndyScan.
├── indy-pool/               # Configuraciones adicionales del pool de Indy.
└── scripts/                 # Scripts bash auxiliares para manejar la infraestructura.
    ├── start_indy_network.sh
    ├── stop_indy_network.sh
    ├── start_indyscan.sh
    ├── stop_indyscan.sh
    ├── sync_genesis.sh
    ├── start_acapy.sh
    └── stop_acapy.sh
```

## Sobre `von-network` y Nodos de la Red

Para simular una red Hyperledger Indy en la computadora local de forma rápida, utilizamos **VON (Verifiable Organizations Network)**. Es un entorno Docker portátil que levanta nodos validadores de Indy y un explorador web para monitorear la red.

### ¿Cómo agregar o modificar nodos?
El archivo `infraestructura/von-network/docker-compose.yml` contiene la definición de los nodos (actualmente están configurados del `node1` al `node7`). El script `./manage start` por defecto levanta 4 nodos para alcanzar el consenso básico (BFT). 

Si necesitas agregar más nodos (por ejemplo, escalar la red con un `node8`):
1. **Copia** el bloque de un nodo existente (ej. `node7`) dentro de `docker-compose.yml`.
2. **Renombra** el servicio a `node8` y cambia su comando a `./scripts/start_node.sh 8`.
3. **Asigna nuevos puertos libres** secuencialmente (por ejemplo, `9715:9715` y `9716:9716`).
4. **Define un nuevo volumen** para los datos, ej. `node8-data:/home/indy/ledger`.
5. **Registra** ese nuevo volumen (`node8-data:`) al final del archivo en la sección `volumes`.

## Explorador Web de la Red (Ledger Browser)

Al levantar la red, se expone automáticamente un servidor web en el puerto **9000**. Puedes acceder a él abriendo en tu navegador: [http://localhost:9000](http://localhost:9000).

**Componentes más importantes de la página web:**
1. **Status / Home:** Muestra el estado de salud, uptime y consenso de los nodos activos en tiempo real. 
2. **Domain Transactions:** Aquí puedes explorar todos los registros inmutables escritos en la blockchain. Es fundamental para verificar:
   - **NYM:** Registro de nuevos DIDs y llaves públicas de las entidades (Trust Anchors).
   - **SCHEMA:** Definiciones de la estructura de las credenciales (ej. atributos como `nombre`, `matricula` en `credencial-acceso-buap`).
   - **CRED_DEF:** Definiciones de credenciales públicas vinculadas a un esquema y a la llave pública de un Emisor.
3. **Authenticate a New DID:** Permite registrar un DID con rol de Endorser de forma manual si necesitas interactuar con la red mediante un script externo sin usar un agente como ACA-Py.

## Pruebas y Experimentos en la DLT

Para validar el correcto funcionamiento y resistencia de la red distribuida, puedes realizar las siguientes pruebas:

1. **Prueba de Consenso (Tolerancia a fallos):** Entra a `http://localhost:9000`. Verifica que los nodos estén activos (en verde). Si detienes intencionalmente un contenedor (`docker stop von-node4-1`), la red debería seguir operando y validando transacciones, demostrando la tolerancia a fallos bizantinos (PBFT).
2. **Registro de DID y Schema:** A través del Emisor (levantando el backend), realiza la inicialización o registro. Luego, vuelve al explorador en el puerto 9000 y en **Domain Transactions** deberás ver las nuevas entradas tipo `NYM` y `SCHEMA`. Esto confirma que tu backend (ACA-Py) tiene permisos y comunicación exitosa con la blockchain.
3. **Validación ZKP de Lectura:** Al hacer una presentación de prueba ZKP en el Verificador (torniquete), la validación ocurre consultando transparentemente las llaves públicas en la DLT. Una apertura exitosa confirma la integridad de lectura de la red.

## Scripts de Administración (`/scripts`)

Se proveen 4 scripts ejecutables en la carpeta `scripts/` para operar localmente de forma ágil:

### 1. `start_indy_network.sh`
Inicia los nodos validadores y el webserver. Es el primer componente que **siempre** debe levantarse (si no se usa la orquestación global).
*   **Servicios expuestos:** Ledger Browser en `http://localhost:9000`.

### 2. `stop_indy_network.sh`
Detiene los contenedores de la blockchain local sin borrar los datos del ledger.

### 3. `start_indyscan.sh`
Inicia el stack completo de **IndyScan** (Elasticsearch, Daemon indexador, API REST, WebApp y Daemon UI).
*   **WebApp (Explorador):** `http://localhost:3707`
*   **API REST:** `http://localhost:3708`
*   **Daemon UI:** `http://localhost:3710`
*   **Elasticsearch:** `http://localhost:9200`

### 4. `stop_indyscan.sh`
Detiene todos los contenedores de IndyScan.

### 5. `sync_genesis.sh`
Sincroniza y extrae las transacciones génesis actuales desde `http://localhost:9000/genesis` hacia la configuración de `indyscan`.

### 6. `start_acapy.sh` y `stop_acapy.sh`
Scripts legacy para levantar/detener el agente criptográfico (ACA-Py) de manera independiente. *(Nota: Requiere que Indy ya esté operando).*

## Modo Orquestado (Recomendación Principal)

> [!TIP]
> Aunque estos scripts funcionan de manera independiente, la **mejor práctica** para el proyecto es utilizar el archivo maestro `docker-compose.yml` ubicado en la raíz del repositorio (`/codigo`). Este archivo levanta toda la solución completa (Base de datos, Backend Emisor, Verificador, Frontend, broker MQTT y la red Indy) simultáneamente con un solo comando.
