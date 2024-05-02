# -*- coding: utf-8 -*-
import logging


import logging_setup  # setup logging
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.manage_account import delete_inactive_accounts
from routers import register, login, activate_account, resume, job, profile

logger = logging.getLogger("Backend")


app = FastAPI(openapi_url="/api/aceresume/openapi.json", docs_url="/api/aceresume/docs")

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8081",
    "https://aceresume-d9997.firebaseapp.com",
    "https://aceresume-d9997.web.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(register.router)
app.include_router(resume.router)
app.include_router(job.router)
app.include_router(login.router)
app.include_router(profile.router)
app.include_router(activate_account.router)

delete_inactive_accounts()

if __name__ == "__main__":
    uvicorn.run("main:app", workers=-1, host="0.0.0.0", port=8080)
