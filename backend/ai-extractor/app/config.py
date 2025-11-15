from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """AI Extractor settings loaded from environment variables"""

    # OpenAI Configuration
    OPENAI_API_KEY: str
    OPENAI_MODEL: str = "gpt-5"
    OPENAI_MAX_TOKENS: int = 4000
    OPENAI_TEMPERATURE: float = 0.1  # Low for consistency

    # Storage Path (must match vostra-api)
    STORAGE_PATH: str = "./storage/vostra-invoice-web/uploads"

    # Environment
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()
