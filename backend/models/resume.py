# -*- coding: utf-8 -*-

from typing import Optional, List
from pydantic import BaseModel, Field


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
    pros: List[str] = Field(..., description="List of pros")
    cons: List[str] = Field(..., description="List of cons")
    add_ons: List[str] = Field(..., description="List of add-ons")


class Target(BaseModel):
    topic_name: str = Field(..., description="Name of the topic")
    topic_description: str = Field(..., description="Description of the topic")
    resources: List[str] = Field(..., description="List of resources")
    knowledge_list: List[str] = Field(..., description="List of knowledge")


class RoadmapModel(BaseModel):
    level: str = Field(..., description="The level of knowledge of the client")
    list_of_roadmap: List[Target] = Field(..., description="A Roadmap for user")
