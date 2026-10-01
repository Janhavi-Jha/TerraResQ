from typing import List, Dict, Any, Tuple, Optional
import math

class SpatialUtils:
    """Geospatial helper utilities for coordinate manipulations and area computations."""

    @staticmethod
    def bbox_to_geojson_polygon(bbox: List[float]) -> Dict[str, Any]:
        """
        Convert bounding box [west, south, east, north] or [minX, minY, maxX, maxY]
        into GeoJSON Polygon geometry.
        """
        if len(bbox) != 4:
            raise ValueError("Bounding box must contain exactly 4 coordinates [minX, minY, maxX, maxY]")
        
        min_x, min_y, max_x, max_y = bbox
        coordinates = [[
            [min_x, min_y],
            [max_x, min_y],
            [max_x, max_y],
            [min_x, max_y],
            [min_x, min_y],
        ]]
        return {
            "type": "Polygon",
            "coordinates": coordinates,
        }

    @staticmethod
    def calculate_bbox_area_km2(bbox: List[float]) -> float:
        """
        Estimate ground area of a bounding box in square kilometers assuming WGS84 coordinates.
        """
        if len(bbox) != 4:
            return 0.0
        
        min_lon, min_lat, max_lon, max_lat = bbox
        # Haversine distance for width and height
        lat_dist = abs(max_lat - min_lat) * 111.32
        mean_lat_rad = math.radians((min_lat + max_lat) / 2.0)
        lon_dist = abs(max_lon - min_lon) * 111.32 * math.cos(mean_lat_rad)
        
        return round(lat_dist * lon_dist, 3)

    @staticmethod
    def pixel_to_geo(
        x: int,
        y: int,
        transform: List[float]
    ) -> Tuple[float, float]:
        """
        Convert image pixel coordinates (x, y) to geographic coordinates (lon, lat)
        using affine transform matrix [a, b, d, e, xoff, yoff] or GDAL 6-tuple.
        """
        if len(transform) >= 6:
            # Standard GDAL affine: [x_origin, pixel_width, x_rot, y_origin, y_rot, pixel_height]
            geo_x = transform[0] + x * transform[1] + y * transform[2]
            geo_y = transform[3] + x * transform[4] + y * transform[5]
            return round(geo_x, 6), round(geo_y, 6)
        return float(x), float(y)
