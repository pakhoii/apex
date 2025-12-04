from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    ALGORITHM: str
    REFRESH_TOKEN_EXPIRE_MINUTES: int
    PENDING_AUTH_TOKEN_EXPIRE_MINUTES: int
    
    # App settings
    APP_NAME: str
    APP_ENV: str

    # Mail settings
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_PORT: int
    MAIL_SERVER: str
    MAIL_STARTTLS: bool
    MAIL_SSL_TLS: bool
    
    # Redis settings
    REDIS_HOST: str
    REDIS_PORT: int
    REDIS_URL: str
    
    # OTP settings
    OTP_EXPIRATION_SECONDS: int
    OTP_SECRET_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()