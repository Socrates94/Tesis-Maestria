from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.verification import VerificationRequest, VerificationResponse
from app.models.verification import VerificationRecord
from app.core.config import settings
import httpx
import logging
import uuid
import time

router = APIRouter(
    prefix="/verificacion",
    tags=["Verificación (ZKP)"]
)

logger = logging.getLogger(__name__)

@router.post("/solicitar", response_model=VerificationResponse)
async def solicitar_verificacion(req: VerificationRequest, db: AsyncSession = Depends(get_db)):
    """
    Solicita al alumno que envíe una prueba criptográfica (ZKP) de su credencial.
    """
    # Construir la solicitud de prueba (Proof Request)
    # Pediremos que compruebe que está Activo y en Ciencias de la Computación.
    proof_request_payload = {
        "connection_id": req.connection_id,
        "presentation_request": {
            "indy": {
                "name": "Prueba de Acceso Universitario",
                "version": "1.0",
                "nonce": str(int(time.time())),
                "requested_attributes": {
                    "0_estatus_inscripcion": {
                        "name": "estatus_inscripcion",
                        "restrictions": [
                            {
                                "cred_def_id": req.cred_def_id,
                                "attr::estatus_inscripcion::value": "Activo"
                            }
                        ]
                    },
                    "1_facultad": {
                        "name": "facultad",
                        "restrictions": [
                            {
                                "cred_def_id": req.cred_def_id,
                                "attr::facultad::value": "Ciencias de la Computación"
                            }
                        ]
                    }
                },
                "requested_predicates": {}
            }
        }
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{settings.ACAPY_ADMIN_URL}/present-proof-2.0/send-request",
                json=proof_request_payload,
                timeout=30.0
            )
            response.raise_for_status()
            acapy_data = response.json()
            
            pres_ex_id = acapy_data.get("pres_ex_id")
            state = acapy_data.get("state")
            
            # Guardar en base de datos
            nuevo_registro = VerificationRecord(
                connection_id=req.connection_id,
                presentation_exchange_id=pres_ex_id,
                state=state
            )
            db.add(nuevo_registro)
            await db.commit()
            
            return VerificationResponse(
                message="Solicitud de verificación enviada al dispositivo",
                presentation_exchange_id=pres_ex_id,
                state=state
            )
    except httpx.HTTPStatusError as e:
        logger.error(f"Error HTTP desde ACA-Py: {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=f"Error ACA-Py: {e.response.text}")
    except Exception as e:
        logger.error(f"Error de conexión con ACA-Py: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno al conectar con el Agente")
