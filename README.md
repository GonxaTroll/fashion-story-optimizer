# FashStOpt — Fashion Story Optimizer

A web app that helps players of [Fashion Story](https://apps.apple.com/co/app/fashion-story/id420590864) (by Storm8) maximize their in-game revenue, XP, and gems through mixed-integer linear programming (MILP). Instead of guessing which clothes to stock and when, FashStOpt finds the mathematically optimal boutique schedule based on your real availability.

> Not affiliated with Storm8 Studios.

---

## Demo

<video src="https://github.com/user-attachments/assets/f095642f-824d-4744-81f8-f0b1b8ec43b9" controls width="100%"></video>

---

## What it does

Fashion Story players must decide which clothing items to place in their boutique across multiple daily time slots. The wrong choices leave coins and XP on the table. FashStOpt solves this by:

- **Scheduling** — you mark the hours you can actually open the game each day of the week
- **Optimizing** — a MILP solver assigns the best items to your available slots, maximizing revenue, XP, or gems (or a combination)
- **Results** — a clear schedule tells you exactly which item goes in which slot at which hour; export it to CSV to follow along while you play

### Tech stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript (Vite), Tailwind CSS 4, Framer Motion |
| Backend | FastAPI (Python), DuckDB, SCIP solver |
| Auth | JWT (bcrypt passwords) |
| Infra | Docker + Docker Compose |

---

## Setup

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose installed
- Git

### 1. Clone the repo

```bash
git clone https://github.com/GonxaTroll/fashion-story-optimizer.git
cd fashion-story-optimizer
```

### 2. Create environment files

**`backend/.env`**
```env
DATABASE_PATH=/app/data/optimizer.duckdb
```

**`frontend/.env`**
```env
VITE_API_URL=/api
BACKEND_URL=http://backend:8000
```

### 3. Start the app

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API docs | http://localhost:8000/docs |

### 4. Create an account

Open http://localhost:5173, click **Create an account**, and sign up. A demo account (`admin@fashstopt.com` / `admin1234`) is seeded on first run.

---

## Usage

1. **Schedule** — go to the Schedule page and check every hour you are available to play
2. **Optimizer** — choose your goals (Revenue, XP, Gems), set the number of simultaneous boutique slots, and hit **Run Optimizer**
3. **Results** — follow the generated schedule in the game; export to CSV for easy reference on your phone

---

## Stopping the app

```bash
docker compose down
```

To also remove the database volume (resets all data):

```bash
docker compose down -v
```
