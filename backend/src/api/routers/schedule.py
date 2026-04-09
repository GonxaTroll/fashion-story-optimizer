"""schedule.py
Router for reading and updating a user's weekly availability schedule.
"""
import duckdb
from fastapi import APIRouter, Depends, status

from src.api.dependencies import get_current_user_id, get_db
from src.api.schemas import ScheduleResponse, ScheduleUpdateRequest

router = APIRouter(prefix="/schedule", tags=["schedule"])


@router.get("", response_model=ScheduleResponse)
def get_schedule(
    user_id: str = Depends(get_current_user_id),
    conn: duckdb.DuckDBPyConnection = Depends(get_db),
):
    """Return the user's available slots as a 24×7 boolean grid."""
    rows = conn.execute(
        "SELECT day_of_week, hour FROM user_schedule WHERE user_id = ?",
        [user_id],
    ).fetchall()

    grid: list[list[bool]] = [[False] * 7 for _ in range(24)]
    for day, hour in rows:
        grid[hour][day] = True

    return ScheduleResponse(grid=grid)


@router.put("", status_code=status.HTTP_204_NO_CONTENT)
def update_schedule(
    body: ScheduleUpdateRequest,
    user_id: str = Depends(get_current_user_id),
    conn: duckdb.DuckDBPyConnection = Depends(get_db),
):
    """Replace the user's schedule with the provided 24×7 boolean grid."""
    conn.execute("DELETE FROM user_schedule WHERE user_id = ?", [user_id])

    available = [
        (user_id, day, hour)
        for hour, row in enumerate(body.grid)
        for day, is_available in enumerate(row)
        if is_available
    ]

    if available:
        conn.executemany(
            "INSERT INTO user_schedule (user_id, day_of_week, hour) VALUES (?, ?, ?)",
            available,
        )
