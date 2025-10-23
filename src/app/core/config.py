"""
Configurações da aplicação
"""

from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # API
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "PUCHOO AI"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://3dhkilcmqllj.manus.space",
        "https://*.manus.space"
    ]
    
    # Database
    DATABASE_URL: str = "postgresql://puchoo:puchoo123@localhost:5432/puchoo_db"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # AWS (para reconhecimento facial)
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_REGION: str = "us-east-1"
    
    # eSocial
    ESOCIAL_AMBIENTE: str = "producao-restrita"
    ESOCIAL_CERTIFICADO_PATH: str = ""
    
    # Banco (para integração bancária)
    BANK_CLIENT_ID: str = ""
    BANK_CLIENT_SECRET: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

