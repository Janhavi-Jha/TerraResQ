import os
import uuid
import shutil
from typing import Optional, Dict, Any
from fastapi import UploadFile, HTTPException
from PIL import Image
import magic
from app.core.config import settings
from app.geospatial.geotiff_handler import GeoTiffHandler

class FileService:
    """
    Service for handling file uploads and validation.
    """
    
    ALLOWED_MIME_TYPES = {
        "image/png",
        "image/jpeg",
        "image/tiff",
        "image/geotiff",
        "image/x-tiff",
    }
    
    @staticmethod
    async def save_upload_file(file: UploadFile, analysis_id: int) -> Dict[str, Any]:
        """
        Save uploaded file and extract metadata.
        
        Args:
            file: FastAPI UploadFile object
            analysis_id: ID of the associated analysis
            
        Returns:
            Dictionary with file information and metadata
        """
        # Validate file
        FileService._validate_file(file)
        
        # Generate unique filename
        file_ext = os.path.splitext(file.filename)[1].lower()
        unique_filename = f"{analysis_id}_{uuid.uuid4()}{file_ext}"
        
        # Create analysis-specific directory
        upload_dir = os.path.join(settings.UPLOAD_DIR, str(analysis_id))
        os.makedirs(upload_dir, exist_ok=True)
        
        file_path = os.path.join(upload_dir, unique_filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Get file size
        file_size = os.path.getsize(file_path)
        
        # Detect MIME type
        mime = magic.Magic(mime=True)
        mime_type = mime.from_file(file_path)
        
        # Extract image metadata
        metadata = FileService._extract_metadata(file_path, file_ext)
        
        return {
            "filename": unique_filename,
            "original_filename": file.filename,
            "file_path": file_path,
            "file_size": file_size,
            "mime_type": mime_type,
            **metadata
        }
    
    @staticmethod
    def _validate_file(file: UploadFile):
        """Validate uploaded file."""
        # Check file extension
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in settings.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"File type {file_ext} not allowed. Allowed types: {', '.join(settings.ALLOWED_EXTENSIONS)}"
            )
        
        # Note: Size validation happens during upload with FastAPI's max_size parameter
    
    @staticmethod
    def _extract_metadata(file_path: str, file_ext: str) -> Dict[str, Any]:
        """Extract image metadata."""
        metadata = {}
        
        # Check if GeoTIFF
        if file_ext in [".tif", ".tiff"]:
            try:
                geotiff_meta = GeoTiffHandler.read_geotiff_metadata(file_path)
                if geotiff_meta.get("is_geotiff"):
                    metadata.update(geotiff_meta)
                    return metadata
            except Exception:
                pass
        
        # Standard image metadata
        try:
            with Image.open(file_path) as img:
                metadata["width"] = img.width
                metadata["height"] = img.height
                metadata["bands"] = len(img.getbands()) if hasattr(img, 'getbands') else 3
                metadata["is_geotiff"] = False
        except Exception as e:
            metadata["error"] = str(e)
        
        return metadata
    
    @staticmethod
    def load_image(file_path: str) -> Image.Image:
        """
        Load image file as PIL Image.
        
        Args:
            file_path: Path to image file
            
        Returns:
            PIL Image object
        """
        file_ext = os.path.splitext(file_path)[1].lower()
        
        # Handle GeoTIFF
        if file_ext in [".tif", ".tiff"]:
            try:
                return GeoTiffHandler.geotiff_to_image(file_path)
            except Exception:
                # Fallback to PIL
                pass
        
        # Standard image loading
        return Image.open(file_path)
    
    @staticmethod
    def cleanup_analysis_files(analysis_id: int):
        """
        Delete all files associated with an analysis.
        
        Args:
            analysis_id: ID of the analysis
        """
        upload_dir = os.path.join(settings.UPLOAD_DIR, str(analysis_id))
        if os.path.exists(upload_dir):
            shutil.rmtree(upload_dir)