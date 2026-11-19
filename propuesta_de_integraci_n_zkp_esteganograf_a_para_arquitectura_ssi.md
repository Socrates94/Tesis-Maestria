# Contexto y Especificación Técnica: Módulo Híbrido ZKP + Esteganografía

> **Propósito de este documento:** Servir como contexto técnico y guía de implementación para integrar el proyecto final de la materia de **Criptografía** directamente sobre la arquitectura actual de tesis (*Arquitectura descentralizada para la prevención de fuga de datos mediante DIDs y pruebas criptográficas*), optimizando tiempos de desarrollo de cara a la presentación de avances del **10 de diciembre**.

---

## 1. Objetivo General
Diseñar e implementar un módulo experimental de **defensa en profundidad (Security-by-Design)** que combine **Pruebas de Conocimiento Cero (ZKP)** del ecosistema Hyperledger Indy / AnonCreds con técnicas de **Esteganografía** (en medios digitales o de red/telemetría IoT), permitiendo transmitir verificaciones de credenciales y comandos de autorización de forma encubierta hacia los nodos Edge/ESP32 sin exponer metadatos de control de acceso.

---

## 2. Alineación con la Arquitectura Actual de Tesis
El desarrollo debe reutilizar estrictamente el stack tecnológico ya desplegado en el entorno de tesis para evitar duplicidad de esfuerzos:
* **Capa de Identidad y Ledger:** Hyperledger Indy (Von Network) + ACA-Py (Aries Cloud Agent Python) + BC Wallet.
* **Capa de Orquestación y Backend:** Python / FastAPI (donde se alojarán los nuevos endpoints criptográficos/esteganográficos).
* **Capa Edge / IoT:** Broker Eclipse Mosquitto (MQTT) y nodos ESP32 con lectores NFC (PN532) y actuadores físicos (relevador / cerradura solenoide).

---

## 3. Flujo Técnico Propuesto (ZKP + Esteganografía)

El sistema operará en dos capas secuenciales de seguridad:

### Capa 1: Validación Criptográfica (Zero-Knowledge Proof)
1. El usuario presenta una credencial verificable desde su **BC Wallet** ante el agente verificador (**ACA-Py**).
2. Mediante el protocolo `Present-Proof` (AnonCreds), el usuario demuestra cumplir con una política de acceso (ej. pertenencia a un departamento autorizado o nivel de privilegio $\ge X$) sin revelar atributos personales sensibles (prevención de fuga de datos).
3. Tras validar matemáticamente la ZKP, el backend en **FastAPI** genera un **Payload de Autorización** estructurado (ej. `{ "proof_id": "...", "status": "VERIFIED", "timestamp": 1733800000, "nonce": "..." }`), el cual es firmado o cifrado simétricamente (ej. **AES-256-GCM**) utilizando una llave derivada del canal seguro DIDComm o una llave precompartida con el nodo Edge.

### Capa 2: Ocultamiento Esteganográfico (Canal Encubierto)
En lugar de enviar el *Payload de Autorización* en texto claro o JSON estándar a través de la red local (donde podría ser interceptado o perfilado mediante *sniffing* / análisis de tráfico), el módulo lo incrusta dentro de un objeto portador aparentemente inocuo.

Se plantean **dos rutas de implementación** para elegir la más viable según el estado actual del repositorio:

#### Opción A: Esteganografía en Imagen (Dominio Espacial LSB / Transformada DCT)
* **Portador:** Una imagen institucional, credencial visual o plano de acceso en formato sin pérdida (`.png` / `.bmp`) para LSB, o `.jpg` si se implementa DCT.
* **Proceso de Emisión (`/stego-zkp/embed-image`):** El payload cifrado (AES-GCM) de la verificación ZKP se convierte a flujo de bits y se incrusta en los bits menos significativos (LSB) de los canales RGB de la imagen portadora.
* **Proceso de Recepción (`/stego-zkp/extract-image`):** El servicio receptor extrae los bits, descifra el payload con AES-GCM, verifica la autenticidad/frescura del *nonce* y autoriza el acceso.

#### Opción B: Esteganografía en Telemetría IoT / Red (Protocolo MQTT - Alta sinergia con ESP32)
* **Portador:** Mensajes rutinarios de telemetría ambiental publicados en el broker **Mosquitto** (ej. lecturas simuladas o reales de temperatura/humedad de un ESP32: `24.5318 °C`).
* **Proceso de Emisión:** Los bits del token de autorización derivado de la ZKP se codifican en los dígitos decimales de ruido de las mediciones del sensor (esteganografía en datos de telemetría) o en los intervalos de tiempo entre publicaciones (esteganografía temporal / *Inter-Packet Delay*).
* **Proceso de Recepción:** El nodo **ESP32** suscrito al tópico público extrae los bits ocultos, reconstruye y verifica el token criptográfico y acciona el relevador de la puerta sin que un observador externo detecte tráfico de control de acceso.

---

## 4. Requerimientos para el Agente de Desarrollo (Antigravity)

Cuando analices el repositorio actual de la tesis, considera las siguientes directrices para proponer la estructura de código:

1. **No romper el flujo existente:** Mantener intactos los contenedores de `von-network`, `aca-py` y `mosquitto` del `docker-compose.yml` actual.
2. **Modularidad en FastAPI:** Crear un router o módulo independiente (ej. `app/routers/stego_zkp.py` y `app/services/steganography.py`) que consuma el evento o webhook de verificación exitosa de ACA-Py (`/webhooks/topic/present_proof/`).
3. **Dependencias ligeras:** Utilizar librerías estándar y probadas en Python (`cryptography` para AES-GCM/HMAC, `Pillow` + `numpy` para manipulación de matrices de imagen en Opción A, o `paho-mqtt` para Opción B).
4. **Evidencia para Demostración:** El código debe incluir logs claros y funciones de utilidad que permitan demostrar:
   * El estado de la verificación ZKP (atributos revelados vs. predicados ocultos).
   * La indistinguibilidad visual o de tráfico de red (ej. cálculo de métricas como **PSNR** y **MSE** si se usa imagen, o captura limpia en **Wireshark** si se usa MQTT).
   * La extracción exitosa y validación de integridad (fallo controlado si el portador es alterado en tránsito).

---

## 5. Instrucción Inicial para el Agente
> *"Revisa la estructura actual de nuestro proyecto de tesis (especialmente el backend en FastAPI, los webhooks de ACA-Py y la configuración de MQTT/ESP32). Con base en este documento, propón qué opción (Opción A: Imagen LSB o Opción B: Telemetría MQTT) se integra más rápido con lo que ya tenemos programado y genera el plan de archivos a crear/modificar."*