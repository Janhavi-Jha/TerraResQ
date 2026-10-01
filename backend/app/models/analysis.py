from sqlalchemy import Column, String, Integer, Text, JSON, Float, Enum
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
import enum
from app.database.base import BaseModel

class AnalysisType(str, enum.Enum):
    SINGLE_IMAGE = "single_image"
    OPTICAL_SAR = "optical_sar"
    CHANGE_DETECTION = "change_detection"
    OBJECT_DETECTION = "object_detection"
    VQA = "vqa"
    SEGMENTATION = "segmentation"
    CUSTOM = "custom"

class AnalysisStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class Analysis(BaseModel):
    __tablename__ = "analyses"
    
    query = Column(Text, nullable=False)
    analysis_type = Column(Enum(AnalysisType), nullable=False)
    status = Column(Enum(AnalysisStatus), default=AnalysisStatus.PENDING)
    
    # Relationships
    images = relationship("UploadedImage", back_populates="analysis", cascade="all, delete-orphan")
    result = relationship("AnalysisResult", back_populates="analysis", uselist=False, cascade="all, delete-orphan")
    
    # Metadata
    processing_time = Column(Float)
    model_used = Column(String(255))
    error_message = Column(Text)