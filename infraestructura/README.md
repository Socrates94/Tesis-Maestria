# Infraestructura SSI (Identidad Auto-Soberana)

Este directorio es el corazón de la infraestructura descentralizada de la tesis. Aquí reside todo lo necesario para simular una red **Hyperledger Indy** local (la blockchain donde viven los DIDs y los Esquemas Criptográficos) y los scripts para gestionar el Agente Institucional de Aries (**ACA-Py**).

## Árbol del Directorio

```text
codigo/infraestructura/
├── .env.infra               # (Opcional) Archivo para variables de entorno globales de la infraestructura.
│
├── indy-pool/               # Configuración base para conectarse a una red Indy.
│   ├── pool_transactions_genesis  # Archivo de transacciones génesis original (utilizado si te conectas a una red externa).
│   └── tbc_env_setup.sh     # Scripts históricos de inicialización base.
│
├── scripts/                 # Ejecutables bash para gestionar la vida útil de los contenedores Docker.
│   ├── start_indy_network.sh # Levanta los 4 nodos validadores de Indy usando von-network.
│   ├── stop_indy_network.sh  # Detiene y limpia la red local de Indy.
│   ├── start_acapy.sh       # Levanta el agente Aries (ACA-Py) conectado a Indy.
│   └── stop_acapy.sh        # Detiene el agente ACA-Py.
│
└── von-network/             # (Clonado vía script) Red Indy "en una caja" mantenida por el Gob. de BC.
    ├── manage               # Script principal de orquestación de Docker Compose para la red.
    ├── docker-compose.yml   # Define los nodos de la blockchain, webserver y bases de datos RocksDB.
    └── ...                  # Archivos internos del repositorio von-network.
```

## Sobre `von-network`

Para simular una red Hyperledger Indy en la computadora local sin tener que instalar y compilar el código fuente de Indy-Node (lo cual es sumamente complejo), se está utilizando **VON (Verifiable Organizations Network)**.

**VON Network** es un entorno Docker portátil creado y mantenido originalmente por el Gobierno de Columbia Británica (Canadá) como un bien público para los desarrolladores de Hyperledger Aries. 

*   **Enlace Oficial:** [https://github.com/bcgov/von-network](https://github.com/bcgov/von-network)

### ¿Cómo se clonó?

El repositorio **no** fue clonado de forma manual. Para asegurar que cualquier persona (o sinodal) que revise la tesis pueda reproducir tu entorno fácilmente, la clonación está **automatizada** dentro del script `scripts/start_indy_network.sh`.

Si abres ese archivo, verás este fragmento de código:

```bash
VON_DIR="$DIR/../von-network"

if [ ! -d "$VON_DIR" ]; then
    echo "von-network no encontrado. Clonando el repositorio..."
    git clone https://github.com/bcgov/von-network.git "$VON_DIR"
fi
```

Esto garantiza que la primera vez que se intente levantar la red, el sistema descargará el código oficial automáticamente de GitHub. Además, esto solucionó el error de "repositorio de git embebido" que tuviste inicialmente, ya que `von-network` se maneja como un directorio ignorado (`.gitignore`) por el control de versiones principal de la tesis.

## ¿Cómo iniciar todo?

El flujo de trabajo natural en esta carpeta es usar la terminal integrada para:

1. **Levantar la Blockchain:**
   `bash scripts/start_indy_network.sh`
   *(Esto levantará la red y su explorador en `http://localhost:9000`)*

2. **Levantar el Agente (ACA-Py):**
   `bash scripts/start_acapy.sh`
   *(Esto conectará la billetera criptográfica institucional a la blockchain recién creada)*
