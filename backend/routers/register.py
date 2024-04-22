# -*- coding: utf-8 -*-
import jwt
import os
import uuid

from fastapi import APIRouter, Form, BackgroundTasks
from fastapi.responses import JSONResponse
from models.users import UserInfo
from constant import Message, Constants
import bcrypt
from models.email import EmailSchema, send_email
from datetime import datetime, timedelta
from jinja2 import Environment, FileSystemLoader

router = APIRouter(prefix="/api/aceresume", tags=["User Register"])


def generate_token(
    user_id: str, email: str, is_activated: bool, expiry_hours: int = 24
):
    secret_key = os.environ.get(
        "JWT_SECRET", "649fb93ef34e4fdf4187709c84d643dd61ce730d91856418fdcf563f895ea40f"
    )
    unique_id = str(uuid.uuid4())
    payload = {
        "user_id": user_id,
        "email": email,
        "is_activated": is_activated,
        "unique_id": unique_id,
        "exp": datetime.utcnow() + timedelta(hours=expiry_hours),
    }
    token = jwt.encode(payload, secret_key, algorithm="HS256")

    # Store the token in the USERS database
    Constants.USERS.update_one({"_id": user_id}, {"$set": {"token": token}})

    return token


@router.post("/register", responses={409: {"model": Message}, 422: {"model": Message}})
def register_user(
    background_tasks: BackgroundTasks,  # this for email send
    user_name: str = Form(..., description="Username of the user"),
    password: str = Form(..., description="Password of the user"),
    number: str = Form(None, description="Phone number of the user"),
    email: str = Form(..., description="Email address of the user"),
):
    try:
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

        user_info = UserInfo(
            username=user_name,
            password=hashed_password,
            number=number,
            email=email,
            is_activate=False,
        )
        user_info_dict = user_info.dict()
        Constants.USERS.insert_one(user_info_dict)

        token = generate_token(str(user_info_dict["_id"]), email, is_activated=False)

        subject = "Activation Link for AceResume Application"
        body = f"""
        <html>
<head></head>
<body>
    <h1 style="color:#312e81;">Welcome to AceResume!</h1>
    <p>Hello <strong style="color:#312e81;">{user_name}</strong>,</p>
    <p>We're excited to have you join AceResume, your ultimate destination for crafting the perfect resume and landing your dream job.</p>
    <p>To get started, simply click the button below to activate your account:</p>
    <div style="text-align:center;">
        <a href="http://localhost:8081/auth/account-verify?token={token}&email={email}" style="background-color: #312e81; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Activate Account</a>
    </div>
    <p>If you have any questions or need assistance, feel free to reach out to our support team at support@aceresume.com.</p>
    <p>Thank you for choosing AceResume!</p>
</body>
</html>
        """
        data = EmailSchema(to=email, subject=subject, body=body).dict()
        background_tasks.add_task(send_email, data["to"], data["subject"], data["body"])

    except ValueError as e:
        # Handle Pydantic validation errors
        return JSONResponse(
            status_code=422, content={"message": str(e)}
        )  # error for email and number

    assert (
        Constants.USERS.find_one({"username": user_name})["username"] == user_name
    )  # test case
    assert len(list(Constants.USERS.find({"username": user_name}))) == 1  # test case

    return JSONResponse(
        content={
            "user_name": user_name,
            "password": password,
            "number": number,
            "email": email,
            "token": token,
        }
    )
