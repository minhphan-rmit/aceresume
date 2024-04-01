##from enum import StrEnum
from pydantic import BaseModel
from pymongo import MongoClient
from enum import Enum
from urllib.parse import quote_plus

import certifi as certifi
class StrEnum(str, Enum):
    pass


class Constant(StrEnum):
    escaped_username = quote_plus('mylittlehusky2004')
    escaped_password = quote_plus('PDanii@279197.')
    MONGODB_URI =  f'mongodb+srv://{escaped_username}:{escaped_password}@cluster0.cbgkxvv.mongodb.net/'


class Message(BaseModel):
    message: str

client = MongoClient(host=Constant.MONGODB_URI, tlsCAFile=certifi.where(), tls=True).get_database("dev")
RESUME_INFO = client.get_collection("RESUME_INFO")
RESUME_ANALYSIS = client.get_collection("RESUME_ANALYSIS")
USERS = client.get_collection("USERS")
CURRENT_OPENING_JOB = client.get_collection("JOB_INFO")
CANDIDATE_EXPERIENCE = client.get_collection("CANDIDATE_EXPERIENCE")
ROLE_ROADMAP = client.get_collection("ROADMAP_INFO")
INTERVIEW_QA = client.get_collection("INTERVIEW_QA")
MOCK_INTERVIEW = client.get_collection("MOCK_INTERVIEW")