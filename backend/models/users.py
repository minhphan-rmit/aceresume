# -*- coding: utf-8 -*-
from __future__ import annotations

from pydantic import BaseModel, Field, EmailStr, validator
from datetime import datetime
from email_validator import validate_email
from typing_extensions import Annotated
from pymongo import ReturnDocument
from bson import ObjectId
import uuid
from typing import Optional

class UserInfo(BaseModel):
    """
    Object to describe User Information
    """

    username: str = Field(..., description="Username of the user")
    full_name: str = Field(..., description="Full name of the user")
    password: str = Field(..., description="Password of the user")
    number: Optional[str] = Field(None, description="Phone number of the user")
    email: EmailStr = Field(..., description="Email address of the user")
    address: Optional[str] = Field(None, description="Address of the user") 
    created_at: datetime = Field(default_factory=datetime.now, description="Creation timestamp of the user")
    key: str =Field(default_factory=lambda: uuid.uuid1().hex, description= "Key for login")
    @validator("number")
    def validate_number(cls, v):
        if v is None:
            return v
        elif not v.isdigit() or len(v) != 10:
            raise ValueError("Invalid phone number format. It should be a 10-digit number.")
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
            raise ValueError("Username should not contain spaces or special characters.")
        return v