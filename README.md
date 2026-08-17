# Arquitectura Descentralizada (SSI + IoT + NFC)

Este repositorio contiene la implementación para la tesis sobre **Identidad Auto-soberana (SSI), Pruebas Criptográficas (ZKP) y Hardware de Borde (IoT)** para el control de acceso físico universitario. La arquitectura está dividida en microservicios distribuidos.

## Estructura del Proyecto

El proyecto está compuesto por cinco pilares tecnológicos:

### 1. `infraestructura/` (Hyperledger Indy)
La **blockchain local** (DLT) donde viven los DIDs públicos y esquemas de credenciales.
- Utiliza **von-network** encapsulado.
- Explorador web (Ledger Browser) en `http://localhost:9000`.

### 2. `emisor/` (Universidad: FastAPI + ACA-Py)
El nodo central de la institución emisora.
- **Backend**: FastAPI (puerto 8082). Controla las reglas de negocio, registra el Schema en la blockchain y solicita invitaciones de conexión (OOB).
- **Identidad**: ACA-Py (puerto 8000/8001). Actúa como *Endorser* para emitir credenciales hacia la billetera del alumno.

### 3. `verificador_borde/` (Torniquete: FastAPI + ACA-Py)
El nodo de borde desplegado físicamente en las entradas de la universidad.
- **Backend**: FastAPI (puerto 8083). Se conecta al broker MQTT, solicita pruebas de conocimiento cero (Presentation Requests) verificando que el alumno esté "Activo", y autoriza la apertura.
- **Identidad**: ACA-Py (puerto 8010/8011). Actúa como *Verifier*.

### 4. `iot_hardware/` (NFC + MQTT)
La capa física del torniquete.
- Código C++ para un **ESP32**.
- **Mosquitto MQTT**: El Broker de mensajería (puerto 1883) que conecta el ESP32 con el Backend del Verificador.
- Módulo **NFC (NDEF)** para enviar Deep Links al teléfono móvil del usuario y detonar automáticamente su BC Wallet.

### 5. `cliente/` (Portal Universitario Frontend)
Portal web simulado en **React (Vite)** donde el estudiante se autentica e interactúa con el Emisor para obtener su credencial original (flujo de enrolamiento).

---

## Orden de Ejecución

Debido a las dependencias, la blockchain debe encenderse antes de levantar los demás microservicios.

### 1. Levantar la Blockchain (Indy)
```bash
cd infraestructura/scripts
./start_indy_network.sh
```
*Si los contenedores de Indy son nuevos o fueron borrados, registra la semilla del Emisor:*
```bash
curl -d '{"role":"ENDORSER","alias":"Institucion","did":"JDmZmbYJnRyz5mb5U9wCxK","seed":"00000000000000000000000000000002","verkey":"APN393PJb55Jyi94DtgkQPd9zxghPbFSPqheppei5Esf"}' -H "Content-Type: application/json" -X POST http://localhost:9000/register
```

### 2. Levantar el Ecosistema Distribuido (Orquestación Maestra)
En la raíz de la carpeta `codigo/`, corre el orquestador que levanta el Broker MQTT, el Emisor (Backend+Agente) y el Verificador (Backend+Agente):
```bash
docker compose up -d --build
```

### Puertos de Acceso
- **Emisor Backend (Swagger):** `http://localhost:8082/docs`
- **Emisor Agente ACA-Py:** `http://localhost:8001`
- **Verificador Backend (Swagger):** `http://localhost:8083/docs`
- **Verificador Agente ACA-Py:** `http://localhost:8011`
- **Explorador Blockchain:** `http://localhost:9000`
- **Frontend Alumnos (React):** `http://localhost:5173`

Para apagar la orquestación usa `docker compose down`. Para detener la blockchain usa `./stop_indy_network.sh` en `infraestructura/scripts/`.
