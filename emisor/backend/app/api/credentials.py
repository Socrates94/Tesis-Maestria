from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.config import settings
from app.schemas.credentials import EmisionRequest, EmisionResponse
from app.models.connection import ConnectionRecord
import httpx
import logging

router = APIRouter(prefix="/credenciales", tags=["Credenciales"])

# URL de la API Admin de ACA-Py desde configuracion
ACAPY_ADMIN_URL = settings.ACAPY_ADMIN_URL

@router.post("/invitacion")
async def crear_invitacion():
    """
    Genera una invitación Out-Of-Band (OOB) para que una Wallet Móvil la escanee.
    """
    payload = {
        "accept": [
            "didcomm/aip1",
            "didcomm/aip2;env=rfc19"
        ],
        "alias": "Alumno",
        "handshake_protocols": [
            "https://didcomm.org/didexchange/1.0"
        ],
        "my_label": "Institucion Emisora",
        "protocol_version": "1.1",
        "use_public_did": True
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{ACAPY_ADMIN_URL}/out-of-band/create-invitation",
                json=payload
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {"error": str(e)}

from pydantic import BaseModel

class AlumnoData(BaseModel):
    nombre_completo: str
    matricula: str
    facultad: str
    estatus_inscripcion: str
    nivel: str

@router.post("/emitir")
async def emitir_credencial(connection_id: str, schema_id: str, cred_def_id: str, alumno: AlumnoData):
    """
    Emite la credencial de acceso BUAP a una conexión activa.
    """
    payload = {
        "connection_id": connection_id,
        "filter": {
            "indy": {
                "schema_id": schema_id,
                "cred_def_id": cred_def_id
            }
        },
        "credential_preview": {
            "@type": "issue-credential/2.0/credential-preview",
            "attributes": [
                {"name": "nombre_completo", "value": alumno.nombre_completo},
                {"name": "matricula", "value": alumno.matricula},
                {"name": "facultad", "value": alumno.facultad},
                {"name": "estatus_inscripcion", "value": alumno.estatus_inscripcion},
                {"name": "nivel", "value": alumno.nivel}
            ]
        }
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{ACAPY_ADMIN_URL}/issue-credential-2.0/send",
                json=payload
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {"error": str(e)}
