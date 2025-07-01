from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager

from .database import engine
from .models import Base
from .routes import subscriptions, testimonials, meal_plans, auth, dashboard

# Create database tables
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown
    pass

# Create FastAPI app
app = FastAPI(
    title="SEA Catering API",
    description="Backend API for SEA Catering subscription and meal plan management with authentication",
    version="2.0.0",
    lifespan=lifespan
)

# Add security middleware
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["localhost", "127.0.0.1", "*.yourdomain.com"]
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(subscriptions.router)
app.include_router(testimonials.router)
app.include_router(meal_plans.router)
app.include_router(dashboard.router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to SEA Catering API v2.0",
        "version": "2.0.0",
        "features": [
            "User Authentication & Authorization",
            "Secure Subscription Management",
            "Testimonial System with Approval",
            "Meal Plan Management",
            "Input Validation & Sanitization",
            "XSS & SQL Injection Protection"
        ],
        "docs": "/docs",
        "endpoints": {
            "authentication": "/api/v1/auth",
            "subscriptions": "/api/v1/subscriptions",
            "testimonials": "/api/v1/testimonials",
            "meal_plans": "/api/v1/meal-plans"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "SEA Catering API is running securely"}

@app.get("/security")
async def security_info():
    return {
        "security_features": {
            "authentication": "JWT-based authentication",
            "authorization": "Role-based access control",
            "password_hashing": "bcrypt with salt",
            "input_validation": "Pydantic validation",
            "input_sanitization": "HTML escaping and pattern matching",
            "sql_injection_protection": "Parameterized queries with SQLAlchemy",
            "xss_protection": "Input sanitization and output encoding",
            "csrf_protection": "JWT tokens prevent CSRF",
            "cors": "Configured CORS middleware",
            "trusted_hosts": "Host validation middleware"
        }
    } 