from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import webhooks, credentials

app = FastAPI(
    title="Institución Emisora - API Controlador",
    description="Backend FastAPI para controlar el Agente ACA-Py institucional",
    version="1.0.0"
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

@app.get("/")
def read_root():
    return {"message": "API Institucional iniciada correctamente"}
