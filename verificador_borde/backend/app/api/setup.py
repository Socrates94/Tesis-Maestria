from fastapi import APIRouter
import httpx
from pydantic import BaseModel
from typing import List
from app.core.config import settings

router = APIRouter(prefix="/setup", tags=["Configuración (SSI)"])

# Usamos la URL desde la configuración
ACAPY_ADMIN_URL = settings.ACAPY_ADMIN_URL

class SchemaRequest(BaseModel):
    schema_name: str
    schema_version: str
    attributes: List[str]

@router.post("/schema")
async def register_schema(req: SchemaRequest):
    """
    Registra un Esquema (Schema) en la red Indy a través de ACA-Py.
    """
    payload = {
        "schema_name": req.schema_name,
        "schema_version": req.schema_version,
        "attributes": req.attributes
    }
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{ACAPY_ADMIN_URL}/schemas",
                json=payload
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {"error": str(e)}

class CredDefRequest(BaseModel):
    schema_id: str
    tag: str = "default"

@router.post("/cred-def")
async def register_credential_definition(req: CredDefRequest):
    """
    Genera y registra una Credential Definition (CredDef) en la red Indy.
    Esto permite a la institución emitir credenciales basadas en un Esquema.
    """
    payload = {
        "schema_id": req.schema_id,
        "tag": req.tag,
        "support_revocation": False
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.post(
                f"{ACAPY_ADMIN_URL}/credential-definitions",
                json=payload
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {"error": str(e)}
