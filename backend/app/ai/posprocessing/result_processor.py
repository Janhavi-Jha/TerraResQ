from typing import Dict, Any, List, Optional

class ResultProcessor:
    """Post-processes and cleanses AI model inferences for API and database storage."""

    @staticmethod
    def process_detection_results(
        raw_detections: List[Dict[str, Any]],
        image_size: tuple
    ) -> Dict[str, Any]:
        """Normalize bounding boxes and compute class aggregations."""
        width, height = image_size
        normalized = []
        counts = {}

        for det in raw_detections:
            bbox = det.get("bbox", [0, 0, 0, 0])
            label = det.get("label", "unknown")
            conf = det.get("confidence", 0.0)

            # Clamp coordinates
            x1 = max(0, min(width, bbox[0]))
            y1 = max(0, min(height, bbox[1]))
            x2 = max(0, min(width, bbox[2]))
            y2 = max(0, min(height, bbox[3]))

            normalized.append({
                "label": label,
                "confidence": round(float(conf), 3),
                "bbox": [x1, y1, x2, y2],
            })
            counts[label] = counts.get(label, 0) + 1

        return {
            "detections": normalized,
            "num_detections": len(normalized),
            "class_counts": counts,
        }

    @staticmethod
    def process_change_results(
        raw_changes: List[Dict[str, Any]],
        image_size: tuple
    ) -> Dict[str, Any]:
        """Normalize change polygons and calculate total area impact."""
        width, height = image_size
        total_pixels = width * height
        changed_pixels = 0

        for change in raw_changes:
            changed_pixels += change.get("area_pixels", 0)

        change_pct = round((changed_pixels / total_pixels) * 100.0, 2) if total_pixels > 0 else 0.0

        return {
            "changes": raw_changes,
            "num_changes": len(raw_changes),
            "total_change_percentage": change_pct,
            "total_pixels": total_pixels,
            "changed_pixels": changed_pixels,
        }
