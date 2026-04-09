"""seed_demo.py
Creates the demo user if it doesn't already exist.

Usage:
    uv run python seed_demo.py
"""
from src.db.database import get_connection, init_db
from src.api.security import hash_password

DEMO_EMAIL = "admin@fashstopt.com"
DEMO_PASSWORD = "admin1234"
DEMO_NAME = "Admin"
DEMO_BOUTIQUE = "FashStOpt HQ"


def seed():
    init_db()
    with get_connection() as conn:
        existing = conn.execute(
            "SELECT user_id FROM users WHERE user_id = ?", [DEMO_EMAIL]
        ).fetchone()

        if existing:
            print(f"Demo user already exists: {DEMO_EMAIL}")
            return

        conn.execute(
            "INSERT INTO users (user_id, name, boutique_name, password_hash) VALUES (?, ?, ?, ?)",
            [DEMO_EMAIL, DEMO_NAME, DEMO_BOUTIQUE, hash_password(DEMO_PASSWORD)],
        )
        print(f"Demo user created: {DEMO_EMAIL} / {DEMO_PASSWORD}")


if __name__ == "__main__":
    seed()
