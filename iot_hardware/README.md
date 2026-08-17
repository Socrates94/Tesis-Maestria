# Capa Física (Hardware IoT - Torniquete)

Este directorio está reservado para el código C++ (PlatformIO / Arduino IDE) que se ejecutará en el microcontrolador ESP32 del torniquete.

## Componentes Físicos
- **ESP32:** Cerebro principal en la puerta de acceso.
- **Lector NFC (PN532 / NTAG):** Para formatear dinámicamente y emitir Deep Links (NDEF) hacia los teléfonos de los estudiantes.
- **Relevador:** Para accionar el mecanismo físico del torniquete.
- **Sensor Infrarrojo/Ultrasónico:** Para detectar el cruce físico y enviar telemetría de cierre de ciclo (anti-tailgating).

## Comunicación
El ESP32 no ejecuta criptografía ZKP pesada. Se comunica vía **MQTT** con el servidor de borde (Verificador) para solicitar los desafíos criptográficos y recibir las órdenes de apertura.
Aquí también reside `mosquitto.conf`, la configuración del Broker MQTT que el orquestador principal de Docker utiliza para habilitar esta comunicación.
