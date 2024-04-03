# -*- coding: utf-8 -*-
from enum import StrEnum
from dotenv import load_dotenv
from pydantic import BaseModel
from pymongo import MongoClient
import certifi
import os

load_dotenv()

from langchain_openai import ChatOpenAI, OpenAIEmbeddings


# Define Constant class
class Constants(StrEnum):
    MONGODB_URI = os.environ["DATABASE_URI"]
    OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]


# Define Message class
class Message(BaseModel):
    message: str


# Create MongoDB client
client = MongoClient(host=Constants.MONGODB_URI, tlsCAFile=certifi.where(), tls=True)

# Get the database
db = client.get_database("dev")

# Get collections
RESUME_INFO = db.get_collection("RESUME_INFO")
RESUME_ANALYSIS = db.get_collection("RESUME_ANALYSIS")
USERS = db.get_collection("USERS")
CURRENT_OPENING_JOB = db.get_collection("JOB_INFO")
CANDIDATE_EXPERIENCE = db.get_collection("CANDIDATE_EXPERIENCE")
ROLE_ROADMAP = db.get_collection("ROADMAP_INFO")
INTERVIEW_QA = db.get_collection("INTERVIEW_QA")
MOCK_INTERVIEW = db.get_collection("MOCK_INTERVIEW")
