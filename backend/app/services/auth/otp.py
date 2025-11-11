import redis.asyncio as redis
import secrets
import hmac
from dotenv import load_dotenv
import os

load_dotenv()

class OTPService:
    def __init__(self):
        redis_url = os.getenv("REDIS_URL")
        otp_exp = os.getenv("OTP_EXPIRATION_SECONDS")
        secret = os.getenv("OTP_SECRET_KEY")

        if not redis_url:
            raise ValueError("Missing REDIS_URL in .env")

        if not otp_exp:
            raise ValueError("Missing OTP_EXPIRATION_SECONDS in .env")

        if not secret:
            raise ValueError("Missing OTP_SECRET_KEY in .env")

        self.redis_client = redis.from_url(redis_url)
        self.otp_expiration = int(otp_exp)
        self.otp_secret_key = secret.encode()

    def _generate_key(self, user_id: str, purpose: str) -> str:
        return f"otp:{purpose}:{user_id}"

    async def create_otp(self, user_id: str) -> str:
        otp_code = "".join(secrets.choice("0123456789") for _ in range(6))
        key = self._generate_key(user_id, "login")

        await self.redis_client.set(key, otp_code, ex=self.otp_expiration)

        return otp_code

    async def verify_otp(self, user_id: str, otp_code: str) -> bool:
        key = self._generate_key(user_id, "login")
        stored_otp = await self.redis_client.get(key)

        if not stored_otp:
            return False

        if hmac.compare_digest(stored_otp.decode(), otp_code):
            await self.redis_client.delete(key)
            return True

        return False


otp_service = OTPService()
