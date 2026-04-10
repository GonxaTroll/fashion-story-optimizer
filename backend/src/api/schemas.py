"""schemas.py
Pydantic models for request/response validation.
"""
from pydantic import BaseModel, EmailStr, Field


class SignUpRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    name: str = Field(min_length=1)
    boutique_name: str = Field(min_length=1)


class SignInRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    user_id: str
    name: str
    boutique_name: str
    bio: str | None
    notifications: bool
    dark_mode: bool
    stay_playful: bool


class ScheduleUpdateRequest(BaseModel):
    grid: list[list[bool]]  # grid[hour][day], hour 0-23, day 0=Mon … 6=Sun


class ScheduleResponse(BaseModel):
    grid: list[list[bool]]  # same shape as ScheduleUpdateRequest.grid


class OptimizeRequest(BaseModel):
    order_full_collection: bool
    repeat_items: bool
    max_copies: int | None = Field(default=None, ge=1)  # None = infinite
    slots: int = Field(ge=1)
    optimization_goal: list[str] = Field(min_length=1)
    max_time_minutes: int | None = Field(default=None, ge=1)  # None = no limit


class OptimizeResultItem(BaseModel):
    hour: int
    item_id: int
    slot: int
    title: str
    collection: str
    duration: float
    revenue: float
    xp: int
    cost: float


class OptimizeResponse(BaseModel):
    optimization_date: str
    results: list[OptimizeResultItem]


class LatestResultItem(BaseModel):
    hour: int
    slot: int
    title: str
    collection: str
    cost: float
    xp: int
    units: int
    revenue: float
    duration: float
    order_position: int | None = None


class LatestResultsResponse(BaseModel):
    optimization_date: str  # ISO string
    results: list[LatestResultItem]
