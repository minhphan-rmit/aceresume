# -*- coding: utf-8 -*-
from fastapi import APIRouter, HTTPException, Form, BackgroundTasks, Path
from fastapi.responses import JSONResponse
from models.users import UserInfo
from constant import Message, Constants
from bson import ObjectId
import bson.binary
import bcrypt
import uuid
from fastapi.encoders import jsonable_encoder
from models.email import EmailSchema, send_email
import jwt
import os
import uuid
from datetime import datetime, timedelta


router = APIRouter(prefix="/api/v1", tags=["User Profile"])


def generate_token(
    user_id: str, expiry_hours: int = 24, one_time_use: bool = True
) -> str:
    secret_key = os.environ.get(
        "JWT_SECRET", "649fb93ef34e4fdf4187709c84d643dd61ce730d91856418fdcf563f895ea40f"
    )
    unique_id = str(uuid.uuid4())
    payload = {
        "user_id": user_id,
        "unique_id": unique_id,
        "exp": datetime.utcnow() + timedelta(hours=expiry_hours),
    }
    if one_time_use:
        payload["used"] = False  # Add a flag indicating whether the token has been used

    return jwt.encode(payload, secret_key, algorithm="HS256")


def verify_token(token: str):
    try:
        secret_key = os.environ.get(
            "JWT_SECRET",
            "649fb93ef34e4fdf4187709c84d643dd61ce730d91856418fdcf563f895ea40f",
        )
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        user_id = payload.get("user_id")

        # Check if the token has been used
        if payload.get("used"):
            return None  # Token has already been used

        return user_id
    except jwt.ExpiredSignatureError:
        # Token has expired
        return None
    except jwt.DecodeError:
        # Token is invalid
        return None


@router.get(
    "/profile/{id}",
    responses={
        404: {"model": Message},
        422: {"model": Message},
        401: {"model": Message},
    },
)
def profile(id: str):
    """
    Return the user data information
    """
    if len(id) == 24:
        account = Constants.USERS.find_one({"_id": ObjectId(id)})
        if account:
            try:
                # Convert ObjectId to string
                account["_id"] = str(account["_id"])
                return account
            except ValueError as e:
                return JSONResponse(status_code=402, content={"message": str(e)})
        else:
            return JSONResponse(status_code=404, content={"message": "User not found"})
    else:
        return JSONResponse(status_code=401, content={"message": "Unauthorized"})


@router.put("/profile_update/{id}")
def update_profile(
    id: str,
    username: str = Form(None, description="Name of the user"),
    email: str = Form(None, description="Email of the user"),
    number: str = Form(None, description="Phone number of the user"),
    preference_field: str = Form(None, description="Interest Field"),
    level: str = Form(None, description="Level of the user"),
    password: str = Form(None, description="Password of the user"),
    password_verify: str = Form(...),
):
    """
    Send the update data, it can be password, number, address
    """
    update = {}

    account = Constants.USERS.find_one({"_id": ObjectId(id)})
    if account and bcrypt.checkpw(
        password_verify.encode("utf-8"), account["password"].encode("utf-8")
    ):
        try:
            if number is not None:
                update["number"] = number
            if username is not None:
                update["username"] = username
            if email is not None:
                update["email"] = email
            if preference_field is not None:
                update["preference_field"] = preference_field
            if level is not None:
                update["level"] = level
            if password is not None:
                update["password"] = password

            newAccount = Constants.USERS.find_one_and_update(
                {"_id": ObjectId(id)},
                {"$set": update},
                return_document=True,  # Return the updated document
            )

            # Convert ObjectId to string before returning the JSON response
            newAccount["_id"] = str(account["_id"])

            return JSONResponse(content=jsonable_encoder(newAccount))
        except ValueError as e:
            return JSONResponse(status_code=422, content={"message": str(e)})
    else:
        return JSONResponse(
            status_code=404,
            content={"message": "User not found or password is incorrect"},
        )


@router.post("/forgot_password/{id}")
def forgot_password(
    id: str,
    background_tasks: BackgroundTasks,
):
    """
    Send a reset password link to the user's email, and update the password in the database.
    """
    account = Constants.USERS.find_one({"_id": ObjectId(id)})

    if account:
        email = account.get("email")
        if email:
            # Generate token
            token = generate_token(str(account["_id"]))

            # Send email with reset password link containing the token
            subject = "Reset Password"
            body = f"Please click on the following link to reset password: http://localhost:3000/resetpass?token={token}"
            data = EmailSchema(to=email, subject=subject, body=body).dict()
            background_tasks.add_task(
                send_email, data["to"], data["subject"], data["body"]
            )

            # Return success message along with token
            return {
                "message": "Reset password email sent successfully",
                "token": token,
                "email": email,
            }
        else:
            raise HTTPException(status_code=400, detail="Email not found for the user")
    else:
        raise HTTPException(status_code=404, detail="User not found")


@router.put("/reset_password/{token}")
def reset_password(
    token: str = Path(..., title="The token received in the reset password email"),
    new_password: str = Form(None, description="New Password"),
    confirm_password: str = Form(None, description="Confirm New Password"),
):
    # Verify token (You need to implement your token verification logic here)
    user_id = verify_token(
        token
    )  # This function should verify the token and return the user ID
    if not user_id:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    # Check if passwords match
    if new_password != confirm_password:
        raise HTTPException(status_code=400, detail="New passwords do not match")

    new_hashed_password = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt())

    # Update password in the database (You need to implement your database update logic here)
    Constants.USERS.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"password": new_hashed_password.decode("utf-8")}},
    )

    return {"message": "Password reset successfully"}
