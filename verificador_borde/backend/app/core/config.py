from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Institución Emisora - API Controlador"
    # PostgreSQL async URL
    # format: postgresql+asyncpg://user:password@host:port/db_name
    DATABASE_URL: str = "postgresql+asyncpg://tesis_user:tesis_password@localhost:5433/ssi_backend"
    
    # URL del Agente ACA-Py. Por defecto es local, pero en Docker orquestado será http://acapy-agent:8001
    ACAPY_ADMIN_URL: str = "http://host.docker.internal:8001"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
