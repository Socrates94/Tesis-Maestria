# Infraestructura SSI (Blockchain Indy)

Este directorio contiene la infraestructura descentralizada base de la tesis. Aquí reside **Hyperledger Indy**, la blockchain de consorcio donde viven los DIDs (Identificadores Descentralizados) y los Esquemas Criptográficos públicos.

## Árbol del Directorio

```text
codigo/infraestructura/
└── von-network/             # Red Indy "en una caja" mantenida por el Gob. de BC.
    ├── manage               # Script principal de orquestación de Docker Compose para la red.
    ├── docker-compose.yml   # Define los nodos de la blockchain, webserver y bases de datos RocksDB.
    └── ...                  # Archivos internos del repositorio von-network.
```

## Sobre `von-network`

Para simular una red Hyperledger Indy en la computadora local de forma rápida, utilizamos **VON (Verifiable Organizations Network)**. Es un entorno Docker portátil creado y mantenido originalmente por el Gobierno de Columbia Británica (Canadá) como un bien público para los desarrolladores de Hyperledger Aries. 

*   **Enlace Oficial:** [https://github.com/bcgov/von-network](https://github.com/bcgov/von-network)

Al ejecutar VON, se levantan **4 nodos validadores** de Indy y un explorador web donde se pueden visualizar todas las transacciones de la red.

## Instrucciones de Uso

Para levantar la blockchain localmente:

1. Ingresa a la carpeta de von-network:
   ```bash
   cd von-network
   ```

2. (Solo la primera vez) Construye las imágenes Docker:
   ```bash
   ./manage build
   ```

3. Levanta la red:
   ```bash
   ./manage start
   ```

4. Abre tu navegador web en **http://localhost:9000** para ver el "Ledger Browser". Desde ahí podrás auditar el estado de los nodos y registrar manualmente nuevos DIDs autorizados (Endorsers).

Para detener la red sin borrar los datos:
```bash
./manage stop
```

Para borrar la red por completo (¡Atención: Se perderán todos los DIDs y Schemas!):
```bash
./manage down
```
