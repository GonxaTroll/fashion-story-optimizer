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
