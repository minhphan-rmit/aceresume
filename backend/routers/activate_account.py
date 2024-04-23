# -*- coding: utf-8 -*-
from fastapi import APIRouter, HTTPException, BackgroundTasks
import jwt
from constant import Constants
import os
from datetime import datetime
from models.email import EmailSchema, send_email

router = APIRouter(prefix="/api/aceresume", tags=["User Activation"])


@router.get("/activate")
async def activate_user(token: str, email: str, background_tasks: BackgroundTasks):
    try:
        # Decode and verify the token
        jwt_secret = os.environ.get(
            "JWT_SECRET",
            "649fb93ef34e4fdf4187709c84d643dd61ce730d91856418fdcf563f895ea40f",
        )
        payload = jwt.decode(token, jwt_secret, algorithms=["HS256"])

        # Check if the token is still valid (not expired)
        exp_timestamp = payload.get("exp")
        if exp_timestamp and datetime.utcnow() > datetime.fromtimestamp(exp_timestamp):
            raise HTTPException(status_code=400, detail="Token expired")

        # Update is_activate to True
        user = Constants.USERS.find_one_and_update(
            {"email": email},
            {
                "$set": {
                    "is_activate": True,
                    "updated_at": datetime.utcnow(),
                    "verified_at": datetime.utcnow(),
                }
            },
            return_document=True,
        )

        if user:
            user_name = user.get("username")

            #  welcome email
            subject = "Welcome to AceResume!"
            body = f"""
<html> <div bgcolor="#ffffff" leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style=" background-color: #ffffff; margin: 0; padding: 0; font-family: Helvetica, Arial, 'Lucida Grande', sans-serif; height: 100% !important; width: 100% !important; " > <center role="article" aria-roledescription="email" aria-label="Welcome to AceResume" lang="en" dir="ltr" style="background-color: #ffffff; width: 100%; table-layout: fixed" > <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" bgcolor="#ffffff" style=" max-width: 100% !important; width: 100% !important; min-width: 100% !important; " > <tr> <td align="center" valign="top" id="bodyCell" style="padding: 0"> <table border="0" cellpadding="0" cellspacing="0" width="100%" id="emailBody" bgcolor="#ffffff" style=" max-width: 100% !important; width: 100% !important; min-width: 100% !important; " > <tr> <td align="center" valign="top" style="padding-top: 20px; padding-bottom: 20px" > <h1 style=" color: #333333; font-family: Helvetica, Arial, sans-serif; font-size: 26px; line-height: 150%; text-align: Left; font-weight: bold; width: max-content; " > Welcome to AceResume! </h1> <p style="font-size: 16px; line-height: 150%; color: #666666"> Hi <strong style="color: #312e81">{user_name}</strong>! Thank you for joining us. We're excited to have you with us. </p> <p style="font-size: 16px; line-height: 150%; color: #666666"> We believe in empowering our members with tools and insights to enhance their careers. Here's how you can get the most out of your new account: </p> <table style=" font-size: 16px; line-height: 150%; color: white; padding: 30px; border-radius: 5px; text-decoration: none; margin-top: 20px; width: 50%; " > <tr style="border-spacing: 10px"> <td style="border-spacing: 20px"> <ul style="list-style-type: none; padding-left: 0"> <a href="" style="text-decoration: none"> <li style=" color: white; font-size: 16px; line-height: 150%; border: 5px solid #6366f1; background-color: #6366f1; padding: 30px; border-radius: 5px; margin-right: 20px; cursor: pointer; " > Explore <strong>resume analysis</strong> to increase your competitiveness. </li></a > <a href="" style="text-decoration: none"> <li style=" color: white; font-size: 16px; line-height: 150%; border: 5px solid #6366f1; background-color: #6366f1; padding: 30px; border-radius: 5px; margin-top: 20px; margin-right: 40px; cursor: pointer; " > Try out <strong>professional mock-interview</strong> to ace your next job interview. </li></a > </ul> </td> <td style="border-spacing: 10px"> <ul style="list-style-type: none; padding-left: 0"> <a href="" style="text-decoration: none"> <li style=" color: white; font-size: 16px; line-height: 150%; border: 5px solid #6366f1; background-color: #6366f1; padding: 30px; border-radius: 5px; margin-top: 20px; margin-left: 20px; cursor: pointer; " > Access <strong>exclusive job listings</strong> and apply with ease. </li></a > <a href="" style="text-decoration: none"> <li style=" color: white; font-size: 16px; line-height: 150%; border: 5px solid #6366f1; background-color: #6366f1; padding: 30px; border-radius: 5px; margin-top: 20px; cursor: pointer; " > Use our <strong>career development resources</strong> to boost your skills. </li></a > </ul> </td> </tr> </table> <p style="font-size: 16px; line-height: 150%; color: #666666"> If you have any questions or need assistance, don't hesitate to contact our support team at <a href="mailto:info@aceresume.com" target="_blank" style="color: #6366f1; text-decoration: underline" >info@aceresume.com</a >. </p> <p style="font-size: 12px; color: #999999"> We're thrilled to support you on your career path. </p> </td> </tr> </table> </td> </tr> <tr> <td align="center" valign="top"> <p style="font-size: 12px; color: #999999"> © 2024 AceResume. All rights reserved. </p> </td> </tr> </table> </center> </div></html>            """
            data = EmailSchema(to=email, subject=subject, body=body).dict()
            background_tasks.add_task(
                send_email, data["to"], data["subject"], data["body"]
            )

            return {"message": "User activated successfully"}
        else:
            raise HTTPException(status_code=404, detail="User not found")

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Invalid token")
