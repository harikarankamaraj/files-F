import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
from seed_data import seed_database
from routes import (
    games,
    recommend,
    favorites,
    history,
    preferences,
    creator
)

app = FastAPI(
    title="GameGenie AI API",
    description="AI-Powered Game Discovery & Creation Platform API",
    version="1.0.0"
)

# Configure CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup Event: Initialize database tables and seed sample games
@app.on_event("startup")
def startup_db_event():
    print("[Main] Creating database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

# Include API Routers
app.include_router(games.router)
app.include_router(recommend.router)
app.include_router(favorites.router)
app.include_router(history.router)
app.include_router(preferences.router)
app.include_router(creator.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": "GameGenie AI",
        "tagline": "Describe your game. Discover it. Create it.",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
