# Emisor Institucional (Universidad)

Este directorio contiene la lógica para la **Universidad**, actuando como el Emisor de Credenciales Verificables.

## Componentes
- `backend/`: API en FastAPI (puerto 8082). Contiene la lógica para registrar el esquema en Indy (`credencial-acceso-buap`) y exponer endpoints para que el portal web solicite invitaciones OOB para enrolar alumnos.
- `identidad/`: Archivos de configuración para el agente ACA-Py (puerto 8000/8001). Actúa con el rol de `Endorser` en la red.

## Ejecución
Se levanta automáticamente desde el orquestador principal en la raíz de `codigo/` mediante `docker compose up -d`.
