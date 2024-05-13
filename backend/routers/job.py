# -*- coding: utf-8 -*-
# Resume Related API Endpoints
from __future__ import annotations

import logging

from jobspy import scrape_jobs
from fastapi import APIRouter, HTTPException
from typing import Optional
from pydantic import BaseModel
from bson import ObjectId
import re

from constant import Message, Constants
from models.job import JobInfo, JobList
from models.resume import ResumeInfo, CandidateExperience
from services.process_resume import (
    extract_resume,
)

MODULE_NAME = "Job Processing"

router = APIRouter(prefix="/api/aceresume/job", tags=[MODULE_NAME])

logger = logging.getLogger(MODULE_NAME)


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


def data_to_joblist(data: dict) -> JobList:
    jobs = []
    for index in range(len(data["site"])):
        job = JobInfo(
            job_title=data["title"][index],
            job_description=data["description"][index],
            company=data["company"][index],
            location=data["location"][index],
            company_url=data["company_url"][index],
            company_industry=data["company_industry"][index],
            job_type=data["job_type"][index],
            date_posted=data["date_posted"][index],
            min_amount=str(data["min_amount"][index]),
            max_amount=str(data["max_amount"][index]),
            is_remote=data["is_remote"][index],
            contact_email=data["emails"][index],
            logo_photo_url=data["logo_photo_url"][index],
            banner_photo_url=data["banner_photo_url"][index],
            site=data["site"][index],
            job_url=data["job_url"][index],
        )
        jobs.append(job)
    return JobList(list_of_jobs=jobs)


@router.post(
    "/{job_title}/find-jobs",
    status_code=200,
    description="Find jobs based on job title and resume info",
    response_model=JobList,
    response_description="List of matched job postings",
    responses={401: {"model": Message}, 500: {"model": Message}},
)
async def find_job_data(
    job_title: str,
    user_id: Optional[str] = None,
    resume_id: Optional[str] = None,
    location: str = "USA",
) -> JobList:
    if user_id and resume_id and resume_id != "null":
        resume_data = await extract_resume_data(user_id, resume_id)
        extracted_skills = resume_data.candidate_skill
        print("see if the cv is chosen and fetch:", extracted_skills)

        # Scrape job postings based on the job title
        jobs = scrape_jobs(
            site_name=["indeed", "linkedin", "zip_recruiter", "glassdoor"],
            search_term=job_title,
            location=location,
            results_wanted=10,
            hours_old=72,
            country_indeed=location,
        )

        # Filter matching jobs base on candidate skills set

        matched_jobs_data = jobs[
            [
                "site",
                "job_url",
                "title",
                "company",
                "location",
                "job_type",
                "date_posted",
                "min_amount",
                "max_amount",
                "is_remote",
                "emails",
                "description",
                "company_url",
                "logo_photo_url",
                "banner_photo_url",
                "company_industry",
            ]
        ]
        matched_jobs_data = matched_jobs_data[matched_jobs_data["description"].notna()]
        cleaned_skills = [re.sub(r"[^\w\s]", "", skill) for skill in extracted_skills]
        print("clean skill", cleaned_skills)

        for skill in cleaned_skills:
            matched_jobs_cv = matched_jobs_data[
                matched_jobs_data["description"].str.contains(
                    skill, case=False, na=False
                )
            ]

        if matched_jobs_cv is None or matched_jobs_cv.empty:
            matched_jobs_cv = matched_jobs_data

        matched_jobs_cv.fillna("None", inplace=True)
        matched_jobs_cv = matched_jobs_cv.to_dict("list")

        return data_to_joblist(matched_jobs_cv)
    else:
        # Nếu không cung cấp user_id và resume_id, thực hiện tìm kiếm dựa trên job_title
        jobs = scrape_jobs(
            site_name=["indeed", "linkedin", "zip_recruiter", "glassdoor"],
            search_term=job_title,
            location=location,
            results_wanted=10,
            hours_old=72,
            country_indeed=location,
        )

        jobs = jobs[
            [
                "site",
                "job_url",
                "title",
                "company",
                "location",
                "job_type",
                "date_posted",
                "min_amount",
                "max_amount",
                "is_remote",
                "emails",
                "description",
                "company_url",
                "logo_photo_url",
                "banner_photo_url",
                "company_industry",
            ]
        ]
        jobs = jobs[jobs["description"].notna()]
        jobs.fillna("None", inplace=True)
        jobs = jobs.to_dict("list")

        return data_to_joblist(jobs)


@router.post(
    "/find-jobs-available",
    status_code=200,
    description="Upload resume for processing",
    response_model=JobList,
    response_description="Message to show whether the resume is uploaded successfully or not",
    responses={401: {"model": Message}, 500: {"model": Message}},
)
async def find_job_data() -> JobList:
    jobs = scrape_jobs(
        site_name=["indeed", "linkedin", "zip_recruiter", "glassdoor"],
        results_wanted=2,
        hours_old=72,  # (only Linkedin/Indeed is hour specific, others round up to days old)
        country_indeed="USA",  # only needed for indeed / glassdoor
    )

    any_jobs = jobs[
        [
            "site",
            "job_url",
            "title",
            "company",
            "location",
            "job_type",
            "date_posted",
            "min_amount",
            "max_amount",
            "is_remote",
            "emails",
            "description",
            "company_url",
            "logo_photo_url",
            "banner_photo_url",
            "company_industry",
        ]
    ]
    any_jobs = any_jobs[jobs["description"].notna()]

    any_jobs.fillna("None", inplace=True)
    any_jobs = any_jobs.to_dict("list")

    return data_to_joblist(any_jobs)
