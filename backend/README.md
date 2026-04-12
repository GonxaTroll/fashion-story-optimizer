# FashStOpt — Backend

FastAPI backend for the Fashion Story Optimizer.

## Stack

- **FastAPI** — REST API
- **DuckDB** — embedded database (users, schedules, optimization results)
- **PuLP / SCIP** — MILP solver for boutique schedule optimization
- **bcrypt + JWT** — authentication

## Structure

```
src/
  api/
    routers/
      auth.py       # /auth — signup, login, profile
      optimizer.py  # /optimize — run solver, fetch latest results
      schedule.py   # /schedule — read/write weekly availability
  db/               # DuckDB connection and migrations
  models/           # table definitions
  data/             # database file (gitignored)
```

## Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/auth/signup` | Create account |
| POST | `/auth/login` | Get JWT token |
| GET | `/auth/me` | Current user profile |
| PATCH | `/auth/me` | Update profile |
| POST | `/auth/password` | Change password |
| GET | `/schedule` | Get weekly availability |
| POST | `/schedule` | Save weekly availability |
| POST | `/optimize/run` | Run MILP optimizer |
| GET | `/optimize/latest` | Fetch latest results |

## Running locally

```bash
docker compose up backend --build
```

API at `http://localhost:8000` — interactive docs at `http://localhost:8000/docs`.
