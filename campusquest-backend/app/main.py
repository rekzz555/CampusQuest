from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import routes, admin_routes
from .database import engine
from . import models

# ✅ Create DB tables
models.Base.metadata.create_all(bind=engine)

# ✅ FastAPI app with metadata
app = FastAPI(
    title="CampusQuest API",
    description="College and Career Guidance System",
    version="1.0.0"
)

# ✅ Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with ["http://localhost:3000"] in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Register routers
app.include_router(routes.router, tags=["Users"])
app.include_router(admin_routes.router, tags=["Admin"])

# ✅ Health check
@app.get("/ping")
def ping():
    return {"message": "pong"}
