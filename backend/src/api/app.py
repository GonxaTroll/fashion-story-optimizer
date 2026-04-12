"""app.py
FastAPI application factory.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.routers import auth, optimizer, schedule
from src.db.database import init_db

app = FastAPI(
    title="FashStOpt API",
    description="Fashion Story Optimizer backend",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://localhost:\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    init_db()


app.include_router(auth.router)
app.include_router(schedule.router)
app.include_router(optimizer.router)


@app.get("/health")
def health():
    return {"status": "ok"}
