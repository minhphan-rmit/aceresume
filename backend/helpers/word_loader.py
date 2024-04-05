# -*- coding: utf-8 -*-
from __future__ import annotations
from typing import List

import io
import re
import zipfile
from langchain_core.documents import Document

import xml.etree.ElementTree as ET


NAMESPACE_MAP = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}


def qn(tag) -> str:
    """
    Stands for 'qualified name', a utility function to turn a namespace
    prefixed tag name into a Clark-notation qualified tag name for lxml.
    """
    prefix, tagroot = tag.split(":")
    return "{{{}}}{}".format(NAMESPACE_MAP[prefix], tagroot)


def xml2text(xml) -> str:
    """
    Convert XML content to textual content, translating specific tags to their Python equivalent.
    """
    tag_translations = {
        qn("w:t"): lambda el: el.text or "",
        qn("w:tab"): lambda el: "\t",
        qn("w:br"): lambda el: "\n",
        qn("w:cr"): lambda el: "\n",
        qn("w:p"): lambda el: "\n\n",
    }

    root = ET.fromstring(xml)
    return "".join(
        tag_translations.get(child.tag, lambda el: "")(child) for child in root.iter()
    )


def process(document: bytes) -> str:
    """
    Processes a document and extracts the main text from a DOCX file.

    Args:
        document: The DOCX file to be processed.

    Returns:
        str: The extracted main text from the document.

    """
    # unzip the docx in memory
    with zipfile.ZipFile(document) as zip_file:
        file_set = set(zip_file.namelist())

        # compile regular expressions for faster matching
        header_re = re.compile("word/header[0-9]*.xml")
        footer_re = re.compile("word/footer[0-9]*.xml")

        # using generator expressions to minimize explicit for-loops
        headers = (
            xml2text(zip_file.read(fname))
            for fname in file_set
            if header_re.match(fname)
        )
        footers = (
            xml2text(zip_file.read(fname))
            for fname in file_set
            if footer_re.match(fname)
        )

        # get main text
        doc_xml_content = zip_file.read("word/document.xml")

        # concatenate texts
        text = "".join([*headers, xml2text(doc_xml_content), *footers])

    return text.strip()


async def load_doc(file_content: bytes) -> List[Document]:
    """
    Loads the document and processes it to create a list of `Document` objects.

    Returns:
        None

    Raises:
        ValueError: Raised when there is an error with the file.

    """
    document = process(io.BytesIO(file_content))

    return document
