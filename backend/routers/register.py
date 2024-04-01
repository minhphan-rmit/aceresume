# -*- coding: utf-8 -*-
from fastapi import APIRouter, Form, BackgroundTasks
from fastapi.responses import JSONResponse
from models.users import UserInfo
from constant import Message, USERS
from pymongo import MongoClient


router = APIRouter(prefix="/api/v1", tags=["User Register"])

@router.post("/register", responses= {409: {"model": Message},
                                      422: {"model": Message}})
def register_user(  background_tasks: BackgroundTasks, # this for email send
    user_name: str = Form(..., description="Username of the user"),
    password: str = Form(..., description="Password of the user"),
    full_name: str = Form(..., description="Full name of the user"),
    number: str = Form(None, description="Phone number of the user"),
    email: str = Form(..., description="Email address of the user"),
    address: str = Form(None, description="Address of the user"),
):
    try: 
        USERS.insert_one(
            UserInfo(username=user_name, full_name=full_name, password=password, number=number, email= email, address= address).dict())
    except ValueError as e:
        # Handle Pydantic validation errors
        return JSONResponse(status_code=422, content={"message": str(e)}) # error for email and number
    
    assert USERS.find_one({'username': user_name})['username'] == user_name # test case 
    assert len(list(USERS.find({'username': user_name}))) == 1    # test case

    return JSONResponse(content={"user_name": user_name, "password": password.decode('utf-8'), "full_name": full_name, "number": number, "email": email, "address": address, 'key':USERS.find_one({'username': user_name})['key']})