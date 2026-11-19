# Infraestructura SSI (Blockchain Indy)

Este directorio contiene la infraestructura descentralizada base de la tesis. Aquí reside **Hyperledger Indy**, la blockchain de consorcio donde viven los DIDs (Identificadores Descentralizados) y los Esquemas Criptográficos públicos.

## Repositorios Base Utilizados

1. **VON Network (Red Indy local de pruebas):**
   - Repositorio original: [https://github.com/bcgov/von-network](https://github.com/bcgov/von-network)
   - Mantenido por el Gobierno de Columbia Británica (BC Gov).
2. **IndyScan (Explorador de Transacciones y Réplica de Lectura):**
   - Repositorio original clonado para la implementación: [https://github.com/Patrik-Stas/indyscan](https://github.com/Patrik-Stas/indyscan)
   - Creado por Patrik Staš. Permite indexar en Elasticsearch y consultar de forma gráfica las transacciones de los subledgers (`domain`, `pool` y `config`).

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

## Explorador Web Básico de la Red (Ledger Browser de von-network)

Al levantar la red con `start_indy_network.sh`, se expone automáticamente un servidor web en el puerto **9000**. Puedes acceder a él abriendo en tu navegador: [http://localhost:9000](http://localhost:9000).

**Componentes más importantes de la página web:**
1. **Status / Home:** Muestra el estado de salud, uptime y consenso de los nodos activos en tiempo real. 
2. **Domain Transactions:** Aquí puedes explorar todos los registros inmutables escritos en la blockchain. Es fundamental para verificar:
   - **NYM:** Registro de nuevos DIDs y llaves públicas de las entidades (Trust Anchors).
   - **SCHEMA:** Definiciones de la estructura de las credenciales (ej. atributos como `nombre`, `matricula` en `credencial-acceso-buap`).
   - **CRED_DEF:** Definiciones de credenciales públicas vinculadas a un esquema y a la llave pública de un Emisor.
3. **Authenticate a New DID:** Permite registrar un DID con rol de Endorser de forma manual si necesitas interactuar con la red mediante un script externo sin usar un agente como ACA-Py.

---

## Sobre `indyscan` (Explorador Avanzado y Réplica de Lectura)

Para auditorías más profundas y análisis en tiempo de ejecución, el proyecto integra **[IndyScan](https://github.com/Patrik-Stas/indyscan)** (repositorio clonado de Patrik Staš).

A diferencia del visor básico por defecto de `von-network` (que usa una caché ligera en SQLite diseñada para desarrollo local), **IndyScan** funciona como una **réplica de lectura desacoplada**:
- **Indexación continua con Elasticsearch:** Escanea automáticamente los tres subledgers (`domain`, `pool` y `config`) a través de la red Docker compartida (`von_von`) sin sobrecargar los nodos validadores de Indy.
- **Búsquedas y filtros avanzados:** Permite buscar y analizar bloques por tipo de transacción: DIDs (`NYM`), Esquemas (`SCHEMA`), Definiciones de Credenciales (`CLAIM_DEF`) y Nodos (`NODE`).
- **Actualizaciones reactivas en tiempo real:** Utiliza WebSockets para reflejar inmediatamente nuevas transacciones en pantalla sin necesidad de recargar la página.

### Componentes y Servicios de IndyScan:
- **`indyscan-elasticsearch` (Puerto 9200):** Almacenamiento NoSQL y motor de indexación de transacciones.
- **`indyscan-daemon` (Puerto 3709 interno):** Proceso en segundo plano que se conecta a los nodos validadores mediante la red Docker `von_von`, lee las transacciones en tiempo real y las transforma hacia Elasticsearch.
- **`indyscan-api` (Puerto 3708):** API REST que expone los datos indexados para consumo de clientes y aplicaciones.
- **`indyscan-webapp` (Puerto 3707):** Interfaz web gráfica en Next.js accesible desde el navegador en [http://localhost:3707/home/LOCAL_NETWORK](http://localhost:3707/home/LOCAL_NETWORK).
- **`indyscan-daemon-ui` (Puerto 3710):** Interfaz para monitorear el estado y métricas de los workers de indexación.

### Integración directa con `von-network`
`start_indy_network.sh` configura automáticamente las variables `INDY_SCAN_URL=http://localhost:3707/home/LOCAL_NETWORK` e `INDY_SCAN_TEXT="IndyScan Explorer"`, por lo que en la barra de navegación de `von-network` ([http://localhost:9000](http://localhost:9000)) aparece un enlace directo hacia IndyScan.

## Pruebas y Experimentos en la DLT

Para validar el correcto funcionamiento y resistencia de la red distribuida, puedes realizar las siguientes pruebas:

1. **Prueba de Consenso (Tolerancia a fallos):** Entra a `http://localhost:9000`. Verifica que los nodos estén activos (en verde). Si detienes intencionalmente un contenedor (`docker stop von-node4-1`), la red debería seguir operando y validando transacciones, demostrando la tolerancia a fallos bizantinos (PBFT).
2. **Registro de DID y Schema:** A través del Emisor (levantando el backend), realiza la inicialización o registro. Luego, vuelve al explorador en el puerto 9000 y en **Domain Transactions** deberás ver las nuevas entradas tipo `NYM` y `SCHEMA`. Esto confirma que tu backend (ACA-Py) tiene permisos y comunicación exitosa con la blockchain.
3. **Validación ZKP de Lectura:** Al hacer una presentación de prueba ZKP en el Verificador (torniquete), la validación ocurre consultando transparentemente las llaves públicas en la DLT. Una apertura exitosa confirma la integridad de lectura de la red.

## Scripts de Administración (`/scripts`)

Se proveen scripts ejecutables en la carpeta `scripts/` para operar la infraestructura localmente de forma ágil:

### Guía de Arranque Rápido (von-network + IndyScan)

Para levantar el entorno distribuido completo con la red Indy y el explorador IndyScan:

```bash
cd codigo/infraestructura/scripts

# Paso 1: Levantar los 7 nodos validadores y el webserver de Indy
./start_indy_network.sh

# Paso 2: Levantar el explorador avanzado IndyScan
./start_indyscan.sh
```

Una vez levantados:
- **Ledger Browser básico:** [http://localhost:9000](http://localhost:9000)
- **IndyScan (Explorador Avanzado):** [http://localhost:3707/home/LOCAL_NETWORK](http://localhost:3707/home/LOCAL_NETWORK)
- **IndyScan Daemon UI:** [http://localhost:3710](http://localhost:3710)
- **IndyScan API REST:** [http://localhost:3708](http://localhost:3708)
- **Elasticsearch:** [http://localhost:9200](http://localhost:9200)

Para detener los servicios:
```bash
cd codigo/infraestructura/scripts

# Detener IndyScan
./stop_indyscan.sh

# Detener los nodos de von-network
./stop_indy_network.sh
```

---

### Descripción de Cada Script

### 1. `start_indy_network.sh`
Inicia los 7 nodos validadores (`von-node1-1` a `von-node7-1`) y el webserver de `von-network`. Exporta las variables para vincularse directamente con IndyScan.
*   **Servicios expuestos:** Ledger Browser en `http://localhost:9000`.

### 2. `stop_indy_network.sh`
Detiene los contenedores de la blockchain local sin borrar los volúmenes de datos del ledger.

### 3. `start_indyscan.sh`
Verifica la red de Docker `von_von`, ejecuta `sync_genesis.sh` para obtener las claves génesis actuales de Indy y levanta el stack completo de **IndyScan** (Elasticsearch, Daemon, API, WebApp y Daemon UI).

### 4. `stop_indyscan.sh`
Detiene todos los contenedores de IndyScan de forma limpia (`docker compose down`).

### 5. `sync_genesis.sh`
Consulta el endpoint génesis de `von-network` (`http://localhost:9000/genesis`) y sincroniza automáticamente el archivo `LOCAL_NETWORK.txn` dentro de `indyscan/app-configs-daemon/genesis/`.

### 6. `start_acapy.sh` y `stop_acapy.sh`
Scripts auxiliares para levantar/detener un agente ACA-Py de prueba de manera independiente. *(Nota: Requiere que Indy ya esté operando).*

## Modo Orquestado (Recomendación Principal)

> [!TIP]
> Aunque estos scripts funcionan de manera independiente, la **mejor práctica** para el proyecto es utilizar el archivo maestro `docker-compose.yml` ubicado en la raíz del repositorio (`/codigo`). Este archivo levanta toda la solución completa (Base de datos, Backend Emisor, Verificador, Frontend, broker MQTT y la red Indy) simultáneamente con un solo comando.
