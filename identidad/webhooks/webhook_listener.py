"""
webhook_listener.py
Captura de eventos criptográficos de Aries (ACA-Py).

Este módulo NO corre como servidor independiente. ACA-Py envía sus
eventos (webhooks) al backend de FastAPI en /webhooks/topic/{topic}.
Este archivo sirve como referencia documentada de los tópicos y sus
estructuras de payload.

Tópicos principales de ACA-Py:
  - connections:          Ciclo de vida de una conexión DIDComm
  - issue_credential_v2_0: Emisión de una Credencial Verificable (VC)
  - present_proof_v2_0:   Presentación de una Prueba ZKP
  - revocation_registry:  Eventos de revocación de credenciales
  - basicmessages:        Mensajes de texto entre agentes

Para manejar estos eventos, ver:
  codigo/backend/app/api/webhooks.py
"""

TOPICS = {
    "connections": "Ciclo de vida de una conexión DIDComm (invitation, request, response, active)",
    "issue_credential_v2_0": "Emisión de Credencial Verificable con AnonCreds/ZKP",
    "present_proof_v2_0": "Presentación y verificación de Prueba de Conocimiento Cero",
    "revocation_registry": "Creación y actualización del registro de revocación en Indy",
    "basicmessages": "Mensajes de texto entre agentes Aries",
}
