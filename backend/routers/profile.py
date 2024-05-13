# -*- coding: utf-8 -*-
from fastapi import APIRouter, HTTPException, Form, BackgroundTasks, Path
from fastapi.responses import JSONResponse
from models.users import UserInfo
from constant import Message, Constants
from bson import ObjectId
import bson.binary
import bcrypt
from fastapi.encoders import jsonable_encoder
from models.email import EmailSchema, send_email
import jwt
import random
import string
from datetime import datetime, timedelta
from typing import List


router = APIRouter(prefix="/api/aceresume", tags=["User Profile"])


def generate_otp(length=6):
    otp = "".join(random.choices(string.digits, k=length))
    return otp


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
    preference_field: List[str] = Form(None, description="Interest Field"),
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
                preference_field = [item for item in preference_field if item]
                update["preference_field"] = preference_field
            if level is not None:
                update["level"] = level
            if password is not None:
                hashed_password = bcrypt.hashpw(
                    password.encode("utf-8"), bcrypt.gensalt()
                )
                update["password"] = hashed_password.decode("utf-8")

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
    Send a one-time password (OTP) to the user's email or phone for password reset.
    """
    account = Constants.USERS.find_one({"_id": ObjectId(id)})

    if account:
        email = account.get("email")
        if email:
            # Generate OTP
            otp = generate_otp()
            otp_expiry_time = datetime.now() + timedelta(minutes=5)

            Constants.USERS.update_one(
                {"_id": ObjectId(id)},
                {
                    "$set": {
                        "otp_code": otp,
                        "otp_expiry_time": otp_expiry_time,
                        "time_used": 0,
                    }
                },
            )
            # Send OTP via email or SMS
            subject = "Reset Password OTP"
            body = f"""
                <html>
                <div bgcolor="#ffffff" leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style=" background-color: #ffffff; margin: 0; padding: 0; font-family: Helvetica, Arial, 'Lucida Grande', sans-serif; height: 100% !important; width: 100% !important; " >
                    <center role="article" aria-roledescription="email" aria-label="email name" lang="en" dir="ltr" style="background-color: #ffffff; width: 100%; table-layout: fixed;">
                        <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" bgcolor="#ffffff" style="max-width: 100% !important; width: 100% !important; min-width: 100% !important;">
                            <tr>
                                <td align="center" valign="top" id="bodyCell" style="padding: 0;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" id="emailBody" bgcolor="#ffffff" style="max-width: 100% !important; width: 100% !important; min-width: 100% !important;">
                                        <tr>
                                            <td align="center" valign="top" style="padding-top: 20px; padding-bottom: 20px;">
                                                <table border="0" cellpadding="0" cellspacing="0" width="700" id="emailHeader" style="max-width: 700px !important; width: 100% !important; margin: auto; color: #7a7a7a; font-weight: normal;">
                                                    <tr>
                                                        <td align="center" valign="top">
                                                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                                <tr>
                                                                    <td align="center" valign="top" style="padding-right: 10px; padding-left: 10px;"></td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" valign="top">
                                                <table border="0" cellpadding="0" cellspacing="0" width="700" id="emailBody" bgcolor="#ffffff" style="max-width: 700px !important; width: 100% !important; margin: auto; color: #7a7a7a; font-weight: normal;">
                                                    <tr>
                                                        <td align="center" valign="top">
                                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="color: #7a7a7a; font-weight: normal; font-family: Helvetica, Arial, sans-serif; font-size: 16px; line-height: 125%; text-align: left;">
                                                                <tr>
                                                                    <td align="center" valign="top" style="padding-top: 30px; padding-bottom: 20px;">
                                                                        <h1 style="color: #333333; font-family: Helvetica, Arial, sans-serif; font-size: 26px; line-height: 150%; text-align: left; font-weight: bold;">Reset Your Password</h1>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="center" valign="top" style="padding-right: 40px; padding-left: 40px; padding-bottom: 20px;">
                                                                        <p style="font-size: 16px; line-height: 150%; color: #666666;">Hi <strong style="color: #312e81;">{account["username"]}</strong>!</p>
                                                                        <p style="font-size: 16px; line-height: 150%; color: #666666;">You have requested to reset your password. Please use the following OTP code to proceed:</p>
                                                                        <p style="font-size: 24px; line-height: 150%; color: #333333; font-weight: bold;">{otp}</p>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" valign="top">
                                                <table border="0" cellpadding="0" cellspacing="0" width="700" id="emailFooter" bgcolor="#ffffff" style="max-width: 700px !important; width: 100% !important; margin: auto; color: #7a7a7a; font-weight: normal;">
                                                    <tr>
                                                        <td align="center" valign="top">
                                                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                                <tr>
                                                                    <td align="center" valign="top" style="padding-right: 10px; padding-left: 10px;">
                                                                        <p style="font-size: 12px; color: #999999;">This email was sent to <a href="mailto:{email}" target="_blank" style="color: #999999; text-decoration: underline;">{email}</a>. You are receiving this email because you requested a password reset. If you did not request this, please ignore it.</p>
                                                                        <p style="font-size: 12px; color: #999999;">© 2024 aceResume. All rights reserved.</p>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </center>
                </div>
                </html>     """
            data = EmailSchema(to=email, subject=subject, body=body).dict()
            background_tasks.add_task(
                send_email, data["to"], data["subject"], data["body"]
            )

            # Return success message
            return {
                "message": "Reset password OTP sent successfully",
                "otp_code": otp,
            }
        else:
            raise HTTPException(status_code=400, detail="Email not found for the user")
    else:
        raise HTTPException(status_code=404, detail="User not found")


@router.put("/reset_password/{id}")
def reset_password(
    id: str = Path(..., title="The ID of the user"),
    otp: str = Form(..., description="The OTP received for password reset"),
    new_password: str = Form(None, description="New Password"),
    confirm_password: str = Form(None, description="Confirm New Password"),
):
    # Retrieve user information based on ID
    account = Constants.USERS.find_one({"_id": ObjectId(id)})

    # Verify OTP and expiry time
    if account and account.get("otp_code") == otp:
        time_used = account.get("time_used")
        otp_expiry_time = account.get("otp_expiry_time")
        current_time = datetime.now()
        if time_used == 0:
            if current_time < otp_expiry_time:
                # Check if passwords match
                if new_password != confirm_password:
                    raise HTTPException(
                        status_code=400, detail="New passwords do not match"
                    )

                # Hash the new password
                new_hashed_password = bcrypt.hashpw(
                    new_password.encode("utf-8"), bcrypt.gensalt()
                )

                # Update the password in the database
                Constants.USERS.update_one(
                    {"_id": ObjectId(id)},
                    {
                        "$set": {
                            "password": new_hashed_password.decode("utf-8"),
                            "time_used": 1,
                        }
                    },
                )

                return {"message": "Password reset successfully"}
            else:
                raise HTTPException(status_code=400, detail="OTP has expired")
        else:
            raise HTTPException(status_code=400, detail="OTP has been used")
    else:
        raise HTTPException(status_code=400, detail="Invalid OTP or user ID")
