# -*- coding: utf-8 -*-
import logging
import threading
import queue

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain_openai import ChatOpenAI
from langchain_core.prompts.chat import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
)
from langchain_core.prompts import MessagesPlaceholder
from langchain.memory import ChatMessageHistory
from constant import Constants
from models import prompt

MODULE_NAME = "Chat Interview"

router = APIRouter(prefix="/api/aceresume/chat-interview", tags=[MODULE_NAME])

logger = logging.getLogger(MODULE_NAME)

CHATBOT_AVAILABLE = []

INTERVIEW_SYSTEM_PROMPT = SystemMessagePromptTemplate.from_template(
    prompt.INTERVIEW_PROMPT
)

INTERVIEW_HUMAN_PROMPT = HumanMessagePromptTemplate.from_template(
    """
    CHAT_HISTORY: {chat_history}
    Now given the following resume information: {resume_info}
    Along with the job description of this role: {job_description}
    And the role that the candidate are practice to interview: {role}
    Start the interview by asking the candidate the first question.
    Candidate answer question: {candidate_answer}
    """
)

REVIEW_SYSTEM_PROMPT = SystemMessagePromptTemplate.from_template(
    prompt.REVIEWER_INTERVIEW_PROMPT
)

REVIEW_HUMAN_PROMPT = HumanMessagePromptTemplate.from_template(
    """
    Now given the chat history between the Interviewer and the Candidate: {chat_history}
    And the resume information: {resume_info}
    Along with the job description of this role: {job_description}
    And the role that the candidate are practice to interview: {role}
    Start reviewing the candidate's interview performance: <your review here>
    """
)

INTRO_MESSAGE = "Hi ! Welcome to the interview for the role {role}. My name is Tanya and I will be your interviewer today. I will ask you a series of questions to get to know you better. Let's get started!"


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


def chat_history_form(chat_history: list[dict]):
    chat_list = []
    for value in chat_history:
        for key, message in value.items():
            chat_list.append(f"{key}: {message}")

    return " | ".join(chat_list)


def llm_thread(g, prompt, chat_history, resume_info, role, job_description, input_type):
    try:
        chat_history = chat_history_form(chat_history)

        if input_type == "interview":
            PROMPT_FORMAT = ChatPromptTemplate.from_messages(
                [INTERVIEW_SYSTEM_PROMPT, INTERVIEW_HUMAN_PROMPT]
            )

            PROMPT_FORMAT = PROMPT_FORMAT.format_prompt(
                resume_info=resume_info,
                job_description=job_description,
                role=role,
                candidate_answer=prompt,
                chat_history=chat_history,
            )

        elif input_type == "review":
            PROMPT_FORMAT = ChatPromptTemplate.from_messages(
                [REVIEW_SYSTEM_PROMPT, REVIEW_HUMAN_PROMPT]
            )

            PROMPT_FORMAT = PROMPT_FORMAT.format_prompt(
                resume_info=resume_info,
                job_description=job_description,
                role=role,
                chat_history=chat_history,
            )

        chat = ChatOpenAI(
            model_name="gpt-4-turbo",
            openai_api_key=Constants.OPENAI_API_KEY,
            verbose=True,
            streaming=True,
            callbacks=[ChainStreamHandler(g)],
            temperature=0.4,
            frequency_penalty=0.5,
            presence_penalty=0.5,
        )

        chat.invoke(PROMPT_FORMAT)
    finally:
        g.close()


def chain(prompt, chat_history, resume_info, role, job_description, input_type):
    g = ThreadedGenerator()
    threading.Thread(
        target=llm_thread,
        args=(g, prompt, chat_history, resume_info, role, job_description, input_type),
    ).start()
    return g


@router.post("/new_chat/{user_id}/{role}")
async def start_new_chat(user_id: str, role: str):
    CHATBOT_AVAILABLE.append({user_id: {"AI": INTRO_MESSAGE.format(role=role)}})

    return INTRO_MESSAGE.format(role=role)


@router.post("/chat/{user_id}/{role}")
async def stream(user_id: str, message: str, role: str, job_description: str):
    # TODO: Use User ID to find Resume Information
    resume_info = None
    chat_history = [value[user_id] for value in CHATBOT_AVAILABLE if user_id in value]
    if len(chat_history) == 0:
        return HTTPException(status_code=404, detail="No chat history found")

    chat_history.append({"User": message})
    output = StreamingResponse(
        chain(message, chat_history, resume_info, role, job_description, "interview"),
        media_type="text/event-stream",
    )

    chat_history.append({"AI": output})

    return output


@router.post("/review/{user_id}/{role}")
async def review_interview(user_id: str, role: str, job_description: str):
    # TODO: Use User ID to find Resume Information
    resume_info = None

    chat_history = [value[user_id] for value in CHATBOT_AVAILABLE if user_id in value]
    if len(chat_history) == 0:
        return HTTPException(status_code=404, detail="No chat history found")

    return StreamingResponse(
        chain(None, chat_history, resume_info, role, job_description, "review"),
        media_type="text/event-stream",
    )
