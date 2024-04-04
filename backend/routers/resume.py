# -*- coding: utf-8 -*-
# Resume Related API Endpoints
from __future__ import annotations

import logging

from fastapi import APIRouter, File, HTTPException, UploadFile
from constant import Message, Constants

MODULE_NAME = "Resume Processing"

router = APIRouter(prefix="/api/aceresume/resume", tags=[MODULE_NAME])

logger = logging.getLogger(MODULE_NAME)


@router.post(
    "/{user_id}/upload",
    status_code=200,
    description="Upload resume for processing",
    response_model=Message,
    response_description="Message to show whether the resume is uploaded successfully or not",
    response={401: {"model": Message}, 500: {"model": Message}},
)
async def upload_resume(
    user_id: str,
    resume: UploadFile = File(..., description="Resume file to upload"),
):
    pass
