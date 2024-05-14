# -*- coding: utf-8 -*-

from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime


class CandidateExperience(BaseModel):
    company_name: str = Field(..., description="Name of the company")
    job_title: str = Field(..., description="Job title")
    start_date: str = Field(..., description="Start date of the job")
    end_date: Optional[str] = Field(..., description="End date of the job")
    job_description: str = Field(..., description="Job description")


class ResumeInfo(BaseModel):
    candidate_name: str = Field(..., description="Name of the candidate")
    candidate_email: Optional[str] = Field(..., description="Email of the candidate")
    candidate_skill: Optional[List[str]] = Field(
        ..., description="Skills of the candidate"
    )
    candidate_experience: List[CandidateExperience] = Field(
        ..., description="Experience of the candidate"
    )


class ResumeAnalysis(BaseModel):
    score: int = Field(..., description="The score of the resume")
    pros: List[str] = Field(..., description="List of pros")
    cons: List[str] = Field(..., description="List of cons")
    add_ons: List[str] = Field(..., description="List of add-ons")
    score: Optional[float] = None
    created_at: Optional[datetime] = None


class Target(BaseModel):
    topic_name: str = Field(..., description="Name of the topic")
    topic_description: str = Field(..., description="Description of the topic")
    resources: List[str] = Field(..., description="List of resources")
    knowledge_list: List[str] = Field(..., description="List of knowledge")
    is_done: bool = Field(default=False, description="Check if the topic is done")


class RoadmapModel(BaseModel):
    level: Optional[str] = Field(
        ..., description="The level of knowledge of the client"
    )
    list_of_roadmap: Optional[List[Target]] = Field(
        ..., description="A Roadmap for user"
    )
    summary: Optional[str] = Field(
        ..., description="A brief description of the whole roadmap"
    )
    progress: float = Field(
        default=0.0, description="Percentage of the roadmap completed"
    )
