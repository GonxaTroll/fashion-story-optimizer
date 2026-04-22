"""auth.py
Authentication router: sign-up, sign-in, and current-user endpoints.
"""
import duckdb
from fastapi import APIRouter, Depends, HTTPException, status

from src.api.dependencies import get_current_user_id, get_db
from src.api.schemas import PasswordChangeRequest, ProfileUpdateRequest, SignInRequest, SignUpRequest, TokenResponse, UserResponse
from src.api.security import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(body: SignUpRequest, conn: duckdb.DuckDBPyConnection = Depends(get_db)):
    existing = conn.execute(
        "SELECT user_id FROM users WHERE user_id = ?", [body.email]
    ).fetchone()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    user_id = body.email
    password_hash = hash_password(body.password)
    conn.execute(
        "INSERT INTO users (user_id, name, boutique_name, password_hash, item_slots) VALUES (?, ?, ?, ?, ?)",
        [user_id, body.name, body.boutique_name, password_hash, body.item_slots],
    )
    return TokenResponse(access_token=create_access_token(user_id))


@router.post("/login", response_model=TokenResponse)
def login(body: SignInRequest, conn: duckdb.DuckDBPyConnection = Depends(get_db)):
    row = conn.execute(
        "SELECT user_id, password_hash FROM users WHERE user_id = ?", [body.email]
    ).fetchone()

    if row is None or not verify_password(body.password, row[1]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return TokenResponse(access_token=create_access_token(row[0]))


@router.get("/me", response_model=UserResponse)
def me(
    user_id: str = Depends(get_current_user_id),
    conn: duckdb.DuckDBPyConnection = Depends(get_db),
):
    row = conn.execute(
        """
        SELECT user_id, name, boutique_name, bio,
               notifications, dark_mode, stay_playful, item_slots
        FROM users WHERE user_id = ?
        """,
        [user_id],
    ).fetchone()

    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return UserResponse(
        user_id=row[0],
        name=row[1],
        boutique_name=row[2],
        bio=row[3],
        notifications=row[4],
        dark_mode=row[5],
        stay_playful=row[6],
        item_slots=row[7],
    )


@router.post("/password", status_code=status.HTTP_204_NO_CONTENT)
def change_password(
    body: PasswordChangeRequest,
    user_id: str = Depends(get_current_user_id),
    conn: duckdb.DuckDBPyConnection = Depends(get_db),
):
    row = conn.execute(
        "SELECT password_hash FROM users WHERE user_id = ?", [user_id]
    ).fetchone()

    if row is None or not verify_password(body.current_password, row[0]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )

    conn.execute(
        "UPDATE users SET password_hash = ? WHERE user_id = ?",
        [hash_password(body.new_password), user_id],
    )


@router.patch("/me", response_model=UserResponse)
def update_me(
    body: ProfileUpdateRequest,
    user_id: str = Depends(get_current_user_id),
    conn: duckdb.DuckDBPyConnection = Depends(get_db),
):
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if updates:
        set_clause = ", ".join(f"{k} = ?" for k in updates)
        conn.execute(
            f"UPDATE users SET {set_clause} WHERE user_id = ?",
            [*updates.values(), user_id],
        )

    row = conn.execute(
        """
        SELECT user_id, name, boutique_name, bio,
               notifications, dark_mode, stay_playful, item_slots
        FROM users WHERE user_id = ?
        """,
        [user_id],
    ).fetchone()

    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return UserResponse(
        user_id=row[0],
        name=row[1],
        boutique_name=row[2],
        bio=row[3],
        notifications=row[4],
        dark_mode=row[5],
        stay_playful=row[6],
        item_slots=row[7],
    )
