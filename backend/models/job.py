# -*- coding: utf-8 -*-
from typing import List, Optional
import datetime
from pydantic import BaseModel, Field


class JobInfo(BaseModel):
    job_title: str = Field(..., description="the title of the role")
    job_description: str = Field(..., description="the description of the role")
    company: str = Field(..., description="the company name")
    location: str = Field(..., description="the company location")
    company_url: Optional[str] = Field(..., description="the company URL")
    company_industry: Optional[str] = Field(
        ..., description="the industry that the company belongs"
    )
    job_type: str = Field(
        ..., description="the type of job. Either part-time, full-time, contract, etc."
    )
    date_posted: datetime.date | str = Field(..., description="the date posted")
    min_amount: Optional[str] = Field(None, description="the minimum wage of the job")
    max_amount: Optional[str] = Field(None, description="the maximum wage of the job")
    is_remote: Optional[bool | str] = Field(
        None, description="whether the job provide remote or not"
    )
    contact_email: str = Field(..., description="the contact email for this role")
    logo_photo_url: Optional[str] = Field(
        None, description="the URL for the company logo image"
    )
    banner_photo_url: Optional[str] = Field(
        None, description="the URL for the company banner image"
    )
    site: str = Field(..., description="the site gather the job")
    job_url: str = Field(..., description="the job URL")


class JobList(BaseModel):
    list_of_jobs: List[JobInfo] = Field(..., description="a list of job info")
