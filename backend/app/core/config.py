from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Institución Emisora - API Controlador"
    # PostgreSQL async URL
    # format: postgresql+asyncpg://user:password@host:port/db_name
    DATABASE_URL: str = "postgresql+asyncpg://tesis_user:tesis_password@localhost:5433/ssi_backend"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
