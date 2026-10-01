from typing import Dict, Any, List
import re
from enum import Enum

class TaskType(str, Enum):
    VQA = "vqa"
    OBJECT_DETECTION = "object_detection"
    SEGMENTATION = "segmentation"
    CHANGE_DETECTION = "change_detection"
    OPTICAL_SAR = "optical_sar"
    GEOSPATIAL_QUERY = "geospatial_query"
    IMAGE_DESCRIPTION = "image_description"

class TaskRouter:
    """
    Intelligent task router that classifies natural language queries
    and routes them to appropriate analysis pipelines.
    """
    
    def __init__(self):
        self.patterns = {
            TaskType.CHANGE_DETECTION: [
                r"\b(change|changed|difference|compare|comparison|temporal|before and after)\b",
                r"\b(new|newly|recent|expansion|growth|reduction|loss)\b",
            ],
            TaskType.OBJECT_DETECTION: [
                r"\b(detect|identify|find|locate|count|how many)\b.*\b(building|road|vehicle|ship|structure|house|car|truck)\b",
                r"\b(building|road|vehicle|ship|structure|house|car|truck).*\b(detect|identify|find|locate|count)\b",
            ],
            TaskType.SEGMENTATION: [
                r"\b(segment|extract|isolate|separate|outline|delineate)\b",
                r"\b(area of|boundary of|perimeter of)\b",
            ],
            TaskType.OPTICAL_SAR: [
                r"\b(sar|synthetic aperture radar|radar|optical and sar|multimodal)\b",
            ],
            TaskType.VQA: [
                r"\b(what|where|when|how|why|which|is there|are there)\b",
            ],
            TaskType.GEOSPATIAL_QUERY: [
                r"\b(coordinates|location|latitude|longitude|bounds|extent|crs|projection)\b",
            ],
        }
    
    def classify_task(self, query: str, num_images: int = 1, has_sar: bool = False) -> TaskType:
        """
        Classify the user query into a specific task type.
        
        Args:
            query: Natural language query
            num_images: Number of uploaded images
            has_sar: Whether SAR imagery is present
            
        Returns:
            TaskType enum
        """
        query_lower = query.lower()
        
        # Explicit multi-temporal check
        if num_images > 1:
            for pattern in self.patterns[TaskType.CHANGE_DETECTION]:
                if re.search(pattern, query_lower):
                    return TaskType.CHANGE_DETECTION
        
        # Explicit optical-SAR check
        if has_sar:
            return TaskType.OPTICAL_SAR
        
        # Pattern matching for other tasks
        task_scores = {task: 0 for task in TaskType}
        
        for task_type, patterns in self.patterns.items():
            for pattern in patterns:
                if re.search(pattern, query_lower):
                    task_scores[task_type] += 1
        
        # Get task with highest score
        max_score = max(task_scores.values())
        if max_score > 0:
            for task, score in task_scores.items():
                if score == max_score:
                    return task
        
        # Default to VQA for general questions or description for simple queries
        if any(word in query_lower for word in ["what", "describe", "explain", "show"]):
            return TaskType.VQA
        
        return TaskType.IMAGE_DESCRIPTION
    
    def get_pipeline_for_task(self, task: TaskType) -> str:
        """
        Map task type to processing pipeline identifier.
        """
        pipeline_map = {
            TaskType.VQA: "vlm",
            TaskType.OBJECT_DETECTION: "detection",
            TaskType.SEGMENTATION: "segmentation",
            TaskType.CHANGE_DETECTION: "change_detection",
            TaskType.OPTICAL_SAR: "optical_sar",
            TaskType.GEOSPATIAL_QUERY: "geospatial",
            TaskType.IMAGE_DESCRIPTION: "vlm",
        }
        return pipeline_map.get(task, "vlm")