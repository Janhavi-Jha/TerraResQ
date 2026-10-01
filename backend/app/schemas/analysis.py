from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class AnalysisTypeEnum(str, Enum):
    SINGLE_IMAGE = "single_image"
    OPTICAL_SAR = "optical_sar"
    CHANGE_DETECTION = "change_detection"
    OBJECT_DETECTION = "object_detection"
    VQA = "vqa"
    SEGMENTATION = "segmentation"
    CUSTOM = "custom"

class AnalysisStatusEnum(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class AnalysisRequest(BaseModel):
    query: str = Field(..., min_length=5, max_length=1000)
    analysis_type: AnalysisTypeEnum
    
class ImageMetadata(BaseModel):
    filename: str
    file_size: int
    width: Optional[int] = None
    height: Optional[int] = None
    bands: Optional[int] = None
    is_geotiff: bool = False
    crs: Optional[str] = None
    bounds: Optional[List[float]] = None

class DetectedObject(BaseModel):
    label: str
    confidence: float
    bbox: List[float]  # [x1, y1, x2, y2]
    
class DetectedChange(BaseModel):
    region_id: int
    change_type: str
    description: str
    area: Optional[float] = None
    confidence: float

class AnalysisResultSchema(BaseModel):
    answer: str
    confidence: Optional[float] = None
    visual_evidence: Optional[List[str]] = None
    detected_objects: Optional[List[DetectedObject]] = None
    detected_changes: Optional[List[DetectedChange]] = None
    statistics: Optional[Dict[str, Any]] = None
    explanation: Optional[str] = None
    model_used: Optional[str] = "TerraResQ AI"
    
class AnalysisResponse(BaseModel):
    id: int
    query: str
    analysis_type: AnalysisTypeEnum
    status: AnalysisStatusEnum
    created_at: datetime
    processing_time: Optional[float] = None
    result: Optional[AnalysisResultSchema] = None
    error_message: Optional[str] = None
    
    class Config:
        from_attributes = True