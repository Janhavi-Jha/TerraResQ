from abc import ABC, abstractmethod
from typing import Dict, Any
from PIL import Image

class BaseChangeDetector(ABC):
    """Base class for change detection models."""
    
    def __init__(self, model_name: str, device: str = "cpu"):
        self.model_name = model_name
        self.device = device
        self.model = None
    
    @abstractmethod
    def load_model(self):
        """Load the change detection model."""
        pass
    
    @abstractmethod
    def detect_changes(
        self,
        image_before: Image.Image,
        image_after: Image.Image,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Detect changes between two temporal images.
        
        Returns:
            Dictionary with change regions, statistics, and metadata
        """
        pass
