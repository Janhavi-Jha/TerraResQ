from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.analysis import Analysis
from app.schemas.analysis import AnalysisResponse

router = APIRouter()

@router.get("/history", response_model=List[AnalysisResponse])
def get_analysis_history(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """
    Get analysis history.
    """
    analyses = db.query(Analysis).order_by(Analysis.created_at.desc()).offset(skip).limit(limit).all()
    
    response = []
    for analysis in analyses:
        result_data = None
        if analysis.result:
            result_data = {
                "answer": analysis.result.answer,
                "confidence": analysis.result.confidence,
                "model_used": analysis.result.model_reasoning or analysis.model_used or "TerraResQ AI"
            }
        
        response.append(AnalysisResponse(
            id=analysis.id,
            query=analysis.query,
            analysis_type=analysis.analysis_type,
            status=analysis.status,
            created_at=analysis.created_at,
            processing_time=analysis.processing_time,
            result=result_data
        ))
    
    return response

@router.delete("/history/{analysis_id}")
def delete_analysis(analysis_id: int, db: Session = Depends(get_db)):
    """
    Delete an analysis and associated files.
    """
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    # Delete from database (cascade will handle related records)
    db.delete(analysis)
    db.commit()
    
    return {"message": "Analysis deleted successfully"}