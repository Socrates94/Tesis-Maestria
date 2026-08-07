from fastapi import APIRouter, Request, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.connection import ConnectionRecord
from app.models.verification import VerificationRecord

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])

@router.post("/topic/{topic_name}/")
async def receive_webhook(topic_name: str, request: Request, db: AsyncSession = Depends(get_db)):
    """
    Recibe los webhooks de ACA-Py.
    ACA-Py envía notificaciones a rutas como /webhooks/topic/connections/
    """
    payload = await request.json()
    print(f"[{topic_name.upper()}] Webhook recibido. Estado: {payload.get('state', 'N/A')}")
    
    if topic_name == "connections":
        connection_id = payload.get("connection_id")
        state = payload.get("state")
        their_label = payload.get("their_label")
        their_did = payload.get("their_did")
        
        if connection_id:
            # Buscar si la conexión ya existe
            stmt = select(ConnectionRecord).where(ConnectionRecord.connection_id == connection_id)
            result = await db.execute(stmt)
            record = result.scalars().first()
            
            if record:
                record.state = state
                if their_label: record.their_label = their_label
                if their_did: record.their_did = their_did
            else:
                record = ConnectionRecord(
                    connection_id=connection_id,
                    state=state,
                    their_label=their_label,
                    their_did=their_did
                )
                db.add(record)
            
            await db.commit()
            print(f"-> Conexión {connection_id} actualizada a estado: {state} en DB.")
            
    elif topic_name == "present_proof_v2_0":
        pres_ex_id = payload.get("pres_ex_id")
        state = payload.get("state")
        verified = payload.get("verified") == "true"
        
        if pres_ex_id:
            stmt = select(VerificationRecord).where(VerificationRecord.presentation_exchange_id == pres_ex_id)
            result = await db.execute(stmt)
            record = result.scalars().first()
            
            if record:
                record.state = state
                if state == "done":
                    record.verified = verified
                    # Extraer los datos si fueron presentados
                    by_format = payload.get("by_format", {})
                    pres = by_format.get("pres", {})
                    indy_pres = pres.get("indy", {})
                    requested_proof = indy_pres.get("requested_proof", {})
                    revealed_attrs = requested_proof.get("revealed_attrs", {})
                    
                    presented_data = {}
                    for attr_id, attr_data in revealed_attrs.items():
                        # attr_id es típicamente "0_tipo_suscripcion_uuid"
                        presented_data[attr_id] = attr_data.get("raw")
                        
                    if presented_data:
                        record.presented_data = presented_data
                        
                await db.commit()
                print(f"-> Verificación {pres_ex_id} actualizada a estado: {state} (verified={verified})")

    return {"status": "ok"}
