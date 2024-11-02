# -*- coding: utf-8 -*-
from pydantic import BaseModel, EmailStr
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
from dotenv import load_dotenv
import os

# Load environment variables from the .env file
load_dotenv(os.path.join(os.path.dirname(__file__), ".env.local"))


class EmailSchema(BaseModel):
    to: str
    subject: str
    body: str


def send_email(to_addresses, subject, body):
    from_email = "hello.aceresume@gmail.com"
    email_password = "jndwyqdpgllcpzpx"

    message = MIMEMultipart()
    message["From"] = from_email
    message["To"] = to_addresses
    message["Subject"] = subject

    # accept html or plain text
    if "<html>" in body:
        message.attach(MIMEText(body, "html"))
    else:
        message.attach(MIMEText(body, "plain"))

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(from_email, email_password)
        server.sendmail(from_email, to_addresses, message.as_string())
