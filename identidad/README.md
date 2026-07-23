# Capa de Middleware Criptográfico (SSI)

Este directorio gestiona el **Cloud Agent** de la institución. En lugar de que el backend de la institución maneje directamente criptografía compleja o protocolos descentralizados, delegamos esa responsabilidad a un agente especializado: **Aries Cloud Agent Python (ACA-Py)**.

ACA-Py actúa como el representante criptográfico de la institución en el ecosistema descentralizado, encargado de firmar y emitir Credenciales Verificables (VCs) y solicitar Pruebas de Conocimiento Cero (ZKPs).

## Árbol del Directorio

```text
codigo/identidad/
├── config/                  # (Por implementar) Archivos de configuración avanzada para el agente.
│
├── schemas/                 # (Por implementar) Definiciones JSON de los esquemas de credenciales (ej. Título Universitario, Credencial de Alumno).
│
├── webhooks/                # (Por implementar) Scripts auxiliares o configuraciones para manejar las notificaciones asíncronas de Aries.
│
└── docker-compose.acapy.yml # Orquestador que levanta la imagen oficial de ACA-Py (OpenWallet Foundation) y la conecta a Hyperledger Indy.
```

## Sobre ACA-Py (Aries Cloud Agent Python)

ACA-Py es un proyecto de código abierto originalmente incubado bajo Hyperledger y actualmente mantenido por la **OpenWallet Foundation (OWF)**. Es la implementación de referencia para construir aplicaciones basadas en **Hyperledger Aries** y **DIDComm** (Comunicación cifrada entre DIDs).

*   **Enlace Oficial:** [https://github.com/openwallet-foundation/acapy](https://github.com/openwallet-foundation/acapy)

### ¿Cómo funciona en la Tesis?

1.  ACA-Py se levanta como un contenedor Docker independiente (usando `docker-compose.acapy.yml`).
2.  Se le configura para apuntar al nodo génesis de nuestra red local **Hyperledger Indy** (puerto `9000`).
3.  Expone una API Administrativa (Swagger) en el puerto `8001` que nuestro **Backend (FastAPI)** consumirá para darle órdenes (ej. "Emite esta credencial a este alumno").
4.  Expone un puerto HTTP en el `8000` para recibir mensajes seguros de otros agentes (ej. la Billetera Móvil del alumno) usando DIDComm.

## Instrucciones de Ejecución

Antes de arrancar el agente, asegúrate de que la red VON-Network esté corriendo (puerto `9000`).
Para desplegar el agente ACA-Py, ejecuta Docker Compose indicando el archivo específico:

```bash
cd codigo/identidad
docker compose -f docker-compose.acapy.yml up -d
```

Esto levantará el agente y lo registrará en la red utilizando la semilla `00000000000000000000000000000001` inyectada en el archivo YAML.
Puedes acceder al panel administrativo (Swagger) en: `http://localhost:8001/api/docs`.
