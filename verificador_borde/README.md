# Verificador en el Borde (Torniquete IoT)

Este directorio contiene la lógica para el **Torniquete**, actuando como el Verificador de Pruebas de Conocimiento Cero (ZKP).

## Componentes
- `backend/`: API en FastAPI (puerto 8083). Escucha solicitudes MQTT desde el hardware (ESP32), orquesta la creación de "Presentation Requests" a través de ACA-Py, y envía comandos de apertura por MQTT si la prueba criptográfica es exitosa.
- `identidad/`: Archivos de configuración para el agente ACA-Py (puerto 8010/8011). Actúa con el rol de `Verifier` en la red. No requiere permisos especiales de Endorser en Indy.

## Ejecución
Se levanta automáticamente desde el orquestador principal en la raíz de `codigo/` mediante `docker compose up -d`.
