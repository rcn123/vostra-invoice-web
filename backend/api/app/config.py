from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # Database
    DATABASE_URL: str = "postgresql://vostra:dev_password@localhost:5432/vostra-invoice-web"

    # AI2 Database (historical data - production postgres-ai2)
    AI2_DATABASE_URL: str = "postgresql://vostra:dev_password@localhost:5433/ai2"

    # AI Extractor Service
    AI_EXTRACTOR_URL: str = "http://localhost:8001"

    # File Storage
    STORAGE_PATH: str = "./storage/vostra-invoice-web/uploads"
    MAX_FILE_SIZE: int = 100 * 1024 * 1024  # 100MB
    ALLOWED_FILE_TYPES: list[str] = ["application/pdf", "image/png", "image/jpeg", "application/xml", "text/xml"]

    # Environment
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()
