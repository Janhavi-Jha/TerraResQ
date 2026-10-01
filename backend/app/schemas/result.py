from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from app.schemas.analysis import (
    DetectedObject,
    DetectedChange,
    AnalysisResultSchema,
    AnalysisResponse,
)

class ResultStatistics(BaseModel):
    total_objects: Optional[int] = None
    class_counts: Optional[Dict[str, int]] = None
    total_pixels: Optional[int] = None
    changed_pixels: Optional[int] = None
    unchanged_pixels: Optional[int] = None

class AnalysisDetailResult(BaseModel):
    answer: str
    confidence: Optional[float] = None
    visual_evidence: Optional[List[str]] = None
    detected_objects: Optional[List[DetectedObject]] = None
    detected_changes: Optional[List[DetectedChange]] = None
    statistics: Optional[Dict[str, Any]] = None
    explanation: Optional[str] = None
    model_used: Optional[str] = "TerraResQ AI"

__all__ = [
    "DetectedObject",
    "DetectedChange",
    "AnalysisResultSchema",
    "AnalysisResponse",
    "ResultStatistics",
    "AnalysisDetailResult",
]
