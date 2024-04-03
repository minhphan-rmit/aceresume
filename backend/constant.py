# -*- coding: utf-8 -*-
from enum import Enum
from urllib.parse import quote_plus
from pydantic import BaseModel
from pymongo import MongoClient
import certifi

from langchain_openai import ChatOpenAI, OpenAIEmbeddings


# Define Constant class
class Constant(str, Enum):
    escaped_username = quote_plus("mylittlehusky2004")
    escaped_password = quote_plus("PDanii@279197.")
    MONGODB_URI = f"mongodb+srv://{escaped_username}:{escaped_password}@cluster0.cbgkxvv.mongodb.net/"


# Define Message class
class Message(BaseModel):
    message: str


# Create MongoDB client
client = MongoClient(host=Constant.MONGODB_URI, tlsCAFile=certifi.where(), tls=True)

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
