"""run_api.py
Entry point for the FastAPI development server.

Usage:
    uv run uvicorn run_api:app --reload --port 8000
or:
    uv run python run_api.py
"""
import uvicorn
from src.api.app import app  # noqa: F401  (re-exported for uvicorn)

if __name__ == "__main__":
    uvicorn.run("run_api:app", host="0.0.0.0", port=8000, reload=True)
