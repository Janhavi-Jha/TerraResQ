from typing import Dict, Any, List
from PIL import Image
import random
import numpy as np
from .base import BaseChangeDetector

class DemoChangeDetector(BaseChangeDetector):
    """
    Demo change detector for temporal analysis.
    """
    
    def __init__(self, model_name: str = "demo-change-detector", device: str = "cpu"):
        super().__init__(model_name, device)
        
        self.change_types = [
            "new_construction",
            "vegetation_loss",
            "vegetation_gain",
            "road_expansion",
            "water_body_change",
            "land_use_change"
        ]
    
    def load_model(self):
        """No model loading required for demo mode."""
        print("[DEMO MODE] Change detector loaded (simulation)")
    
    def detect_changes(
        self,
        image_before: Image.Image,
        image_after: Image.Image,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate demo change detection results."""
        
        width, height = image_before.size
        
        # Generate random change regions
        num_changes = random.randint(3, 12)
        changes = []
        
        for i in range(num_changes):
            change_type = random.choice(self.change_types)
            confidence = random.uniform(0.65, 0.92)
            
            # Generate random polygon region (simplified as bbox)
            x1 = random.uniform(0, width * 0.6)
            y1 = random.uniform(0, height * 0.6)
            x2 = x1 + random.uniform(width * 0.1, width * 0.3)
            y2 = y1 + random.uniform(height * 0.1, height * 0.3)
            
            area_pixels = (x2 - x1) * (y2 - y1)
            
            changes.append({
                "region_id": i + 1,
                "change_type": change_type,
                "description": self._get_change_description(change_type),
                "confidence": round(confidence, 3),
                "bbox": [int(x1), int(y1), int(x2), int(y2)],
                "area_pixels": int(area_pixels)
            })
        
        # Calculate overall statistics
        total_changed_pixels = sum(c["area_pixels"] for c in changes)
        total_pixels = width * height
        change_percentage = (total_changed_pixels / total_pixels) * 100
        
        return {
            "changes": changes,
            "num_changes": len(changes),
            "total_change_percentage": round(change_percentage, 2),
            "statistics": {
                "total_pixels": total_pixels,
                "changed_pixels": total_changed_pixels,
                "unchanged_pixels": total_pixels - total_changed_pixels
            },
            "model_used": "demo-change-detector",
            "demo_mode": True
        }
    
    def _get_change_description(self, change_type: str) -> str:
        """Generate human-readable descriptions for change types."""
        descriptions = {
            "new_construction": "New building or infrastructure development detected",
            "vegetation_loss": "Reduction in vegetation coverage observed",
            "vegetation_gain": "Increase in vegetation or reforestation detected",
            "road_expansion": "Expansion of road network identified",
            "water_body_change": "Modification in water body extent or appearance",
            "land_use_change": "Transformation in land use classification"
        }
        return descriptions.get(change_type, "Unspecified change detected")