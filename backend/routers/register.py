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
<html> <div bgcolor="#ffffff" leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style=" background-color: #ffffff; margin: 0; padding: 0; font-family: Helvetica, Arial, 'Lucida Grande', sans-serif; height: 100% !important; width: 100% !important; " > <center role="article" aria-roledescription="email" aria-label="email name" lang="en" dir="ltr" style="background-color: #ffffff; width: 100%; table-layout: fixed" > <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" bgcolor="#ffffff" style=" max-width: 100% !important; width: 100% !important; min-width: 100% !important; " > <tr> <td align="center" valign="top" id="bodyCell" style="padding: 0"> <table border="0" cellpadding="0" cellspacing="0" width="100%" id="emailBody" bgcolor="#ffffff" style=" max-width: 100% !important; width: 100% !important; min-width: 100% !important; " > <tr> <td align="center" valign="top" style="padding-top: 20px; padding-bottom: 20px" > <table border="0" cellpadding="0" cellspacing="0" width="700" id="emailHeader" style=" max-width: 700px !important; width: 100% !important; margin: auto; color: #7a7a7a; font-weight: normal; " > <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" width="100%" > <tr> <td align="center" valign="top" style="padding-right: 10px; padding-left: 10px" ></td> </tr> </table> </td> </tr> </table> </td> </tr> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" width="700" id="emailBody" bgcolor="#ffffff" style=" max-width: 700px !important; width: 100% !important; margin: auto; color: #7a7a7a; font-weight: normal; " > <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" width="100%" style=" color: #7a7a7a; font-weight: normal; font-family: Helvetica, Arial, sans-serif; font-size: 16px; line-height: 125%; text-align: Left; " > <tr> <td align="center" valign="top" style="padding-top: 30px; padding-bottom: 20px" > <h1 style=" color: #333333; font-family: Helvetica, Arial, sans-serif; font-size: 26px; line-height: 150%; text-align: Left; font-weight: bold; " > Welcome to aceResume </h1> </td> </tr> <tr> <td align="center" valign="top" style=" padding-right: 40px; padding-left: 40px; padding-bottom: 20px; " > <p style=" font-size: 16px; line-height: 150%; color: #666666; " > Hi <strong style="color: #312e81" >{user_name}</strong >! </p> <p style=" font-size: 16px; line-height: 150%; color: #666666; " > Thank you for registering with aceResume. To activate your account, please click the button below: </p> </td> </tr> <tr> <td align="center" valign="top" style="padding-bottom: 30px" > <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" valign="top" style=" border-radius: 5px; background-color: #6366f1; " > <a href="http://localhost:8081/auth/account-verify?token={token}&email={email}" target="_blank" style=" font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; text-decoration: none; padding-top: 15px; padding-bottom: 15px; padding-left: 25px; padding-right: 25px; border-radius: 5px; border: 1px solid #6366f1; display: inline-block; " >Activate Your Account</a > </td> </tr> </table> </td> </tr> <tr> <td align="center" valign="top" style="padding-right: 40px; padding-left: 40px" > <p style=" font-size: 16px; line-height: 150%; color: #666666; " > If you have any questions, feel free to <a href="mailto:info@aceresume.com" target="_blank" style=" color: #6366f1; text-decoration: underline; " >contact us</a >. We're here to help! </p> </td> </tr> </table> </td> </tr> </table> </td> </tr> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" width="700" id="emailFooter" bgcolor="#ffffff" style=" max-width: 700px !important; width: 100% !important; margin: auto; color: #7a7a7a; font-weight: normal; " > <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" width="100%" > <tr> <td align="center" valign="top" style="padding-right: 10px; padding-left: 10px" > <p style="font-size: 12px; color: #999999"> This email was sent to <a href="mailto:{{recipient}}" target="_blank" style=" color: #999999; text-decoration: underline; " >{{recipient}}</a >. You are receiving this email because you signed up for an account with aceResume. If you believe you received this email in error, please ignore it. </p> <p style="font-size: 12px; color: #999999"> © 2024 aceResume. All rights reserved. </p> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </center> </div></html>        """
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
