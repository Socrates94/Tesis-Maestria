# Capa Lógica Institucional (Backend)

Este directorio contiene el "cerebro" centralizado de la institución emisora. Está construido utilizando **Python y FastAPI** y su propósito es orquestar las reglas de negocio de la institución, comunicarse con su propia base de datos relacional y enviar instrucciones criptográficas al Agente ACA-Py.

## Árbol del Directorio

```text
codigo/backend/
├── app/                     # Código fuente principal de FastAPI.
│   ├── api/                 # Controladores y rutas (Endpoints REST y Webhooks).
│   │   ├── credentials.py   # Emisión de credenciales e invitaciones.
│   │   ├── setup.py         # Registro de Schemas y CredDefs en Indy.
│   │   ├── verification.py  # Solicitud de pruebas ZKP (Zero-Knowledge Proofs).
│   │   └── webhooks.py      # Escucha de notificaciones desde ACA-Py.
│   ├── core/                # Configuración global, variables de entorno y conexión a BD.
│   ├── models/              # Modelos ORM (SQLAlchemy) que mapean a tablas de Postgres.
│   ├── schemas/             # Modelos Pydantic para validación de datos (Input/Output).
│   └── main.py              # Punto de entrada de la aplicación FastAPI.
│
├── docker-compose.yml       # Orquestador que levanta la base de datos PostgreSQL y la API.
├── Dockerfile.backend       # Receta para construir la imagen Docker de la API.
└── requirements.txt         # Dependencias de Python (FastAPI, SQLAlchemy, httpx, etc.).
```

## Arquitectura y Tecnologías

El backend actúa como un **Controller** del Agente Aries (ACA-Py). Sigue el patrón de diseño donde la lógica empresarial y los datos confidenciales nunca tocan la blockchain.

*   **FastAPI:** Framework moderno y asíncrono para construir APIs web rápidas. Maneja de manera concurrente los Webhooks que llegan desde ACA-Py.
*   **PostgreSQL:** Almacena la información de las conexiones DIDComm y el estado de las verificaciones.
*   **SQLAlchemy (Async):** ORM con conexiones asíncronas para alto rendimiento.

## Flujo de Trabajo (Backend ↔ ACA-Py)

1. El operador institucional (o Swagger) llama a un endpoint del Backend.
2. El Backend hace una llamada HTTP (REST) a la API Administrativa de ACA-Py (`host.docker.internal:8001`).
3. ACA-Py realiza el trabajo criptográfico, comunicándose con la blockchain (Indy) y la Billetera del Usuario (BC Wallet).
4. ACA-Py notifica el resultado al Backend haciendo una petición POST asíncrona a la ruta de **Webhooks** (`/webhooks/topic/`).
5. El Backend actualiza el estado en PostgreSQL.

## Instrucciones de Ejecución

Para desplegar tanto la base de datos PostgreSQL como la API de FastAPI:

```bash
cd codigo/backend
docker compose up -d --build
```

- **API (FastAPI)**: Accesible en `http://localhost:8082`. 
- **Swagger UI**: Accede a `http://localhost:8082/docs` para interactuar con todos los endpoints (Emitir, Verificar, Configurar).
