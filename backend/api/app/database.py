from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import get_settings

settings = get_settings()

# Create SQLAlchemy engine for main database
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,  # Verify connections before using
    echo=settings.ENVIRONMENT == "development"  # Log SQL in development
)

# Create SessionLocal class for main database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class for models
Base = declarative_base()


# Create SQLAlchemy engine for AI2 database
engine_ai2 = create_engine(
    settings.AI2_DATABASE_URL,
    pool_pre_ping=True,
    echo=settings.ENVIRONMENT == "development"
)

# Create SessionLocal class for AI2 database
SessionLocalAI2 = sessionmaker(autocommit=False, autoflush=False, bind=engine_ai2)

# Create Base class for AI2 models
BaseAI2 = declarative_base()


def get_db():
    """Dependency to get main database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_ai2_db():
    """Dependency to get AI2 database session"""
    db = SessionLocalAI2()
    try:
        yield db
    finally:
        db.close()
