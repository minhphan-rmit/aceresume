# -*- coding: utf-8 -*-
# Resume Related API Endpoints
from __future__ import annotations

import logging

from jobspy import scrape_jobs
from fastapi import APIRouter, HTTPException
from typing import Optional
from pydantic import BaseModel

from constant import Message
from models.job import JobInfo, JobList
from models.resume import ResumeInfo

MODULE_NAME = "Job Processing"

router = APIRouter(prefix="/api/aceresume/job", tags=[MODULE_NAME])

logger = logging.getLogger(MODULE_NAME)


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
    description="Upload resume for processing",
    response_model=JobList,
    response_description="Message to show whether the resume is uploaded successfully or not",
    responses={401: {"model": Message}, 500: {"model": Message}},
)
async def find_job_data(
    job_title: str, resume_info: Optional[ResumeInfo] = None
) -> JobList:
    if resume_info:
        extracted_skills = resume_info.candidate_skill

        # Scrape job postings based on the job title
        jobs = scrape_jobs(
            site_name=["indeed", "linkedin", "zip_recruiter", "glassdoor"],
            search_term=job_title,
            location="Austin, TX",
            results_wanted=10,  # Increased to get more job postings for better matching
            hours_old=72,  # (only Linkedin/Indeed is hour specific, others round up to days old)
            country_indeed="USA",  # only needed for indeed / glassdoor
        )

        # Filter job postings based on CV matching
        matched_jobs = []
        for index, job in jobs.iterrows():
            if job["description"] is not None:
                job_description = str(job["description"])
                num_matching_skills = sum(
                    1
                    for skill in extracted_skills
                    if skill.lower() in job_description.lower()
                )
            if num_matching_skills >= 5:
                matched_jobs.append(job)

        # Convert matched job postings to JobList format
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
        matched_jobs_data.fillna("None", inplace=True)
        matched_jobs_data = matched_jobs_data.to_dict("list")

        return data_to_joblist(matched_jobs_data)
    else:
        # Scrape job postings based on the job title
        jobs = scrape_jobs(
            site_name=["indeed", "linkedin", "zip_recruiter", "glassdoor"],
            search_term=job_title,
            location="Austin, TX",
            results_wanted=10,  # Increased to get more job postings for better matching
            hours_old=72,  # (only Linkedin/Indeed is hour specific, others round up to days old)
            country_indeed="USA",  # only needed for indeed / glassdoor
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
    jobs.fillna("None", inplace=True)
    jobs = jobs.to_dict("list")

    return data_to_joblist(jobs)


@router.post(
    "/{job_title}/find-jobs-available",
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
