"""database.py
DuckDB database management for the fashion story optimizer.
"""
import os
import duckdb
from pathlib import Path

DB_PATH = Path(os.getenv("DATABASE_PATH", "./data/optimizer.duckdb"))


def get_connection() -> duckdb.DuckDBPyConnection:
    """Return a connection to the optimizer database."""
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    return duckdb.connect(str(DB_PATH))


def init_db() -> None:
    """Create database tables if they don't exist."""
    with get_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                user_id       VARCHAR   PRIMARY KEY,
                name          VARCHAR   NOT NULL,
                boutique_name VARCHAR   NOT NULL,
                bio           VARCHAR,
                password_hash VARCHAR   NOT NULL,
                notifications BOOLEAN   NOT NULL DEFAULT true,
                dark_mode     BOOLEAN   NOT NULL DEFAULT false,
                stay_playful  BOOLEAN   NOT NULL DEFAULT true,
                created_at    TIMESTAMP NOT NULL DEFAULT current_timestamp
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS optimization_results (
                optimization_date TIMESTAMP NOT NULL,
                user_id           VARCHAR    NOT NULL,
                hour              INTEGER    NOT NULL,
                item_id           INTEGER    NOT NULL,
                slot              INTEGER    NOT NULL DEFAULT 1
            )
        """)
        # Migrate existing DBs that lack the slot column
        existing = {row[0] for row in conn.execute(
            "SELECT column_name FROM information_schema.columns WHERE table_name = 'optimization_results'"
        ).fetchall()}
        if "slot" not in existing:
            conn.execute("ALTER TABLE optimization_results ADD COLUMN slot INTEGER DEFAULT 1")
        conn.execute("""
            CREATE TABLE IF NOT EXISTS user_schedule (
                user_id     VARCHAR NOT NULL,
                day_of_week TINYINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
                hour        TINYINT NOT NULL CHECK (hour BETWEEN 0 AND 23),
                PRIMARY KEY (user_id, day_of_week, hour)
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS experimentation_parameters (
                user_id              VARCHAR   NOT NULL,
                optimization_date    TIMESTAMP NOT NULL,
                order_full_collection BOOLEAN  NOT NULL,
                repeat_items         BOOLEAN   NOT NULL,
                slots                INTEGER   NOT NULL CHECK (slots >= 1),
                optimization_goal    VARCHAR[] NOT NULL CHECK (len(optimization_goal) >= 1),
                -- valid values per element: 'revenue', 'xp', 'gems'
                PRIMARY KEY (user_id, optimization_date)
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS items (
                id         INTEGER PRIMARY KEY,
                collection VARCHAR NOT NULL,
                title      VARCHAR NOT NULL,
                cost       DOUBLE  NOT NULL,
                xp         INTEGER NOT NULL,
                units      INTEGER NOT NULL,
                revenue    DOUBLE  NOT NULL,
                duration   DOUBLE  NOT NULL,
                benefit        DOUBLE  NOT NULL,
                order_position INTEGER
            )
        """)
