from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database - default for development
    DATABASE_URL: str = "mysql+pymysql://apex:iloveanime@localhost:3307/apex"
    
    # JWT settings
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 10080
    PENDING_AUTH_TOKEN_EXPIRE_MINUTES: int = 5
    
    # App settings
    APP_NAME: str = "Apex Backend"
    APP_ENV: str = "development"

    # Mail settings - user needs to configure for email functionality
    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_FROM: str = ""
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    
    # Redis settings
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # OTP settings
    OTP_EXPIRATION_SECONDS: int = 300
    OTP_SECRET_KEY: str = "dev-otp-secret-change-in-production"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()