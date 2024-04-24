# -*- coding: utf-8 -*-
import logging
import threading
import queue

from fastapi import APIRouter, Response, requests
from fastapi.responses import StreamingResponse
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.schema import HumanMessage
from langchain_openai import ChatOpenAI
from langchain_core.prompts.chat import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
)
from constant import Message, Constants
from models import prompt

MODULE_NAME = "Chat Interview"

router = APIRouter(prefix="/api/aceresume/chat-interview", tags=[MODULE_NAME])

logger = logging.getLogger(MODULE_NAME)

CHATBOT_AVAILABLE = []

INTERVIEW_PROMPT = """
You are a Senior Career Coach. Pretend you are interviewing a candidate for a {role} position.
Given the candidate's resume, along with the job description, ask the candidate questions to assess their qualifications for the role.
You should ask at least 5 questions to exploit the candidate's experience and skills, especially technical skills that are relevant to the role.
After you finish asking the question, the candidate will respond to your question.
After you finish the interview, you should say "Thank you for your time" to end the interview and then provide feedback to the candidate.

CHAT_HISTORY: {chat_history}

Now given the following resume information: {resume_info}
Along with the job description of this role: {job_description}

Start the interview by asking the candidate the first question.
"""

ANALYSIS_SYSTEM_PROMPT = SystemMessagePromptTemplate.from_template(
    prompt.INTERVIEW_PROMPT
)

ANALYSIS_HUMAN_PROMPT = HumanMessagePromptTemplate.from_template(
    """
    CHAT_HISTORY: {chat_history}

    Now given the following resume information: {resume_info}
    Along with the job description of this role: {job_description}

    Start the interview by asking the candidate the first question.
    """
)


class ThreadedGenerator:
    def __init__(self):
        self.queue = queue.Queue()

    def __iter__(self):
        return self

    def __next__(self):
        item = self.queue.get()
        if item is StopIteration:
            raise item
        return item

    def send(self, data):
        self.queue.put(data)

    def close(self):
        self.queue.put(StopIteration)


class ChainStreamHandler(StreamingStdOutCallbackHandler):
    def __init__(self, gen):
        super().__init__()
        self.gen = gen

    def on_llm_new_token(self, token: str, **kwargs):
        self.gen.send(token)


def llm_thread(g, prompt, chat_model):
    try:
        chat = ChatOpenAI(
            openai_api_key=Constants.OPENAI_API_KEY,
            verbose=True,
            streaming=True,
            callbacks=[ChainStreamHandler(g)],
            temperature=0.7,
        )
        chat([HumanMessage(content=prompt)])
    finally:
        g.close()


def chain(prompt):
    g = ThreadedGenerator()
    threading.Thread(target=llm_thread, args=(g, prompt, Constants.CHAT_MODEL)).start()
    return g


@router.post("/new_chat")
async def start_new_chat(user_id: str):
    pass


@router.post("/chat")
async def stream(prompt: str):
    return StreamingResponse(chain(prompt), media_type="text/event-stream")
