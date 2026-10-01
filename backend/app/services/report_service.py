import os
import json
from datetime import datetime
from typing import Dict, Any, Optional
from app.models.analysis import Analysis

class ReportService:
    """Service for compiling and generating analysis reports."""

    @staticmethod
    def generate_json_report(analysis: Analysis) -> Dict[str, Any]:
        """Compile a comprehensive JSON report for the analysis."""
        result_data = None
        if analysis.result:
            result_data = {
                "answer": analysis.result.answer,
                "confidence": analysis.result.confidence,
                "detected_objects": analysis.result.detected_objects,
                "detected_changes": analysis.result.detected_changes,
                "statistics": analysis.result.statistics,
                "explanation": analysis.result.explanation,
                "model_reasoning": analysis.result.model_reasoning,
            }

        images_data = []
        if analysis.images:
            for img in analysis.images:
                images_data.append({
                    "filename": img.filename,
                    "original_filename": img.original_filename,
                    "file_size": img.file_size,
                    "dimensions": f"{img.width}x{img.height}" if img.width else None,
                    "bands": img.bands,
                    "is_geotiff": img.is_geotiff,
                    "crs": img.crs,
                })

        return {
            "report_id": f"REP-{analysis.id}-{int(datetime.utcnow().timestamp())}",
            "generated_at": datetime.utcnow().isoformat(),
            "analysis_id": analysis.id,
            "query": analysis.query,
            "analysis_type": analysis.analysis_type,
            "status": analysis.status,
            "created_at": analysis.created_at.isoformat() if analysis.created_at else None,
            "processing_time_seconds": analysis.processing_time,
            "model_used": analysis.model_used,
            "result": result_data,
            "images": images_data,
        }

    @staticmethod
    def generate_markdown_report(analysis: Analysis) -> str:
        """Compile a formatted Markdown summary report."""
        res = analysis.result
        answer = res.answer if res else "No result available."
        confidence = f"{round(res.confidence * 100, 1)}%" if res and res.confidence else "N/A"
        model = analysis.model_used or (res.model_reasoning if res else "TerraResQ Engine")

        lines = [
            f"# TerraResQ Geospatial Analysis Report #{analysis.id}",
            f"**Generated:** {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}",
            "",
            "## 1. Executive Summary",
            f"- **Query:** {analysis.query}",
            f"- **Analysis Type:** {analysis.analysis_type}",
            f"- **Status:** {analysis.status}",
            f"- **Model / Engine:** {model}",
            f"- **Confidence Score:** {confidence}",
            f"- **Processing Time:** {analysis.processing_time or 'N/A'}s",
            "",
            "## 2. Findings & AI Interpretation",
            answer,
            "",
        ]

        if res and res.detected_objects:
            lines.append("## 3. Detected Objects")
            for idx, obj in enumerate(res.detected_objects, 1):
                label = obj.get("label", "Object")
                conf = round(obj.get("confidence", 0) * 100, 1)
                bbox = obj.get("bbox", [])
                lines.append(f"- **#{idx} {label.capitalize()}** — Confidence: {conf}% | Bounding Box: {bbox}")
            lines.append("")

        if res and res.detected_changes:
            lines.append("## 4. Surface Change Quantifications")
            for change in res.detected_changes:
                ctype = change.get("change_type", "General").replace("_", " ").title()
                desc = change.get("description", "")
                conf = round(change.get("confidence", 0) * 100, 1)
                lines.append(f"- **Region #{change.get('region_id')}: {ctype}** ({conf}%) — {desc}")
            lines.append("")

        lines.extend([
            "---",
            "*Report generated automatically by TerraResQ Remote Sensing AI Platform.*",
        ])

        return "\n".join(lines)
