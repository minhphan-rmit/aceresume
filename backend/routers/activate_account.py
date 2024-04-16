# -*- coding: utf-8 -*-
from fastapi import APIRouter, HTTPException
import jwt
from constant import Constants
import os
from datetime import datetime

router = APIRouter(prefix="/api/aceresume", tags=["User Activation"])


@router.get("/activate")
async def activate_user(token: str, email: str):
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
            return {"message": "User activated successfully"}
        else:
            raise HTTPException(status_code=404, detail="User not found")

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Invalid token")
