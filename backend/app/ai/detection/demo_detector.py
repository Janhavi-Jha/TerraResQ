from typing import Dict, Any, List
from PIL import Image
import random
import numpy as np
from .base import BaseDetector

class DemoDetector(BaseDetector):
    """
    Demo object detector that generates realistic detection results.
    """
    
    def __init__(self, model_name: str = "demo-yolo", device: str = "cpu"):
        super().__init__(model_name, device)
        
        self.classes = ["building", "road", "vehicle", "vegetation", "water", "agricultural_field"]
    
    def load_model(self):
        """No model loading required for demo mode."""
        print("[DEMO MODE] Object detector loaded (simulation)")
    
    def detect(self, image: Image.Image, confidence_threshold: float = 0.5) -> Dict[str, Any]:
        """Generate demo detection results."""
        width, height = image.size
        
        # Generate random detections
        num_objects = random.randint(5, 25)
        detections = []
        
        for _ in range(num_objects):
            cls = random.choice(self.classes)
            conf = random.uniform(0.6, 0.95)
            
            # Generate random bbox ensuring it's within image bounds
            x1 = random.uniform(0, width * 0.7)
            y1 = random.uniform(0, height * 0.7)
            x2 = x1 + random.uniform(width * 0.05, width * 0.25)
            y2 = y1 + random.uniform(height * 0.05, height * 0.25)
            
            # Clamp to image boundaries
            x2 = min(x2, width)
            y2 = min(y2, height)
            
            if conf >= confidence_threshold:
                detections.append({
                    "label": cls,
                    "confidence": round(conf, 3),
                    "bbox": [int(x1), int(y1), int(x2), int(y2)]
                })
        
        # Count objects by class
        class_counts = {}
        for det in detections:
            cls = det["label"]
            class_counts[cls] = class_counts.get(cls, 0) + 1
        
        return {
            "detections": detections,
            "num_detections": len(detections),
            "class_counts": class_counts,
            "model_used": "demo-yolo",
            "demo_mode": True
        }