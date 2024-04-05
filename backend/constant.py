# -*- coding: utf-8 -*-
import certifi
import os

from pydantic import BaseModel

from dotenv import load_dotenv
from pymongo import MongoClient
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores.qdrant import Qdrant
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from qdrant_client import QdrantClient

load_dotenv(override=True)


class Constants:
    MONGODB_URI = os.environ["DATABASE_URI"]
    OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]
    QDRANT_URI = os.environ["QDRANT_URI"]
    QDRANT_API_KEY = os.environ["QDRANT_API_KEY"]

    if MONGODB_URI is not None:
        # Create MongoDB client
        client = MongoClient(host=MONGODB_URI, tlsCAFile=certifi.where(), tls=True)

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

    # Initialize OpenAI model
    EMBEDDING_FUNC = OpenAIEmbeddings(model="text-embedding-3-large")

    CHAT_MODEL = ChatOpenAI(
        model_name="gpt-4-0125-preview",
        temperature=0.1,
        openai_api_key=OPENAI_API_KEY,
        frequency_penalty=0.5,
        presence_penalty=0.5,
        callbacks=[StreamingStdOutCallbackHandler()],
        streaming=True,
    )

    qdrant_client = QdrantClient(
        url=QDRANT_URI,
        api_key=QDRANT_API_KEY,
        prefer_grpc=True,
    )

    VECTOR_DB = Qdrant(
        client=qdrant_client,
        collection_name="ace_resume_db",
        embeddings=EMBEDDING_FUNC,
    )


# Define Message class
class Message(BaseModel):
    message: str
