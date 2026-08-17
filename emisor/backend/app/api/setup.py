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

@router.post("/init-buap")
async def initialize_buap_schema():
    """
    Registra automáticamente el esquema 'credencial-acceso-buap' y su definición de credencial.
    (Flujo de inicialización de la tesis).
    """
    schema_payload = {
        "schema_name": "credencial-acceso-buap",
        "schema_version": "1.0",
        "attributes": ["nombre_completo", "matricula", "facultad", "estatus_inscripcion", "nivel"]
    }
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            # 1. Registrar Schema
            resp_schema = await client.post(f"{ACAPY_ADMIN_URL}/schemas", json=schema_payload)
            resp_schema.raise_for_status()
            schema_id = resp_schema.json().get("schema_id")
            
            # 2. Registrar Credential Definition
            cred_def_payload = {
                "schema_id": schema_id,
                "tag": "default",
                "support_revocation": False
            }
            resp_cred_def = await client.post(f"{ACAPY_ADMIN_URL}/credential-definitions", json=cred_def_payload)
            resp_cred_def.raise_for_status()
            
            return {
                "message": "Inicialización exitosa",
                "schema_id": schema_id,
                "credential_definition_id": resp_cred_def.json().get("credential_definition_id")
            }
        except Exception as e:
            return {"error": f"Error en inicialización: {str(e)}"}
