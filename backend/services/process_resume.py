# -*- coding: utf-8 -*-
from async_lru import alru_cache

from langchain_core.documents import Document
from langchain_core.prompts.chat import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
)

from constant import Constants
from helpers.pdf_loader import load_doc as PDFLoader
from helpers.word_loader import load_doc as WordLoader
from models import prompt

ANALYSIS_SYSTEM_PROMPT = SystemMessagePromptTemplate.from_template(
    prompt.ANALYSE_PROMPT
)
ANALYSIS_HUMAN_PROMPT = HumanMessagePromptTemplate.from_template(
    """
    Now given this resume: {candidate_resume}

    Generate the analysis for the resume and return in a json format: "pros", "cons", "add-ons"
    """
)
ANALYSIS_PROMPT_TEMPLATE = ChatPromptTemplate.from_messages(
    [ANALYSIS_SYSTEM_PROMPT, ANALYSIS_HUMAN_PROMPT]
)


@alru_cache
async def process_resume(resume: bytes, filetype: str) -> str:
    if filetype == "docx":
        document = await WordLoader(resume)
    else:
        document = await PDFLoader(resume)

    return document


@alru_cache
async def analyse_resume(resume_info: str) -> str:
    response = await Constants.CHAT_MODEL.ainvoke(
        ANALYSIS_PROMPT_TEMPLATE.format_prompt(candidate_resume=" ".join(resume_info))
    )
    return response.content
