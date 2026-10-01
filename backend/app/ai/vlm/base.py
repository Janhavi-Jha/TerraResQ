from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from PIL import Image

class BaseVLM(ABC):
    """
    Abstract base class for Vision-Language Models.
    All VLM implementations must inherit from this class.
    """
    
    def __init__(self, model_name: str, device: str = "cpu"):
        self.model_name = model_name
        self.device = device
        self.model = None
        self.processor = None
    
    @abstractmethod
    def load_model(self):
        """Load the model and processor."""
        pass
    
    @abstractmethod
    def analyze(
        self,
        image: Image.Image,
        query: str,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Analyze an image with a natural language query.
        
        Args:
            image: PIL Image object
            query: Natural language question
            
        Returns:
            Dictionary containing answer, confidence, and metadata
        """
        pass
    
    @abstractmethod
    def analyze_multi_image(
        self,
        images: List[Image.Image],
        query: str,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Analyze multiple images with a natural language query.
        
        Args:
            images: List of PIL Image objects
            query: Natural language question
            
        Returns:
            Dictionary containing answer, confidence, and metadata
        """
        pass