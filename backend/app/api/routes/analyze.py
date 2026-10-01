from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from app.database.session import get_db
from app.schemas.analysis import AnalysisRequest, AnalysisResponse, AnalysisTypeEnum
from app.services.analysis_service import AnalysisService
from app.services.file_service import FileService
from app.models.analysis import Analysis, AnalysisStatus
from app.models.analysis_result import AnalysisResult
from app.models.uploaded_image import UploadedImage
import json
import os

router = APIRouter()
analysis_service = AnalysisService()

class AnalyzeRequest(BaseModel):
    query: str
    file_paths: List[str]
    analysis_type: Optional[AnalysisTypeEnum] = None

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_images(
    request: AnalyzeRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Analyze uploaded satellite images with natural language query.
    """
    # Create analysis record
    analysis = Analysis(
        query=request.query,
        analysis_type=request.analysis_type or AnalysisTypeEnum.CUSTOM,
        status=AnalysisStatus.PROCESSING
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    
    try:
        # Load images
        images = []
        for idx, file_path in enumerate(request.file_paths):
            try:
                img = FileService.load_image(file_path)
                images.append(img)
                
                # Create image record
                base_name = os.path.basename(file_path)
                file_size = os.path.getsize(file_path) if os.path.exists(file_path) else 0
                uploaded_img = UploadedImage(
                    analysis_id=analysis.id,
                    filename=base_name,
                    original_filename=base_name,
                    file_path=file_path,
                    file_size=file_size,
                    mime_type="image/png" if file_path.lower().endswith(".png") else "image/jpeg",
                    width=img.width,
                    height=img.height,
                    bands=len(img.getbands()) if hasattr(img, 'getbands') else 3,
                    image_order=idx
                )
                db.add(uploaded_img)
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Error loading image {file_path}: {str(e)}")
        
        db.commit()
        
        # Perform analysis
        result = await analysis_service.analyze(
            images,
            request.query,
            request.analysis_type.value if request.analysis_type else None
        )
        
        # Save result
        analysis_result = AnalysisResult(
            analysis_id=analysis.id,
            answer=result["answer"],
            confidence=result.get("confidence"),
            detected_objects=result.get("detected_objects"),
            detected_changes=result.get("detected_changes"),
            statistics=result.get("statistics"),
            explanation=result.get("explanation", ""),
            model_reasoning=result.get("model_used", "")
        )
        db.add(analysis_result)
        
        # Update analysis
        analysis.status = AnalysisStatus.COMPLETED
        analysis.processing_time = result.get("processing_time")
        analysis.model_used = result.get("model_used", "")
        
        db.commit()
        db.refresh(analysis)
        
        # Build response
        return AnalysisResponse(
            id=analysis.id,
            query=analysis.query,
            analysis_type=analysis.analysis_type,
            status=analysis.status,
            created_at=analysis.created_at,
            processing_time=analysis.processing_time,
            result={
                "answer": result["answer"],
                "confidence": result.get("confidence"),
                "detected_objects": result.get("detected_objects"),
                "detected_changes": result.get("detected_changes"),
                "statistics": result.get("statistics"),
                "explanation": result.get("explanation"),
                "model_used": result.get("model_used") or "TerraResQ AI"
            }
        )
        
    except Exception as e:
        analysis.status = AnalysisStatus.FAILED
        analysis.error_message = str(e)
        db.commit()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.get("/analyze/{analysis_id}", response_model=AnalysisResponse)
def get_analysis(analysis_id: int, db: Session = Depends(get_db)):
    """
    Get analysis by ID.
    """
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    result_data = None
    if analysis.result:
        result_data = {
            "answer": analysis.result.answer,
            "confidence": analysis.result.confidence,
            "detected_objects": analysis.result.detected_objects,
            "detected_changes": analysis.result.detected_changes,
            "statistics": analysis.result.statistics,
            "explanation": analysis.result.explanation,
            "model_used": analysis.result.model_reasoning or analysis.model_used or "TerraResQ AI"
        }
    
    return AnalysisResponse(
        id=analysis.id,
        query=analysis.query,
        analysis_type=analysis.analysis_type,
        status=analysis.status,
        created_at=analysis.created_at,
        processing_time=analysis.processing_time,
        result=result_data,
        error_message=analysis.error_message
    )