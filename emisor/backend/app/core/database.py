from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from app.core.config import settings

# Crear motor asíncrono
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True, # Útil para ver las consultas SQL en desarrollo
)

# Fabrica de sesiones
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Base para los modelos
Base = declarative_base()

# Dependencia para inyectar la sesión de la base de datos en los endpoints
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
