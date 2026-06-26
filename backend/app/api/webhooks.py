from fastapi import APIRouter, Request

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])

@router.post("/topic/{topic_name}/")
async def receive_webhook(topic_name: str, request: Request):
    """
    Recibe los webhooks de ACA-Py.
    ACA-Py envía notificaciones a rutas como /webhooks/topic/connections/
    """
    payload = await request.json()
    print(f"[{topic_name.upper()}] Webhook recibido:")
    print(payload)
    
    # Aquí puedes añadir la lógica para manejar cada topic:
    # - connections: Cambios de estado en conexiones (invitation, request, active)
    # - issue_credential_v2_0: Ciclo de vida de emisión
    # - present_proof_v2_0: Ciclo de vida de presentación (ZKP)
    
    return {"status": "ok"}
