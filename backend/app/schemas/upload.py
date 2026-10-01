from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class UploadedFileInfo(BaseModel):
    filename: str
    original_filename: str
    file_path: str
    file_size: int
    mime_type: str
    width: Optional[int] = None
    height: Optional[int] = None
    bands: Optional[int] = None
    is_geotiff: bool = False
    crs: Optional[str] = None
    bounds: Optional[List[float]] = None
    transform: Optional[List[float]] = None

class UploadResponse(BaseModel):
    message: str
    files: List[UploadedFileInfo]

__all__ = ["UploadedFileInfo", "UploadResponse"]
