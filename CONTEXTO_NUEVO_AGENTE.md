# Contexto Técnico del Proyecto (Para el Agente Gemini)

**¡Hola, agente de Gemini!** Si estás leyendo esto, es porque has sido invocado en un nuevo entorno de trabajo (workspace) fuera de Dropbox. Tu objetivo principal es continuar asistiendo al usuario con la implementación técnica de su tesis de maestría.

Por favor, lee esta arquitectura cuidadosamente. **NO modifiques los puertos del `docker-compose.yml` ni asumas que hay conflictos de red sin antes verificar.** Los problemas anteriores de arranque (crashes en Von Network o ACA-Py) fueron causados por bloqueos de archivos (File Locks) debido a la sincronización de Dropbox, NO por errores en el código o en los puertos.

---

## 1. Resumen de la Arquitectura (5 Pilares)
Este repositorio contiene una arquitectura distribuida (Edge IoT + SSI) para el control de acceso físico mediante Pruebas de Conocimiento Cero (ZKP) e Identificadores Descentralizados (DIDs).

Todo el sistema está orquestado a través del archivo raíz `docker-compose.yml`.

### Los 5 Pilares:
1. **Infraestructura de Consenso (DLT):** 
   - Se utiliza `Von Network` (Hyperledger Indy) en contenedores Docker locales como ancla de confianza. 
   - *Nota:* Von Network usualmente se levanta con su propio script `./manage start` en su respectiva carpeta.
2. **Emisor Universitario (Backend):**
   - **Tecnologías:** FastAPI + Postgres + ACA-Py (Aries Cloud Agent).
   - **Puertos:** FastAPI (`8082`), ACA-Py Inbound (`8000`), ACA-Py Admin (`8001`).
   - **Rol:** Registra el esquema `credencial-acceso-buap` en la DLT y emite credenciales verificables a los alumnos.
3. **Verificador de Borde (Torniquete):**
   - **Tecnologías:** FastAPI + Postgres + ACA-Py.
   - **Puertos:** FastAPI (`8083`), ACA-Py Inbound (`8010`), ACA-Py Admin (`8011`).
   - **Rol:** Solicita una prueba ZKP al alumno. Si es válida, el webhook del backend Verificador publica un mensaje al broker MQTT para abrir el torniquete.
4. **Hardware IoT (Actuador):**
   - **Tecnologías:** Eclipse Mosquitto (Broker MQTT) + ESP32 (Hardware simulado por ahora en Python).
   - **Puertos:** MQTT (`1883`).
   - **Rol:** El ESP32 emite la petición vía NFC (Deep Link), y cuando Mosquitto recibe la orden de apertura, el ESP32 abre el relevador.
5. **Cliente (Portal Estudiantil):**
   - **Tecnologías:** React + Vite.
   - **Puertos:** Vite (`5173`).
   - **Rol:** Interfaz para que el alumno inicie sesión y solicite su credencial.

---

## 2. Flujo de Ejecución del ZKP
Cuando el alumno hace un "Tap NFC", se lanza la Billetera (BC Wallet) mediante un Deep Link OOB.
1. La billetera se conecta al **ACA-Py Verificador (`8010`)**.
2. ACA-Py recibe la prueba matemática (ZKP) y verifica su validez criptográfica contra Von Network.
3. ACA-Py envía un POST automático al webhook del **FastAPI Verificador (`8083/webhooks/topic/present_proof`)**.
4. Si `verified == "true"`, FastAPI usa la librería de MQTT para publicar en el topic `accesos/puerta_principal/abrir` apuntando a Mosquitto (`1883`).
5. El ESP32 (simulador en la carpeta `iot_hardware`) escucha ese topic y simula la apertura.

---

## 3. Directrices Estrictas para el Agente
* **No toques los puertos del `docker-compose.yml`**: Ya están configurados de manera distribuida (Emisor usa 8082, Verificador usa 8083) para evitar colisiones en `localhost`.
* **Archivos Clave a revisar si hay dudas:**
  * `docker-compose.yml` (Orquestación general).
  * `verificador_borde/backend/app/api/webhooks.py` (Lógica que conecta ZKP con MQTT).
  * `iot_hardware/simulador_torniquete.py` (Script en Python que actúa como el ESP32).
* El usuario tiene **luz verde** de su comité tutorial. El objetivo actual es realizar pruebas de integración y asegurarse de que el flujo de extremo a extremo funcione en la laptop para la presentación del viernes.

**¡Procede con confianza, tienes todo el contexto!**
