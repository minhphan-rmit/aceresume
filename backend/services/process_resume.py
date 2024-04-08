# -*- coding: utf-8 -*-
from async_lru import alru_cache

import json

from langchain_core.prompts.chat import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
)

from langchain.schema import AIMessage, HumanMessage, SystemMessage

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

# EXTRACTION_SYSTEM_PROMPT = SystemMessagePromptTemplate.from_template(
#     prompt.EXTRACTION_PROMPT
# )
# EXTRACTION_HUMAN_PROMPT = HumanMessagePromptTemplate.from_template(
#     """
#     Now given this resume: {candidate_resume}

#     Extract the following information from the resume: <extraction json format>
#     """
# )
# EXTRACTION_PROMPT_TEMPLATE = ChatPromptTemplate.from_messages(
#     [EXTRACTION_SYSTEM_PROMPT, EXTRACTION_HUMAN_PROMPT]
# )


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
        ANALYSIS_PROMPT_TEMPLATE.format_prompt(candidate_resume=resume_info)
    )
    return response.content


def extract_info(resume_text: str):
    response = Constants.CHAT_MODEL.invoke(
        [
            SystemMessage(content="You are a senior recruiter."),
            HumanMessage(content=prompt_to_parse_cv(resume=resume_text)),
        ]
    )
    parsed_cv = post_parse_cv(response.content)
    parsed_cv = json.loads(parsed_cv)

    print(parsed_cv)


def prompt_to_parse_cv(resume, example, template):
    prompt = f"""
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
    return prompt


def post_parse_cv(output):
    start = output.find("{")
    end = output.rfind("}") + 1
    return output[start:end]
