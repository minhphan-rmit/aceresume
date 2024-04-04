# -*- coding: utf-8 -*-

from typing import Optional
from pydantic import BaseModel, Field


class ResumeInfo(BaseModel):
    candidate_name: str = Field(..., description="Name of the candidate")
    candidate_email: Optional[str] = Field(..., description="Email of the candidate")
