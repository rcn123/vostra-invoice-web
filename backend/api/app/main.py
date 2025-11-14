from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.database import engine, Base

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
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "database": "connected",  # TODO: Add actual DB health check
        "ai_extractor": "not_configured"  # TODO: Add AI extractor health check
    }


# Import and include routers (will be added in next steps)
# from app.api.routes import invoices, health
# app.include_router(invoices.router, prefix="/api/invoices", tags=["invoices"])
# app.include_router(health.router, prefix="/api", tags=["health"])
