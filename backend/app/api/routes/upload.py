from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.services.file_service import FileService
from app.core.config import settings

router = APIRouter()

@router.post("/upload")
async def upload_images(
    files: List[UploadFile] = File(...),
    analysis_id: int = None,
    db: Session = Depends(get_db)
):
    """
    Upload satellite images.
    
    Maximum file size: 100MB per file
    Supported formats: PNG, JPG, JPEG, TIFF, GeoTIFF
    """
    if len(files) > 5:
        raise HTTPException(status_code=400, detail="Maximum 5 files allowed per upload")
    
    uploaded_files = []
    
    for file in files:
        # Validate file size
        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)
        
        if file_size > settings.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File {file.filename} exceeds maximum size of {settings.MAX_FILE_SIZE} bytes"
            )
        
        # Save file
        try:
            file_info = await FileService.save_upload_file(file, analysis_id or 0)
            uploaded_files.append(file_info)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error uploading {file.filename}: {str(e)}")
    
    return {
        "message": f"Successfully uploaded {len(uploaded_files)} file(s)",
        "files": uploaded_files
    }