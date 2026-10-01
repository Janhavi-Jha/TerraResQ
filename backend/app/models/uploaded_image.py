from sqlalchemy import Column, String, Integer, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from app.database.base import BaseModel

class UploadedImage(BaseModel):
    __tablename__ = "uploaded_images"
    
    analysis_id = Column(Integer, ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False)
    
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(512), nullable=False)
    file_size = Column(Integer, nullable=False)
    mime_type = Column(String(100), nullable=False)
    
    # Image properties
    width = Column(Integer)
    height = Column(Integer)
    bands = Column(Integer)
    
    # Geospatial properties
    is_geotiff = Column(Boolean, default=False)
    crs = Column(String(255))
    bounds = Column(JSON)
    transform = Column(JSON)
    geometry = Column(Geometry('POLYGON', srid=4326))
    
    # Temporal
    image_order = Column(Integer, default=0)  # 0 for first/only image, 1 for second in temporal analysis
    
    # Relationship
    analysis = relationship("Analysis", back_populates="images")