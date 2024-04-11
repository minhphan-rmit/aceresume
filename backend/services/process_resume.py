# -*- coding: utf-8 -*-
from async_lru import alru_cache

import json

from langchain.schema import HumanMessage, SystemMessage
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

PROMPT = """
    resume:
    <begin>
    {resume}
    <end>

    example:
    <begin>
    {example}
    <end>

    template:
    <begin>
    {template}
    <end>

    You are a Senior Recruiter (SR) reading the resume.
    Parse the resume into the output json file, strictly following the example and template.
    Note: the field "responsibilities" should be copied exactly from the resume.
    Note: if the description is not provided, write a summary for the field description.

    Answer format:

    SR:
    <output json>
"""


def post_parse_cv(output: str) -> str:
    """
    Extracts the JSON data from the given output string.

    Args:
        output (str): The output string containing the JSON data.

    Returns:
        str: The extracted JSON data as a string.
    """
    start = output.find("{")
    end = output.rfind("}") + 1
    return output[start:end]


@alru_cache
async def process_resume(resume: bytes, filetype: str) -> str:
    """
    Process the given resume file and return the processed document.

    Args:
        resume (bytes): The resume file to be processed.
        filetype (str): The type of the resume file (e.g., "docx", "pdf").

    Returns:
        str: The processed document.
    """
    if filetype == "docx":
        document = await WordLoader(resume)
    else:
        document = await PDFLoader(resume)
    return document


@alru_cache
async def analyse_resume(resume_info: str) -> str:
    """
    Analyzes the given resume information using a chat model.

    Args:
        resume_info (str): The resume information to be analyzed.

    Returns:
        str: The response content from the chat model.
    """
    response = await Constants.CHAT_MODEL.ainvoke(
        ANALYSIS_PROMPT_TEMPLATE.format_prompt(candidate_resume=resume_info)
    )
    return response.content


@alru_cache
async def extract_resume(resume_info: str) -> str:
    """
    Extracts information from a resume using a chat model.

    Args:
        resume_info (str): The resume information to be processed.

    Returns:
        str: The extracted information from the resume.
    """
    parsed_cv = await Constants.CHAT_MODEL.ainvoke(
        [
            SystemMessage(content="You are a senior recruiter."),
            HumanMessage(
                PROMPT.format(
                    resume=resume_info,
                    example=prompt.EXTRACTION_EXAMPLE,
                    template=prompt.EXTRACTION_TEMPLATE,
                )
            ),
        ]
    )
    parsed_cv = post_parse_cv(parsed_cv.content)
    parsed_cv = json.loads(parsed_cv)

    return parsed_cv
