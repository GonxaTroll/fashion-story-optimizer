"""app.py
FastAPI application factory.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.routers import auth
from src.db.database import init_db

app = FastAPI(
    title="FashStOpt API",
    description="Fashion Story Optimizer backend",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    init_db()


app.include_router(auth.router)


@app.get("/health")
def health():
    return {"status": "ok"}
