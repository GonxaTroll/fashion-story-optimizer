"""optimizer.py
Router for triggering and retrieving optimization runs.
"""
from datetime import datetime, timezone
from pathlib import Path

import duckdb
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException, status

from src.api.dependencies import get_current_user_id, get_db
from src.api.schemas import (
    LatestResultItem, LatestResultsResponse,
    OptimizeRequest, OptimizeResponse, OptimizeResultItem,
)
from src.data.read_data import read_data
from src.models.milp_solver import FashionSolver

router = APIRouter(prefix="/optimize", tags=["optimize"])

N_DAYS = 7  # weekly scheduling horizon

# Map frontend goal labels to catalog column names
_GOAL_COLUMN: dict[str, str] = {
    "revenue": "revenue",
    "xp": "xp",
    "gems": "revenue",  # not yet supported — fall back to revenue
}


def _build_unavailable_times(
    conn: duckdb.DuckDBPyConnection, user_id: str, start_dow: int = 0
) -> list[int]:
    """Return flat hour indices (0-167) that are NOT in the user's schedule.

    start_dow: day-of-week of horizon day 0 (0=Mon … 6=Sun, matches Python weekday()).
    Horizon day `d` maps to day_of_week `(start_dow + d) % 7`.
    """
    rows = conn.execute(
        "SELECT day_of_week, hour FROM user_schedule WHERE user_id = ?",
        [user_id],
    ).fetchall()
    available = {(dow, hour) for dow, hour in rows}
    return [
        day * 24 + hour
        for day in range(N_DAYS)
        for hour in range(24)
        if ((start_dow + day) % 7, hour) not in available
    ]


def _load_data_for_goal(goal: str) -> pd.DataFrame:
    """Load catalog and set the 'benefit' column to the chosen goal metric."""
    col = _GOAL_COLUMN.get(goal.lower(), "revenue")
    data = read_data()
    data["benefit"] = data[col]
    return data


@router.post("", response_model=OptimizeResponse)
def run_optimization(
    body: OptimizeRequest,
    user_id: str = Depends(get_current_user_id),
    conn: duckdb.DuckDBPyConnection = Depends(get_db),
):
    optimization_date = datetime.now(timezone.utc)

    # 1 — Persist parameters
    conn.execute(
        """
        INSERT INTO experimentation_parameters
            (user_id, optimization_date, order_full_collection,
             repeat_items, slots, optimization_goal)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        [
            user_id,
            optimization_date,
            body.order_full_collection,
            body.repeat_items,
            body.slots,
            body.optimization_goal,
        ],
    )

    # 2 — Build unavailable times from the user's weekly schedule
    # weekday() returns 0=Mon … 6=Sun, matching day_of_week in user_schedule
    unavailable = _build_unavailable_times(conn, user_id, start_dow=optimization_date.weekday())

    # 3 — Load data with the correct goal metric
    primary_goal = body.optimization_goal[0] if body.optimization_goal else "revenue"
    data = _load_data_for_goal(primary_goal)

    # 4 — Run solver
    try:
        solver = FashionSolver(
            slots=body.slots,
            n_days_to_schedule=N_DAYS,
            unavailable_times=unavailable,
            data=data,
            repeat_items=body.repeat_items,
            max_copies=body.max_copies,
        )
        status_code = solver.solve()
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Solver error: {exc}",
        )

    if not solver.is_solved:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Solver could not find a feasible solution. Try adjusting your schedule or settings.",
        )

    result_df = solver.get_best_product_choice()

    # 5 — Persist results
    if not result_df.empty:
        rows = [
            (optimization_date, user_id, int(row["hour"]), int(row["id"]))
            for _, row in result_df.iterrows()
        ]
        conn.executemany(
            "INSERT INTO optimization_results (optimization_date, user_id, hour, item_id) VALUES (?, ?, ?, ?)",
            rows,
        )

    # 6 — Build response
    items: list[OptimizeResultItem] = []
    for _, row in result_df.iterrows():
        items.append(
            OptimizeResultItem(
                hour=int(row["hour"]),
                item_id=int(row["id"]),
                slot=int(row["slot"]),
                title=str(row.get("title", "")),
                collection=str(row.get("collection", "")),
                duration=float(row.get("duration", 0)),
                revenue=float(row.get("revenue", 0)),
                xp=int(row.get("xp", 0)),
                cost=float(row.get("cost", 0)),
            )
        )

    return OptimizeResponse(
        optimization_date=optimization_date.isoformat(),
        results=items,
    )


@router.get("/latest", response_model=LatestResultsResponse)
def get_latest_results(
    user_id: str = Depends(get_current_user_id),
    conn: duckdb.DuckDBPyConnection = Depends(get_db),
):
    """Return the most recent optimization run for this user."""
    row = conn.execute(
        "SELECT MAX(optimization_date) FROM optimization_results WHERE user_id = ?",
        [user_id],
    ).fetchone()

    if row is None or row[0] is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No results yet")

    latest_date = row[0]

    result_rows = conn.execute(
        """
        SELECT hour, item_id, slot
        FROM optimization_results
        WHERE user_id = ? AND optimization_date = ?
        ORDER BY hour
        """,
        [user_id, latest_date],
    ).fetchall()

    catalog = read_data().set_index("id").to_dict("index")

    items: list[LatestResultItem] = []
    for hour, item_id, slot in result_rows:
        info = catalog.get(item_id)
        if info is None:
            continue
        items.append(
            LatestResultItem(
                hour=int(hour),
                slot=int(slot),
                title=str(info["title"]),
                collection=str(info["collection"]),
                cost=float(info["cost"]),
                xp=int(info["xp"]),
                units=int(info["units"]),
                revenue=float(info["revenue"]),
                duration=float(info["duration"]),
                order_position=int(info["order"]) if info.get("order") is not None and str(info.get("order")).strip() not in ("", "nan") else None,
            )
        )

    return LatestResultsResponse(
        optimization_date=latest_date.isoformat() if hasattr(latest_date, "isoformat") else str(latest_date),
        results=items,
    )
