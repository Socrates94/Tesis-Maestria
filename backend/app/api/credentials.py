from fastapi import APIRouter
import httpx

router = APIRouter(prefix="/credenciales", tags=["Credenciales"])

# URL de la API Admin de ACA-Py
ACAPY_ADMIN_URL = "http://host.docker.internal:8001"

@router.post("/emitir")
async def emitir_credencial(connection_id: str, schema_id: str, cred_def_id: str):
    """
    Ejemplo de endpoint para emitir una credencial.
    Llama a la API administrativa de ACA-Py.
    """
    # En un escenario real, los atributos vendrían del request o base de datos.
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
                {"name": "nombre", "value": "Juan Perez"},
                {"name": "matricula", "value": "20230001"}
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
