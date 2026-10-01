from abc import ABC, abstractmethod
from typing import Dict, Any, List
from PIL import Image

class BaseMultimodalAnalyzer(ABC):
    """Base class for Optical and SAR (Synthetic Aperture Radar) fusion analysis."""

    def __init__(self, model_name: str, device: str = "cpu"):
        self.model_name = model_name
        self.device = device
        self.model = None

    @abstractmethod
    def load_model(self):
        """Load the fusion and analysis models."""
        pass

    @abstractmethod
    def analyze_fusion(
        self,
        optical_image: Image.Image,
        sar_image: Image.Image,
        query: str,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Perform joint analysis over co-registered Optical and SAR imagery.
        
        Returns:
            Dictionary with fused findings, penetration metrics, and confidence.
        """
        pass
