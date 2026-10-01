from typing import Dict, Any
from PIL import Image
from .base import BaseDetector
from .demo_detector import DemoDetector

class YOLODetector(BaseDetector):
    """
    YOLO Object Detector for satellite imagery.
    Falls back gracefully to DemoDetector when weights or CUDA are not present.
    """

    def __init__(self, model_name: str = "yolov8m.pt", device: str = "cpu"):
        super().__init__(model_name, device)
        self.fallback = DemoDetector(model_name, device)

    def load_model(self):
        try:
            # Check if ultralytics is installed
            from ultralytics import YOLO
            self.model = YOLO(self.model_name)
            print(f"[YOLO] Loaded weights from {self.model_name} on {self.device}")
        except Exception as e:
            print(f"[YOLO] Loading failed ({e}), using simulated detection.")
            self.fallback.load_model()
            self.model = None

    def detect(self, image: Image.Image, confidence_threshold: float = 0.5) -> Dict[str, Any]:
        if self.model is not None:
            try:
                results = self.model(image, conf=confidence_threshold, device=self.device)
                res = results[0]
                detections = []
                for box in res.boxes:
                    cls_id = int(box.cls[0].item())
                    label = res.names[cls_id]
                    conf = float(box.conf[0].item())
                    xyxy = [int(x) for x in box.xyxy[0].tolist()]
                    detections.append({
                        "label": label,
                        "confidence": round(conf, 3),
                        "bbox": xyxy
                    })
                
                class_counts = {}
                for d in detections:
                    l = d["label"]
                    class_counts[l] = class_counts.get(l, 0) + 1

                return {
                    "detections": detections,
                    "num_detections": len(detections),
                    "class_counts": class_counts,
                    "model_used": "yolov8",
                    "demo_mode": False
                }
            except Exception as e:
                print(f"[YOLO] Inference error: {e}, falling back to demo detector.")
        
        return self.fallback.detect(image, confidence_threshold)
