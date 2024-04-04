# -*- coding: utf-8 -*-
import asyncio
from typing import List
import io
import PyPDF2
from async_lru import alru_cache
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter

TEXT_SPLITTER = RecursiveCharacterTextSplitter(chunk_size=1500, chunk_overlap=100)


async def extract_text_from_page(page: PyPDF2.PageObject):
    """
    Extracts text from a page of the PDF document.

    Args:
        page: The `Page` object from `PyPDF2` from which to extract text.

    Returns:
        The extracted text.
    """
    return page.extract_text()


async def extract_text(parser: PyPDF2.PdfReader) -> str:
    """
    Extracts text from all pages of the given PDF parser synchronously.

    Args:
        parser: The PDF parser object from `PyPDF2`.

    Returns:
        str: The extracted text from all pages, joined by newline characters.

    """
    tasks = [asyncio.create_task(extract_text_from_page(page)) for page in parser.pages]

    document = await asyncio.gather(*tasks)

    return "\n".join(document)


async def load_doc(file_content: bytes) -> List[Document]:
    """
    Loads the document and splits it into chunks.

    Returns:
        List[Document]: A list of `Document` objects representing the chunks of the document.

    Raises:
        ValueError: Raised when the document is identified as a scanned PDF.
    """
    parser = PyPDF2.PdfReader(stream=io.BytesIO(file_content))

    document = await extract_text(parser)
    if not document:
        raise ValueError("Scanned PDF identified. Please upload a non-scanned PDF")

    return TEXT_SPLITTER.split_documents([Document(page_content=document)])
