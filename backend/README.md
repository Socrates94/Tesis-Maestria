# Capa Lógica Institucional (Backend)

Este directorio contiene el "cerebro" centralizado de la institución emisora. Está construido utilizando **Python y FastAPI** y su propósito es orquestar las reglas de negocio de la institución, comunicarse con su propia base de datos relacional y enviar instrucciones criptográficas al Agente ACA-Py.

## Árbol del Directorio

```text
codigo/backend/
├── app/                     # Código fuente principal de FastAPI.
│   ├── api/                 # Controladores y rutas (Endpoints REST y Webhooks).
│   ├── core/                # Configuración global, variables de entorno y conexión a BD.
│   ├── models/              # Modelos ORM (SQLAlchemy) que mapean a tablas de Postgres.
│   ├── schemas/             # Modelos Pydantic para validación de datos (Input/Output).
│   ├── services/            # Lógica de negocio (Ej. lógica para emitir un título).
│   └── main.py              # Punto de entrada de la aplicación FastAPI.
│
├── tests/                   # Pruebas unitarias e integrales para el backend.
│
├── docker-compose.yml       # Orquestador que levanta la base de datos PostgreSQL aislada.
├── Dockerfile.backend       # Receta para construir la imagen Docker de la API.
└── requirements.txt         # Dependencias de Python (FastAPI, SQLAlchemy, asyncpg, etc.).
```

## Arquitectura y Tecnologías

El backend actúa como un **Controller** del Agente Aries (ACA-Py). Sigue el patrón de diseño donde la lógica empresarial y los datos confidenciales nunca tocan la blockchain.

*   **FastAPI:** Framework moderno y asíncrono para construir APIs web rápidas. Elegido por su soporte nativo para `async/await`, crucial para manejar los Webhooks asíncronos que recibe desde ACA-Py.
*   **PostgreSQL:** Base de datos relacional elegida para almacenar la información interna de la institución (ej. registros de alumnos, calificaciones) y simular un entorno de producción real, resolviendo problemas de concurrencia típicos de SQLite.
*   **SQLAlchemy (Async):** ORM (Object Relational Mapper) para interactuar con la base de datos Postgres sin escribir SQL crudo, usando conexiones asíncronas para alto rendimiento.

## Flujo de Trabajo (Backend ↔ ACA-Py)

1. El Front-End pide al Backend que emita una credencial.
2. El Backend consulta la base de datos interna (PostgreSQL) para verificar que el usuario tiene derecho a esa credencial.
3. El Backend hace una llamada HTTP (REST) a la API Administrativa de ACA-Py.
4. ACA-Py hace el trabajo criptográfico y se comunica con la blockchain (Indy) y la Billetera del Usuario.
5. ACA-Py notifica el resultado al Backend haciendo una petición POST asíncrona a los **Webhooks** del Backend (`app/api/webhooks.py`).

## Instrucciones de Ejecución

Para desplegar tanto la base de datos PostgreSQL como la API de FastAPI, simplemente ejecuta Docker Compose dentro de esta carpeta:

```bash
cd codigo/backend
docker compose up -d --build
```

Esto levantará:
- **Base de Datos (Postgres)**: Accesible localmente en el puerto `5433` (mapeado al 5432 interno) usando las credenciales definidas en `docker-compose.yml`.
- **API (FastAPI)**: Accesible en `http://localhost:8082`. 

*Nota*: Se utiliza el puerto `8082` en lugar de `8080` para evitar posibles colisiones con otros servicios web que el usuario pudiera tener activos.
