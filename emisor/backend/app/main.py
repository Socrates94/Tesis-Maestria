from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import webhooks, credentials, setup, verification
from contextlib import asynccontextmanager
from app.core.database import engine, Base
# Importar modelos para que Base.metadata.create_all los reconozca
from app.models.connection import ConnectionRecord
from app.models.verification import VerificationRecord
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Inicializar la base de datos al arrancar
    async with engine.begin() as conn:
        # En producción se usaría Alembic, aquí creamos las tablas directamente
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(
    title="Institución Emisora - API Controlador",
    description="Backend FastAPI para controlar el Agente ACA-Py institucional",
    version="1.0.0",
    lifespan=lifespan
)

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(webhooks.router)
app.include_router(credentials.router)
app.include_router(setup.router)
app.include_router(verification.router)

@app.get("/")
def read_root():
    return {"message": "API Institucional iniciada correctamente"}
