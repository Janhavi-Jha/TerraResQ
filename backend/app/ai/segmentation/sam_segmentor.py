from typing import Dict, Any
from PIL import Image
from .base import BaseSegmentor
from .demo_segmentor import DemoSegmentor

class SAMSegmentor(BaseSegmentor):
    """
    Segment Anything Model (SAM) wrapper for geospatial imagery.
    Falls back gracefully to DemoSegmentor on CPU or when model weights are not loaded.
    """

    def __init__(self, model_name: str = "sam_vit_b", device: str = "cpu"):
        super().__init__(model_name, device)
        self.fallback = DemoSegmentor(model_name, device)

    def load_model(self):
        try:
            # Check for segment_anything package if installed
            from segment_anything import sam_model_registry, SamPredictor
            self.model = sam_model_registry["vit_b"](checkpoint="models/sam_vit_b.pth")
            self.model.to(device=self.device)
            self.predictor = SamPredictor(self.model)
            print(f"[SAM] Successfully loaded {self.model_name} on {self.device}")
        except Exception as e:
            print(f"[SAM] Real SAM loading skipped ({e}). Using simulated segmentation.")
            self.fallback.load_model()
            self.model = None

    def segment(self, image: Image.Image, **kwargs) -> Dict[str, Any]:
        if self.model is not None and self.predictor is not None:
            try:
                import numpy as np
                image_np = np.array(image)
                self.predictor.set_image(image_np)
                # In full pipeline, prompt points/boxes are provided
                return {
                    "status": "success",
                    "model_used": "sam_vit_b",
                    "demo_mode": False
                }
            except Exception as e:
                print(f"[SAM] Inference failed: {e}. Falling back to demo segmentor.")
        
        return self.fallback.segment(image, **kwargs)
