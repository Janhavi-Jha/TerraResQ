from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List, Union
import json
import os

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "TerraResQ"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    DEMO_MODE: bool = True
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Database
    DATABASE_URL: str = "postgresql://terraresq:terraresq_password@localhost:5432/terraresq"
    POSTGIS_VERSION: str = "3.4"
    
    # File Upload
    UPLOAD_DIR: str = "./data/uploads"
    MAX_FILE_SIZE: int = 104857600  # 100MB
    ALLOWED_EXTENSIONS: Union[List[str], str] = [".png", ".jpg", ".jpeg", ".tif", ".tiff"]
    
    # AI Models
    MODEL_NAME: str = "Qwen/Qwen2-VL-2B-Instruct"
    HF_TOKEN: str = ""
    GPU_ENABLED: bool = False
    MODEL_CACHE_DIR: str = "./models"
    DEVICE: str = "cpu"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    CORS_ORIGINS: Union[List[str], str] = ["http://localhost:5173", "http://localhost:3000"]
    
    # Processing
    MAX_WORKERS: int = 4
    TASK_TIMEOUT: int = 300

    @field_validator("CORS_ORIGINS", "ALLOWED_EXTENSIONS", mode="after")
    @classmethod
    def ensure_list(cls, v):
        if isinstance(v, str):
            v_trimmed = v.strip()
            if v_trimmed.startswith("[") and v_trimmed.endswith("]"):
                try:
                    return json.loads(v_trimmed)
                except Exception:
                    pass
            return [item.strip() for item in v_trimmed.split(",") if item.strip()]
        return v
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"

settings = Settings()

# Create necessary directories
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.MODEL_CACHE_DIR, exist_ok=True)
os.makedirs("./reports", exist_ok=True)