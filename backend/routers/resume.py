# -*- coding: utf-8 -*-
# Resume Related API Endpoints
from __future__ import annotations

import io
import logging

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse, StreamingResponse

from datetime import datetime
from bson import ObjectId
from helpers.utility import Utility
from constant import Message, Constants
from services.process_resume import process_resume, analyse_resume, extract_resume
from models.resume import ResumeAnalysis, ResumeInfo, CandidateExperience
import json

MODULE_NAME = "Resume Processing"

router = APIRouter(prefix="/api/aceresume/resume", tags=[MODULE_NAME])

logger = logging.getLogger(MODULE_NAME)


@router.post(
    "/{user_id}/upload",
    status_code=200,
    description="Upload resume for processing",
    response_description="Message to show whether the resume is uploaded successfully or not",
    responses={401: {"model": Message}, 500: {"model": Message}},
)
async def upload_resume(
    user_id: str,
    resume: UploadFile = File(..., description="Resume file to upload"),
    filename: str = File(..., description="Filename of the resume"),
):
    if filename.split(".")[-1] not in ["docx", "pdf"]:
        raise HTTPException(
            status_code=401,
            detail="Only docx and pdf files are supported",
        )

    resume_data = await process_resume(
        resume.file.read(), resume.filename.split(".")[-1]
    )
    try:
        data = await extract_resume(resume_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to process resume")

    resume_info = json.dumps(
        {
            "candidate_skill": data.get("skills", []),
        }
    )
    # Insert resume data into MongoDB
    add_resume = Constants.RESUME_INFO.insert_one(
        {
            "user_id": user_id,
            "filename": filename,
            "resume": resume_data.encode("utf-8"),
            "resume_info": resume_info,
        }
    )

    return {
        "message": "Resume uploaded successfully.",
        "object_id": str(add_resume.inserted_id),
    }


@router.get(
    "{user_id}/get_all_resume",
    status_code=200,
    description="Get a specific resume",
    responses={404: {"model": Message}, 500: {"model": Message}},
)
async def get_all_cv(user_id: str):
    resumes = Constants.RESUME_INFO.find({"user_id": user_id})
    resumes_list = list(resumes)
    if len(resumes_list) == 0:
        raise HTTPException(status_code=404, detail="Resumes not found")

    all_resumes = []

    for resume in resumes_list:
        cv_binary_data = resume["resume"]
        if cv_binary_data:
            all_resumes.append(
                {
                    "filename": resume["filename"],
                    "resume_id": str(resume["_id"]),
                }
            )

    return JSONResponse(content=all_resumes)


@router.get(
    "{user_id}/{resume_id}",
    status_code=200,
    description="Get a specific resume",
    responses={404: {"model": Message}, 500: {"model": Message}},
)
async def get_cv_pdf(user_id: str, resume_id: str):
    resume = Constants.RESUME_INFO.find_one(
        {"user_id": user_id, "_id": ObjectId(resume_id)}
    )
    if not resume:
        raise HTTPException(status_code=404, detail="Resumes not found")

    pdf_data = resume.get("resume")

    return StreamingResponse(io.BytesIO(pdf_data), media_type="application/pdf")


@router.post(
    "{user_id}/{resume_id}/summarize",
    status_code=200,
    description="Extract and categorize the Resume Info",
    response_model=ResumeInfo,  # Assuming this model exists
    response_description="Resume information",
    responses={
        404: {"model": Message, "description": "No resume found"},
        500: {"model": Message, "description": "Internal Server Error"},
    },
)
async def extract_resume_data(
    user_id: str,
    resume_id: str,
) -> ResumeInfo:
    resume_data = Constants.RESUME_INFO.find_one(
        {"user_id": user_id, "_id": ObjectId(resume_id)}
    )
    if not resume_data:
        raise HTTPException(status_code=404, detail="No resume found")

    try:
        data = await extract_resume(resume_data["resume"])
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to process resume")

    return ResumeInfo(
        candidate_name=str(data.get("candidate_name", "")),
        candidate_email=str(data.get("candidate_email", "")),
        candidate_skill=data.get("skills", []),
        candidate_experience=[
            CandidateExperience(
                company_name=str(value.get("work_company", "")),
                job_title=str(value.get("work_title", "")),
                start_date=str(value.get("work_timeline", ["", ""])[0]),
                end_date=str(value.get("work_timeline", ["", ""])[1]),
                job_description="\n".join(value.get("work_responsibilities", [])),
            )
            for value in data.get("work_exp", [])
        ],
    )


@router.post(
    "/{user_id}/{resume_id}/analyse",
    status_code=200,
    description="Analyse the Resume Info",
    response_model=ResumeAnalysis,
    response_description="Message to show whether the resume is analysed successfully or not",
    responses={401: {"model": Message}, 500: {"model": Message}},
)
async def feedback_resume(
    user_id: str, resume_id: str, filename: str, resume_info: str
) -> ResumeAnalysis:
    analysis_result = await analyse_resume(resume_info)
    json_result = json.loads(analysis_result[8:].strip().replace("`", ""))

    analysis_data = {
        "user_id": user_id,
        "resume_id": resume_id,
        "filename": filename,
        "analyse_at": datetime.utcnow(),
        "pros": json_result["pros"],
        "cons": json_result["cons"],
        "add_ons": json_result["add-ons"],
    }
    Constants.RESUME_ANALYSIS.insert_one(analysis_data)

    return ResumeAnalysis(
        pros=json_result["pros"],
        cons=json_result["cons"],
        add_ons=json_result["add-ons"],
    )
