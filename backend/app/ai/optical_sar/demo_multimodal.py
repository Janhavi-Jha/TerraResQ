from typing import Dict, Any
from PIL import Image
import random
from .base import BaseMultimodalAnalyzer

class DemoMultimodalAnalyzer(BaseMultimodalAnalyzer):
    """
    Demo Multimodal Analyzer simulating joint Optical-SAR interpretation.
    """

    def __init__(self, model_name: str = "demo-optical-sar-fusion", device: str = "cpu"):
        super().__init__(model_name, device)

    def load_model(self):
        print("[DEMO MODE] Optical-SAR Multimodal analyzer loaded (simulation)")

    def analyze_fusion(
        self,
        optical_image: Image.Image,
        sar_image: Image.Image,
        query: str,
        **kwargs
    ) -> Dict[str, Any]:
        answers = [
            "Optical-SAR fusion analysis successfully completed. The SAR channel penetrated cloud cover in the western sector, revealing 14 previously obscured metallic structures and road networks. Optical spectral reflectance confirms active vegetation and surface water boundaries in unobstructed zones.",
            "Joint multimodal analysis indicates high backscatter returns in the central region consistent with dense urban infrastructure or flooded vegetation. Cloud shadow distortion present in the optical frame was successfully resolved through the SAR C-band signal.",
            "Multimodal sensor alignment reveals consistent surface topography. Radar backscatter cross-sections show high double-bounce scattering from building corners, corroborating the optical detection of an expanding industrial district.",
        ]

        confidence = random.uniform(0.81, 0.94)

        return {
            "answer": random.choice(answers),
            "confidence": round(confidence, 2),
            "sar_penetration_detected": True,
            "cloud_coverage_bypassed_pct": round(random.uniform(12.0, 38.0), 1),
            "fusion_technique": "Wavelet Multi-Sensor Co-Registration",
            "model_used": "demo-optical-sar-fusion",
            "demo_mode": True,
        }
