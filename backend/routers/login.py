# -*- coding: utf-8 -*-
from fastapi import APIRouter, Form, HTTPException
from fastapi.responses import JSONResponse
from constant import Message, Constants
from models.users import UserToken
from pymongo import MongoClient
import bcrypt
from datetime import datetime, timedelta
from utils.token import unique_string

router = APIRouter(prefix="/api/aceresume", tags=["User Login"])


@router.post("/login", responses={401: {"model": Message}, 404: {"model": Message}})
def login(
    email: str = Form(..., description="Username of the user"),
    password: str = Form(..., description="Password of the user"),
):
    # Find the user account in the database
    account = Constants.USERS.find_one({"email": email})

    if account:
        # Check if the account is verified
        if not account.get("verified_at"):
            return JSONResponse(
                status_code=401,
                content={
                    "message": "Your account is not verified. Please check your email inbox to verify your account."
                },
            )

        # Check if the account is activated
        if not account.get("is_activate", False):
            return JSONResponse(
                status_code=401,
                content={
                    "message": "Your account has been deactivated. Please contact support."
                },
            )

        # Compare the entered password with the stored hashed password
        if bcrypt.checkpw(
            password.encode("utf-8"), account["password"].encode("utf-8")
        ):
            access_key = unique_string(80)
            refresh_key = unique_string(100)

            user_token = UserToken(
                user_id=str(account["_id"]),
                access_key=access_key,
                refresh_key=refresh_key,
                created_at=datetime.utcnow(),
                expires_at=datetime.utcnow()
                + timedelta(hours=24),  # Token expiration time
            )
            Constants.USER_TOKENS.insert_one(user_token.dict())

            return JSONResponse(
                content={"email": email, "user_id": str(account["_id"])}
            )
        else:
            return JSONResponse(
                status_code=401, content={"message": "Password is incorrect."}
            )
    else:
        return JSONResponse(
            status_code=404, content={"message": "User does not exist."}
        )
