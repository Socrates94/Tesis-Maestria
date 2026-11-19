# Walkthrough: Arquitectura SSI + IoT BUAP

¡Felicidades! La infraestructura base de la tesis está completamente implementada de acuerdo al documento maestro. Este documento te guiará para probar el ciclo de vida completo de la credencial desde tu computadora antes de la junta con tu directora de tesis.

> [!IMPORTANT]
> Debes tener **BC Wallet** instalada en tu teléfono móvil para realizar la prueba end-to-end.

## 1. Levantar el Ecosistema

Abre una terminal en `/codigo/` y levanta la blockchain primero:
```bash
cd infraestructura/scripts
./start_indy_network.sh
```

Abre otra terminal, también en `/codigo/`, y levanta la orquestación maestra:
```bash
docker compose up -d --build
```
> [!NOTE]
> Esto levantará Mosquitto (Broker MQTT), la base de datos, el Emisor (FastAPI + ACA-Py), el Verificador (FastAPI + ACA-Py) y el Frontend.

## 2. Inicializar el Esquema BUAP

La blockchain necesita conocer el formato de tu credencial. Realiza una petición POST al endpoint que creamos en el Emisor.
Puedes usar cURL o la interfaz de Swagger (`http://localhost:8082/docs`):
```bash
curl -X POST http://localhost:8082/setup/init-buap
```
Verás que te devuelve el `schema_id` y `credential_definition_id`.

## 3. Enrolamiento del Alumno (Frontend)

1. Abre tu navegador en **`http://localhost:5173`**.
2. Verás el **Portal de Alumnos BUAP**. Inicia sesión con cualquier matrícula (ej. `20240001`) y contraseña.
3. Haz clic en el botón **"Generar Credencial SSI"**.
4. Se dibujará un código QR en la pantalla.
5. Abre **BC Wallet** en tu celular y escanea el QR.
6. Tu celular establecerá un túnel seguro DIDcomm con el Emisor, el cual *(mediante la lógica en `credentials.py`)* te enviará la credencial con los atributos: *"Activo"* y *"Ciencias de la Computación"*.
7. ¡Acepta y guarda la credencial en tu Wallet!

## 4. Probar el Torniquete Físico (Verificador IoT)

Ahora simularemos que pasas tu teléfono por el torniquete.
Abre una tercera terminal, instala la dependencia MQTT y corre el script de simulación del hardware:

```bash
cd codigo/iot_hardware
pip install -r requirements.txt
python simulador_torniquete.py
```
> Verás en la terminal que el simulador se queda escuchando (📡 `buap/torniquete/comandos`).

Para simular que el torniquete (Verificador) te pide la prueba ZKP al leer tu NFC, lanza la solicitud criptográfica. Abre otra terminal y haz el request al Verificador (o usa Swagger en `http://localhost:8083/docs`):

```bash
curl -X POST http://localhost:8083/verificacion/solicitar \
-H "Content-Type: application/json" \
-d '{"connection_id": "<TU_CONNECTION_ID_AQUI>", "cred_def_id": "<CRED_DEF_ID_DEL_PASO_2>"}'
```
*(Para obtener un `connection_id` válido del verificador, actualmente puedes escanear un QR de conexión genérico desde `http://localhost:8011` que es el ACA-Py del verificador).*

### Lo que pasará (Magia ZKP):
1. Te llegará una notificación a **BC Wallet** pidiendo comprobar que eres un alumno Activo de Ciencias de la Computación.
2. Al dar en **"Compartir"**, el celular calcula la prueba matemática y la envía.
3. El webhook de FastAPI en `webhooks.py` recibe la prueba y la evalúa matemáticamente.
4. Al dar **`verified=True`**, FastAPI publica un mensaje MQTT a Mosquitto.
5. Verás en tu terminal del `simulador_torniquete.py`:
   `>>> [SIMULACIÓN HW] 🟢 TORNIQUETE ABIERTO`
   `>>> [SIMULACIÓN HW] 🔴 TORNIQUETE CERRADO`
6. El hardware manda de regreso la telemetría cerrando el ciclo.

> [!TIP]
> ¡Tienes luz verde técnica! La columna vertebral distribuida, las pruebas criptográficas ZKP y la mensajería IoT MQTT ya están programadas y listas para su presentación.
