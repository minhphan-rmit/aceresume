# -*- coding: utf-8 -*-
from __future__ import annotations

from pydantic import BaseModel, Field, EmailStr, validator
from datetime import datetime
from email_validator import validate_email
from typing_extensions import Annotated
from pymongo import ReturnDocument
from bson import ObjectId
from typing import Optional


class UserInfo(BaseModel):
    """
    Object to describe User Information
    """

    username: str = Field(..., description="Username of the user")
    password: str = Field(..., description="Password of the user")
    number: Optional[str] = Field(None, description="Phone number of the user")
    preference_field: Optional[str] = Field(None, description="Interest Field")
    level: Optional[str] = Field(None, description="Level of the user")
    email: EmailStr = Field(..., description="Email address of the user")
    created_at: datetime = Field(
        default_factory=datetime.now, description="Creation timestamp of the user"
    )
    is_activate: bool = Field(
        default=False, description="Check if the user account is activated"
    )
    verified_at: Optional[datetime] = Field(
        default=None, description="Verify account activated timestamp"
    )
    updated_at: Optional[datetime] = Field(
        default=None, description="Verify account activated timestamp"
    )

    def get_context_string(self, context: str):
        return f"{context}{self.password[-6:]}{self.updated_at.strftime('%m%d%Y%H%M%S')}".strip()

    @validator("number")
    def validate_number(cls, v):
        if v is None:
            return v
        elif not v.isdigit() or len(v) != 10:
            raise ValueError(
                "Invalid phone number format. It should be a 10-digit number."
            )
        return v

    @validator("email")
    def validate_email(cls, v):
        try:
            validate_email(v, allow_smtputf8=False)
        except Exception as e:
            raise ValueError(f"Invalid email address: {e}")
        return v

    @validator("username")
    def validate_username(cls, v):
        if any(char.isspace() or not char.isalnum() for char in v):
            raise ValueError(
                "Username should not contain spaces or special characters."
            )
        return v


class UserToken(BaseModel):
    user_id: Optional[str]  # Reference to the user
    access_key: Optional[str] = None
    refresh_key: Optional[str] = None
    created_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
