from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.analysis import Analysis
from app.services.report_service import ReportService

router = APIRouter()

@router.get("/reports/{analysis_id}/json")
def get_json_report(analysis_id: int, db: Session = Depends(get_db)):
    """Retrieve comprehensive JSON report for an analysis."""
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return ReportService.generate_json_report(analysis)

@router.get("/reports/{analysis_id}/markdown")
def get_markdown_report(analysis_id: int, db: Session = Depends(get_db)):
    """Retrieve formatted Markdown analysis summary."""
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    content = ReportService.generate_markdown_report(analysis)
    return Response(content=content, media_type="text/markdown")

@router.get("/reports/{analysis_id}/summary")
def get_report_summary(analysis_id: int, db: Session = Depends(get_db)):
    """Retrieve quick executive report summary."""
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    report = ReportService.generate_json_report(analysis)
    return {
        "analysis_id": analysis.id,
        "query": analysis.query,
        "status": analysis.status,
        "answer": analysis.result.answer if analysis.result else None,
        "confidence": analysis.result.confidence if analysis.result else None,
        "model_used": analysis.model_used,
    }
