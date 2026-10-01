from typing import Dict, Any, List, Optional
from PIL import Image
from app.core.config import settings
from app.ai.router.task_router import TaskRouter, TaskType
from app.ai.vlm.demo_vlm import DemoVLM
from app.ai.detection.demo_detector import DemoDetector
from app.ai.change_detection.demo_change_detector import DemoChangeDetector
from app.ai.segmentation.demo_segmentor import DemoSegmentor
from app.ai.optical_sar.demo_multimodal import DemoMultimodalAnalyzer
from app.ai.preprocessing.image_preprocessor import ImagePreprocessor
import time

class AnalysisService:
    """
    Orchestrates the AI analysis pipeline.
    """
    
    def __init__(self):
        self.task_router = TaskRouter()
        self.preprocessor = ImagePreprocessor()
        
        # Initialize models based on mode
        self.vlm = DemoVLM()
        self.detector = DemoDetector()
        self.change_detector = DemoChangeDetector()
        self.segmentor = DemoSegmentor()
        self.multimodal = DemoMultimodalAnalyzer()
        
        # Load models
        self.vlm.load_model()
        self.detector.load_model()
        self.change_detector.load_model()
        self.segmentor.load_model()
        self.multimodal.load_model()
    
    async def analyze(
        self,
        images: List[Image.Image],
        query: str,
        analysis_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Main analysis entry point.
        
        Args:
            images: List of PIL Image objects
            query: Natural language query
            analysis_type: Optional explicit analysis type
            
        Returns:
            Analysis results dictionary
        """
        start_time = time.time()
        
        # Classify task if not explicitly provided
        if analysis_type is None:
            task = self.task_router.classify_task(query, len(images))
        else:
            try:
                task = TaskType(analysis_type)
            except ValueError:
                task = TaskType.VQA
        
        # Route to appropriate pipeline
        if task == TaskType.CHANGE_DETECTION and len(images) >= 2:
            result = await self._analyze_change_detection(images, query)
        elif task == TaskType.OPTICAL_SAR and len(images) >= 2:
            result = await self._analyze_optical_sar(images, query)
        elif task == TaskType.OBJECT_DETECTION:
            result = await self._analyze_object_detection(images[0], query)
        elif task == TaskType.SEGMENTATION:
            result = await self._analyze_segmentation(images[0], query)
        elif task == TaskType.VQA or task == TaskType.IMAGE_DESCRIPTION:
            if len(images) == 1:
                result = await self._analyze_vqa(images[0], query)
            else:
                result = await self._analyze_vqa_multi(images, query)
        else:
            # Default to VQA
            result = await self._analyze_vqa(images[0], query)
        
        # Add processing time
        processing_time = time.time() - start_time
        result["processing_time"] = round(processing_time, 2)
        result["task_type"] = task.value
        
        return result
    
    async def _analyze_vqa(self, image: Image.Image, query: str) -> Dict[str, Any]:
        """Visual Question Answering on single image."""
        image_rgb = self.preprocessor.ensure_rgb(image)
        vlm_result = self.vlm.analyze(image_rgb, query)
        
        return {
            "answer": vlm_result["answer"],
            "confidence": vlm_result.get("confidence"),
            "explanation": vlm_result.get("explanation", ""),
            "model_used": vlm_result.get("model_used", "vlm"),
            "demo_mode": settings.DEMO_MODE
        }
    
    async def _analyze_vqa_multi(self, images: List[Image.Image], query: str) -> Dict[str, Any]:
        """Visual Question Answering on multiple images."""
        images_rgb = [self.preprocessor.ensure_rgb(img) for img in images]
        vlm_result = self.vlm.analyze_multi_image(images_rgb, query)
        
        return {
            "answer": vlm_result["answer"],
            "confidence": vlm_result.get("confidence"),
            "explanation": vlm_result.get("explanation", ""),
            "model_used": vlm_result.get("model_used", "vlm"),
            "demo_mode": settings.DEMO_MODE
        }
    
    async def _analyze_object_detection(self, image: Image.Image, query: str) -> Dict[str, Any]:
        """Object detection analysis."""
        image_rgb = self.preprocessor.ensure_rgb(image)
        detection_result = self.detector.detect(image_rgb)
        
        detections = detection_result["detections"]
        class_counts = detection_result["class_counts"]
        
        answer_parts = ["Object detection completed. Detected:"]
        for cls, count in class_counts.items():
            answer_parts.append(f"{count} {cls}(s)")
        
        answer = " ".join(answer_parts) + "."
        
        return {
            "answer": answer,
            "detected_objects": detections,
            "statistics": {
                "total_objects": detection_result["num_detections"],
                "class_counts": class_counts
            },
            "model_used": detection_result.get("model_used", "detector"),
            "demo_mode": settings.DEMO_MODE
        }
    
    async def _analyze_change_detection(self, images: List[Image.Image], query: str) -> Dict[str, Any]:
        """Change detection between temporal images."""
        if len(images) < 2:
            return {
                "answer": "Change detection requires at least two images.",
                "error": "Insufficient images"
            }
        
        img1_rgb = self.preprocessor.ensure_rgb(images[0])
        img2_rgb = self.preprocessor.ensure_rgb(images[1])
        img1_matched, img2_matched = self.preprocessor.match_image_sizes(img1_rgb, img2_rgb)
        
        change_result = self.change_detector.detect_changes(img1_matched, img2_matched)
        
        num_changes = change_result["num_changes"]
        change_pct = change_result["total_change_percentage"]
        
        answer = f"Change detection analysis identified {num_changes} significant change regions, "
        answer += f"affecting approximately {change_pct:.1f}% of the total area. "
        
        change_types = {}
        for change in change_result["changes"]:
            ct = change["change_type"]
            change_types[ct] = change_types.get(ct, 0) + 1
        
        answer += "Detected changes include: "
        change_descriptions = [f"{count} {ctype.replace('_', ' ')} region(s)" 
                              for ctype, count in change_types.items()]
        answer += ", ".join(change_descriptions) + "."
        
        return {
            "answer": answer,
            "detected_changes": change_result["changes"],
            "statistics": change_result["statistics"],
            "confidence": change_result["changes"][0]["confidence"] if change_result["changes"] else None,
            "model_used": change_result.get("model_used", "change_detector"),
            "demo_mode": settings.DEMO_MODE
        }

    async def _analyze_optical_sar(self, images: List[Image.Image], query: str) -> Dict[str, Any]:
        """Optical and SAR fusion analysis."""
        img_optical = self.preprocessor.ensure_rgb(images[0])
        img_sar = self.preprocessor.ensure_rgb(images[1])
        fusion_res = self.multimodal.analyze_fusion(img_optical, img_sar, query)
        return {
            "answer": fusion_res["answer"],
            "confidence": fusion_res.get("confidence"),
            "statistics": {
                "cloud_coverage_bypassed_pct": fusion_res.get("cloud_coverage_bypassed_pct"),
                "sar_penetration_detected": fusion_res.get("sar_penetration_detected"),
            },
            "model_used": fusion_res.get("model_used", "optical_sar"),
            "demo_mode": settings.DEMO_MODE
        }

    async def _analyze_segmentation(self, image: Image.Image, query: str) -> Dict[str, Any]:
        """Semantic land cover segmentation analysis."""
        img_rgb = self.preprocessor.ensure_rgb(image)
        seg_res = self.segmentor.segment(img_rgb)
        
        desc = ", ".join([f"{s['class_name']} ({s['percentage']}%)" for s in seg_res["segments"]])
        answer = f"Semantic segmentation completed for scene. Land-cover distribution: {desc}."
        
        return {
            "answer": answer,
            "confidence": seg_res.get("confidence"),
            "statistics": {
                "total_pixels": seg_res.get("total_pixels"),
                "segments": seg_res.get("segments"),
            },
            "model_used": seg_res.get("model_used", "segmentor"),
            "demo_mode": settings.DEMO_MODE
        }