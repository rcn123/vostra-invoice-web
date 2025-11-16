from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
import httpx
from app.config import get_settings
from app.database import engine, Base, get_db

settings = get_settings()

# Create FastAPI application
app = FastAPI(
    title="Vostra Invoice API",
    description="Backend API for AI-powered invoice processing",
    version="1.0.0"
)

# CORS middleware - allow frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://vostra.ai", "http://localhost:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables (in production, use Alembic migrations instead)
@app.on_event("startup")
async def startup_event():
    """Create database tables on startup (development only)"""
    if settings.ENVIRONMENT == "development":
        Base.metadata.create_all(bind=engine)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Vostra Invoice API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    """
    Health check endpoint with real DB and AI extractor connectivity checks

    Returns:
        - status: overall status (healthy/degraded/unhealthy)
        - database: DB connection status (connected/disconnected)
        - ai_extractor: AI service status (reachable/unreachable/not_configured)
    """
    health_status = {
        "status": "healthy",
        "database": "disconnected",
        "ai_extractor": "not_configured"
    }

    # Check database connectivity
    try:
        db.execute(text("SELECT 1"))
        health_status["database"] = "connected"
    except Exception as e:
        health_status["database"] = "disconnected"
        health_status["status"] = "unhealthy"

    # Check AI extractor connectivity
    if settings.AI_EXTRACTOR_URL:
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{settings.AI_EXTRACTOR_URL}/health")
                if response.status_code == 200:
                    health_status["ai_extractor"] = "reachable"
                else:
                    health_status["ai_extractor"] = "unreachable"
                    health_status["status"] = "degraded"
        except Exception:
            health_status["ai_extractor"] = "unreachable"
            health_status["status"] = "degraded"

    return health_status


@app.get("/api/health")
async def api_health_check(db: Session = Depends(get_db)):
    """Health check endpoint with /api prefix for ingress compatibility"""
    return await health_check(db)


# Import and include routers
from app.api.routes import invoices

app.include_router(invoices.router)
