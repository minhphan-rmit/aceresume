# -*- coding: utf-8 -*-
from __future__ import annotations

import logging
from typing import Dict

from fastapi import APIRouter, File, HTTPException, UploadFile, File, Body
from fastapi.responses import JSONResponse
from datetime import datetime
from bson import ObjectId
from helpers.utility import Utility
from services.process_resume import (
    process_resume,
    analyse_resume,
    extract_resume,
    roadmap_generator,
)
from models.resume import (
    ResumeAnalysis,
    ResumeInfo,
    CandidateExperience,
    RoadmapModel,
    Target,
)
from constant import Message, Constants
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
    resume_url: str = Body(...),
):
    if resume.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    resume_data = await process_resume(
        resume.file.read(), resume.filename.split(".")[-1]
    )

    if not resume_data:
        raise HTTPException(status_code=400, detail="Uploaded PDF is empty.")

    # Insert resume data into MongoDB
    add_resume = Constants.RESUME_INFO.insert_one(
        {
            "user_id": user_id,
            "resume": resume_data.encode("utf-8"),
            "filename": resume.filename,
            "resume_url": resume_url,
            "created_at": datetime.utcnow(),
        }
    )

    return {
        "message": "Resume uploaded successfully.",
        "object_id": str(add_resume.inserted_id),
        "resume_url": resume_url,
    }


@router.get(
    "/{user_id}/get_all_resume",
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
                    "resume_url": resume["resume_url"],
                    "created_at": resume["created_at"].isoformat()
                    if resume["created_at"]
                    else None,
                }
            )

    return JSONResponse(content=all_resumes)


@router.post(
    "/{user_id}/{resume_id}/summarize",
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
    user_id: str,
    resume_id: str,
    filename: str = Body(..., embed=True),
    resume_info: str = Body(..., embed=True),
) -> Dict:
    analysis_result = await analyse_resume(resume_info)
    json_result = json.loads(analysis_result[8:].strip().replace("`", ""))

    analysis_data = {
        "user_id": user_id,
        "resume_id": resume_id,
        "filename": filename,
        "analyse_at": datetime.utcnow(),
        "score": json_result["score"],
        "pros": json_result["pros"],
        "cons": json_result["cons"],
        "add_ons": json_result["add-ons"],
    }
    Constants.RESUME_ANALYSIS.insert_one(analysis_data)

    return ResumeAnalysis(
        score=json_result["score"],
        pros=json_result["pros"],
        cons=json_result["cons"],
        add_ons=json_result["add-ons"],
    )


@router.post(
    "/{user_id}/roadmap-generate",
    status_code=200,
    description="Generate Roadmap for the user based on the resume info and job description",
    response_model=RoadmapModel,
    response_description="Roadmap in the format of JSON",
    responses={401: {"model": Message}, 500: {"model": Message}},
)
async def generate_roadmap(
    user_id: str,
    resume_info: str,
    resume_id: str,
    job_description: str,
    roadmap_name: str,
) -> RoadmapModel:
    roadmap_result = await roadmap_generator(resume_info, job_description)
    json_result = json.loads(roadmap_result[8:].strip().replace("`", ""))

    roadmap = RoadmapModel(
        level=json_result["roadmap"]["client_level"],
        list_of_roadmap=[
            Target(
                topic_name=str(value["topic_name"]),
                topic_description=str(value["topic_description"]),
                resources=value["resource_list"],
                knowledge_list=value["knowledge_list"],
            )
            for value in json_result["roadmap"]["target"]
        ],
        summary=json_result["roadmap"]["summary"],
    )

    roadmap_data = {
        "roadmap_name": roadmap_name,
        "user_id": user_id,
        "resume_id": resume_id,
        "roadmap_name": roadmap_name,
        "generate_at": datetime.utcnow(),
        "roadmap": roadmap,
    }
    Constants.ROLE_ROADMAP.insert_one(roadmap_data)

    return roadmap


@router.get(
    "/{user_id}/{resume_id}/get_analysis",
    status_code=200,
    description="Retrieve analysis of a specific resume",
    response_model=ResumeAnalysis,  # Ensure this model accurately reflects the structure of the stored analysis data
    response_description="Details of the resume analysis",
    responses={
        404: {"model": Message, "description": "Analysis not found"},
        500: {"model": Message, "description": "Internal Server Error"},
    },
)
async def get_resume_analysis(user_id: str, resume_id: str) -> ResumeAnalysis:
    try:
        analysis_data = Constants.RESUME_ANALYSIS.find_one(
            {"user_id": user_id, "resume_id": resume_id}
        )
        if not analysis_data:
            raise HTTPException(status_code=404, detail="Analysis not found")

        return ResumeAnalysis(
            pros=analysis_data.get("pros", []),
            cons=analysis_data.get("cons", []),
            add_ons=analysis_data.get("add-ons", []),
            created_at=analysis_data.get("analyse_at", None),
        )
    except Exception as e:
        logger.error(f"Error retrieving resume analysis: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Failed to retrieve resume analysis"
        )
