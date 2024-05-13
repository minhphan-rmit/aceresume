# -*- coding: utf-8 -*-
from __future__ import annotations

import logging
from typing import Dict

from fastapi import APIRouter, File, HTTPException, UploadFile, File, Body
from pymongo.cursor import Cursor
from fastapi.responses import JSONResponse
from datetime import datetime
from bson import ObjectId
from bson import json_util
from typing import List


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
    resume_id: str,
    job_description: str,
    roadmap_name: str,
) -> RoadmapModel:
    # Check if the roadmap name already exists
    existing_roadmap = Constants.ROLE_ROADMAP.find_one(
        {"roadmap_name": roadmap_name}, {"user_id": user_id}
    )
    if existing_roadmap:
        raise HTTPException(status_code=409, detail="Roadmap name already exists")

    resume_info = await extract_resume_data(user_id, resume_id)
    resume_info_str = resume_info.json()
    roadmap_result = await roadmap_generator(resume_info_str, job_description)
    json_result = json.loads(roadmap_result[8:].strip().replace("`", ""))

    roadmap = RoadmapModel(
        level=json_result["roadmap"]["client_level"],
        list_of_roadmap=[
            Target(
                topic_name=str(value["topic_name"]),
                topic_description=str(value["topic_description"]),
                resources=value["resource_list"],
                knowledge_list=value["knowledge_list"],
                is_done=False,  # Adding the is_done field with a default value of False
            )
            for value in json_result["roadmap"]["target"]
        ],
        summary=json_result["roadmap"]["summary"],
    )

    # Calculating initial progress, which should be 0 as all topics are initially marked as not done
    total_topics = len(roadmap.list_of_roadmap)
    completed_topics = sum(topic.is_done for topic in roadmap.list_of_roadmap)
    roadmap.progress = (
        (completed_topics / total_topics) * 100 if total_topics > 0 else 0
    )

    roadmap_data = {
        "roadmap_id": ObjectId(),  # Generate a new ObjectId for the roadmap
        "user_id": user_id,
        "resume_id": resume_id,
        "roadmap_name": roadmap_name,
        "job_description": job_description,
        "roadmap": roadmap,
        "created_at": datetime.utcnow(),
    }

    roadmap_json = json.loads(json_util.dumps(roadmap_data))

    Constants.ROLE_ROADMAP.insert_one(roadmap_json)

    return roadmap_data


@router.get("/{user_id}/{resume_id}/get_roadmap")
async def get_roadmap(user_id: str, resume_id: str, roadmap_id: str) -> Dict[str, Any]:
    query = {"user_id": user_id, "resume_id": resume_id, "_id": ObjectId(roadmap_id)}
    roadmap_data = Constants.ROLE_ROADMAP.find_one(query)

    if not roadmap_data:
        raise HTTPException(status_code=404, detail="Roadmap not found")

    # Convert created_at from ISO string to datetime if necessary
    created_at = (
        datetime.fromisoformat(roadmap_data.get("created_at", {}).get("$date"))
        if "created_at" in roadmap_data
        else None
    )

    roadmap = RoadmapModel(
        level=roadmap_data["roadmap"][0][1],
        list_of_roadmap=[
            {
                "topic_name": topic[0][1],
                "topic_description": topic[1][1],
                "resources": topic[2][1],
                "knowledge_list": topic[3][1],
                "is_done": topic[4][1],
            }
            for topic in roadmap_data["roadmap"][1][1]
        ],
        summary=roadmap_data["roadmap"][2][1],
        progress=roadmap_data["roadmap"][3][1],
    )

    # Build a custom response that includes the model and the additional fields
    response_data = {
        "roadmap_id": str(roadmap_data["_id"]),
        "roadmap": roadmap.dict(),  # Convert the Pydantic model to a dictionary
        "job_description": roadmap_data.get(
            "job_description", "No description provided"
        ),
        "roadmap_name": roadmap_data.get("roadmap_name", "Unnamed Roadmap"),
        "created_at": created_at.isoformat()
        if created_at
        else None,  # Ensure datetime is JSON serializable
    }

    return JSONResponse(content=response_data)


@router.get("/{user_id}/get_all_roadmaps")
async def get_all_roadmaps(user_id: str, resume_id: str) -> List[Dict[str, Any]]:
    roadmaps_data = Constants.ROLE_ROADMAP.find(
        {"user_id": user_id, "resume_id": resume_id}
    )

    # Check if the user has any roadmaps
    if Constants.ROLE_ROADMAP.count_documents({"user_id": user_id}) == 0:
        raise HTTPException(status_code=404, detail="No roadmaps found for the user")

    roadmaps = []
    for roadmap_data in roadmaps_data:
        if "roadmap" in roadmap_data and isinstance(roadmap_data["roadmap"], list):
            # Parse the created_at field from ISO string to datetime if necessary
            created_at = (
                datetime.fromisoformat(roadmap_data.get("created_at", {}).get("$date"))
                if "created_at" in roadmap_data
                else None
            )

            parsed_roadmap = {
                "level": roadmap_data["roadmap"][0][1],
                "list_of_roadmap": [
                    {
                        "topic_name": item[0][1],
                        "topic_description": item[1][1],
                        "resources": item[2][1],
                        "knowledge_list": item[3][1],
                        "is_done": item[4][1],
                    }
                    for item in roadmap_data["roadmap"][1][1]
                ],
                "summary": roadmap_data["roadmap"][2][1],
                "progress": roadmap_data["roadmap"][3][1],
                "job_description": roadmap_data.get("job_description", ""),
                "roadmap_name": roadmap_data.get("roadmap_name", ""),
                "created_at": created_at.isoformat() if created_at else None,
            }
            roadmap_model = RoadmapModel(**parsed_roadmap)
            # Create a custom dictionary including the RoadmapModel data and additional fields
            roadmap_response = {
                "roadmap_id": str(
                    roadmap_data["_id"]
                ),  # Convert ObjectId to string for JSON serialization
                "roadmap_details": roadmap_model.dict(),
                "job_description": parsed_roadmap["job_description"],
                "roadmap_name": parsed_roadmap["roadmap_name"],
                "created_at": parsed_roadmap["created_at"],
            }
            roadmaps.append(roadmap_response)

    if not roadmaps:
        raise HTTPException(status_code=404, detail="No roadmaps found for the user")

    return JSONResponse(content=roadmaps)


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
            add_ons=analysis_data.get("add_ons", []),
            score=analysis_data.get("score", None),
            created_at=analysis_data.get("analyse_at", None),
        )
    except Exception as e:
        logger.error(f"Error retrieving resume analysis: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Failed to retrieve resume analysis"
        )
