from abc import ABC, abstractmethod
from typing import Dict, Any, List
from PIL import Image

class BaseSegmentor(ABC):
    """Base class for satellite imagery segmentation models."""

    def __init__(self, model_name: str, device: str = "cpu"):
        self.model_name = model_name
        self.device = device
        self.model = None

    @abstractmethod
    def load_model(self):
        """Load the segmentation model."""
        pass

    @abstractmethod
    def segment(self, image: Image.Image, **kwargs) -> Dict[str, Any]:
        """
        Perform semantic / instance segmentation on satellite imagery.
        
        Returns:
            Dictionary containing masks, class polygons, and area metrics.
        """
        pass
