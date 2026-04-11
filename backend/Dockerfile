FROM python:3.12-slim

# Pull uv binary from the official image
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app

# Install dependencies first (separate layer for caching)
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

# Copy the rest of the source
COPY . .

EXPOSE 8000

# Seed demo data (idempotent) then start the server
CMD ["sh", "-c", "uv run python seed_demo.py && uv run uvicorn run_api:app --host 0.0.0.0 --port 8000"]
