# Capa de Middleware Criptográfico (SSI)

Este directorio gestiona el **Cloud Agent** de la institución. En lugar de que el backend de la institución maneje directamente criptografía compleja o protocolos descentralizados, delegamos esa responsabilidad a un agente especializado: **Aries Cloud Agent Python (ACA-Py)**.

ACA-Py actúa como el representante criptográfico de la institución en el ecosistema descentralizado, encargado de firmar y emitir Credenciales Verificables (VCs) y solicitar Pruebas de Conocimiento Cero (ZKPs).

## Árbol del Directorio

```text
codigo/identidad/
├── config/                  # (Por implementar) Archivos de configuración avanzada para el agente.
├── schemas/                 # (Por implementar) Definiciones JSON de los esquemas de credenciales.
└── docker-compose.acapy.yml # Orquestador que levanta la imagen oficial de ACA-Py y la conecta a Hyperledger Indy.
```

## Sobre ACA-Py (Aries Cloud Agent Python)

ACA-Py es la implementación de referencia de la **OpenWallet Foundation (OWF)** para construir aplicaciones basadas en **Hyperledger Aries** y **DIDComm** (Comunicación cifrada entre DIDs).

### ¿Cómo funciona en la Tesis?

1. ACA-Py se levanta como un contenedor Docker independiente.
2. Se le configura para apuntar al nodo génesis de nuestra red local **Hyperledger Indy** (puerto `9000`).
3. Expone una **API Administrativa (Swagger) en el puerto `8001`** que nuestro Backend consumirá para darle órdenes (ej. "Emite esta credencial a este alumno").
4. Expone un puerto HTTP en el `8000` para recibir mensajes DIDComm seguros desde otras Wallets.
5. Se comunica con el Backend enviándole **Webhooks** al puerto `8082`.

## Instrucciones de Ejecución

Antes de arrancar el agente, asegúrate de que la red VON-Network esté corriendo (puerto `9000`) y que el DID de la institución esté registrado en el Ledger usando la semilla `00000000000000000000000000000002`.

Para desplegar el agente ACA-Py:

```bash
cd codigo/identidad
docker compose -f docker-compose.acapy.yml up -d
```

Puedes acceder al panel administrativo (Swagger) nativo de ACA-Py en: `http://localhost:8001`. (Sin embargo, en esta tesis controlamos ACA-Py directamente desde nuestro Backend en el puerto `8082`).
