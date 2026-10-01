from sqlalchemy import Column, String, Integer, ForeignKey, Text, JSON, Float
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from app.database.base import BaseModel

class AnalysisResult(BaseModel):
    __tablename__ = "analysis_results"
    
    analysis_id = Column(Integer, ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False, unique=True)
    
    # AI Response
    answer = Column(Text, nullable=False)
    confidence = Column(Float)
    
    # Visual Evidence
    visual_evidence = Column(JSON)  # Paths to annotated images, masks, etc.
    
    # Detected Objects/Changes
    detected_objects = Column(JSON)  # List of detected objects with bounding boxes
    detected_changes = Column(JSON)  # List of detected changes
    change_regions = Column(JSON)  # GeoJSON of change regions
    
    # Segmentation
    segmentation_masks = Column(JSON)  # Paths to segmentation masks
    
    # Statistics
    statistics = Column(JSON)  # Area calculations, counts, percentages
    
    # Explanation
    explanation = Column(Text)
    model_reasoning = Column(Text)
    
    # Geospatial results
    result_geometry = Column(Geometry('GEOMETRYCOLLECTION', srid=4326))
    
    # Relationship
    analysis = relationship("Analysis", back_populates="result")