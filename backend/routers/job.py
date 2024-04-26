# -*- coding: utf-8 -*-
# Resume Related API Endpoints
from __future__ import annotations

import logging

from jobspy import scrape_jobs
from fastapi import APIRouter

from constant import Message
from models.job import JobInfo, JobList

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
    "/{user_id}/find-jobs",
    status_code=200,
    description="Upload resume for processing",
    response_model=JobList,
    response_description="Message to show whether the resume is uploaded successfully or not",
    responses={401: {"model": Message}, 500: {"model": Message}},
)
async def find_job_data(job_title: str, location: str, country_indeed: str) -> JobList:
    jobs = scrape_jobs(
        site_name=["indeed", "linkedin", "zip_recruiter", "glassdoor"],
        search_term=job_title,
        location=location,
        results_wanted=2,
        hours_old=72,  # (only Linkedin/Indeed is hour specific, others round up to days old)
        country_indeed=country_indeed,  # only needed for indeed / glassdoor
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
