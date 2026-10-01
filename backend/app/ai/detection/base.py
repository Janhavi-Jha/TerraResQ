from abc import ABC, abstractmethod
from typing import Dict, Any
from PIL import Image

class BaseDetector(ABC):
    """Base class for object detection models."""
    
    def __init__(self, model_name: str, device: str = "cpu"):
        self.model_name = model_name
        self.device = device
        self.model = None
    
    @abstractmethod
    def load_model(self):
        """Load the detection model."""
        pass
    
    @abstractmethod
    def detect(self, image: Image.Image, confidence_threshold: float = 0.5) -> Dict[str, Any]:
        """
        Perform object detection on an image.
        
        Returns:
            Dictionary with detections, bboxes, labels, and confidences
        """
        pass