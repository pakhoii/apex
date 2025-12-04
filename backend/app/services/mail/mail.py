from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
from typing import List
from dotenv import load_dotenv
import os

load_dotenv()

class MailService:
    conf = ConnectionConfig(
        MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
        MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
        MAIL_FROM=os.getenv("MAIL_FROM"),
        MAIL_PORT=int(os.getenv("MAIL_PORT")),
        MAIL_SERVER=os.getenv("MAIL_SERVER"),
        MAIL_STARTTLS=os.getenv("MAIL_STARTTLS") == "True",
        MAIL_SSL_TLS=os.getenv("MAIL_SSL_TLS") == "True",
        USE_CREDENTIALS=True,
    )

    @classmethod
    async def send_otp_email(cls, email: EmailStr, otp_code: str):
        message = MessageSchema(
            subject="APEX Login Verification Code",
            recipients=[email],
            body=f"Your OTP code is: {otp_code}, this code will expire in {os.getenv('OTP_EXPIRATION_SECONDS')} seconds.",
            subtype="plain"
        )
        
        try: 
            fm = FastMail(cls.conf)
            await fm.send_message(message)
        except Exception as e:
            print(f"Error sending email: {e}")
            return False
        
mail_service = MailService()