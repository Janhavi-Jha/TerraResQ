from typing import Dict, Any, List
from PIL import Image
import random
from .base import BaseSegmentor

class DemoSegmentor(BaseSegmentor):
    """
    Demo segmentor simulating land cover / feature segmentation for remote sensing.
    """

    def __init__(self, model_name: str = "demo-sam", device: str = "cpu"):
        super().__init__(model_name, device)
        self.classes = ["water", "vegetation", "built_up", "bare_soil", "roads"]

    def load_model(self):
        print("[DEMO MODE] Segmentation model loaded (simulation)")

    def segment(self, image: Image.Image, **kwargs) -> Dict[str, Any]:
        width, height = image.size
        total_pixels = width * height

        # Generate realistic distribution of land cover
        water_pct = random.uniform(5.0, 18.0)
        veg_pct = random.uniform(30.0, 55.0)
        built_pct = random.uniform(15.0, 35.0)
        soil_pct = max(0.0, 100.0 - (water_pct + veg_pct + built_pct))

        segments = [
            {"class_name": "water", "percentage": round(water_pct, 1), "pixel_count": int(total_pixels * (water_pct / 100))},
            {"class_name": "vegetation", "percentage": round(veg_pct, 1), "pixel_count": int(total_pixels * (veg_pct / 100))},
            {"class_name": "built_up", "percentage": round(built_pct, 1), "pixel_count": int(total_pixels * (built_pct / 100))},
            {"class_name": "bare_soil", "percentage": round(soil_pct, 1), "pixel_count": int(total_pixels * (soil_pct / 100))},
        ]

        return {
            "segments": segments,
            "total_pixels": total_pixels,
            "dimensions": [width, height],
            "confidence": round(random.uniform(0.82, 0.94), 2),
            "model_used": "demo-sam-segmentor",
            "demo_mode": True,
        }
