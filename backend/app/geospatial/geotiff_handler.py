import rasterio
from rasterio.warp import calculate_default_transform, reproject, Resampling
from typing import Dict, Any, Optional, Tuple
import numpy as np
from PIL import Image
import io

class GeoTiffHandler:
    """
    Handles GeoTIFF file operations and metadata extraction.
    """
    
    @staticmethod
    def read_geotiff_metadata(file_path: str) -> Dict[str, Any]:
        """
        Extract metadata from a GeoTIFF file.
        
        Args:
            file_path: Path to GeoTIFF file
            
        Returns:
            Dictionary containing metadata
        """
        try:
            with rasterio.open(file_path) as src:
                metadata = {
                    "is_geotiff": True,
                    "width": src.width,
                    "height": src.height,
                    "bands": src.count,
                    "crs": src.crs.to_string() if src.crs else None,
                    "bounds": list(src.bounds) if src.bounds else None,
                    "transform": list(src.transform)[:6] if src.transform else None,
                    "dtype": str(src.dtypes[0]),
                    "nodata": src.nodata,
                    "resolution": (src.res[0], src.res[1]) if src.res else None
                }
                return metadata
        except Exception as e:
            print(f"Error reading GeoTIFF metadata: {e}")
            return {"is_geotiff": False, "error": str(e)}
    
    @staticmethod
    def geotiff_to_image(
        file_path: str,
        bands: Optional[Tuple[int, int, int]] = None
    ) -> Image.Image:
        """
        Convert GeoTIFF to PIL Image for visualization.
        
        Args:
            file_path: Path to GeoTIFF file
            bands: Tuple of band indices to use (R, G, B). If None, uses first 3 bands.
            
        Returns:
            PIL Image object
        """
        with rasterio.open(file_path) as src:
            # Determine which bands to read
            if bands is None:
                if src.count >= 3:
                    bands = (1, 2, 3)  # RGB
                elif src.count == 1:
                    bands = (1, 1, 1)  # Grayscale to RGB
                else:
                    bands = (1, 1, 1)
            
            # Read bands
            if src.count == 1:
                data = src.read(1)
                # Normalize to 8-bit
                data_normalized = GeoTiffHandler._normalize_band(data)
                # Convert grayscale to RGB
                rgb_data = np.stack([data_normalized] * 3, axis=-1)
            else:
                # Read specified bands
                r = src.read(bands[0])
                g = src.read(bands[1]) if src.count >= bands[1] else r
                b = src.read(bands[2]) if src.count >= bands[2] else r
                
                # Normalize each band
                r_norm = GeoTiffHandler._normalize_band(r)
                g_norm = GeoTiffHandler._normalize_band(g)
                b_norm = GeoTiffHandler._normalize_band(b)
                
                # Stack to RGB
                rgb_data = np.stack([r_norm, g_norm, b_norm], axis=-1)
            
            # Create PIL Image
            image = Image.fromarray(rgb_data.astype('uint8'), mode='RGB')
            return image
    
    @staticmethod
    def _normalize_band(band_data: np.ndarray) -> np.ndarray:
        """
        Normalize band data to 8-bit range (0-255).
        
        Args:
            band_data: Input band array
            
        Returns:
            Normalized 8-bit array
        """
        # Handle NaN and inf values
        band_data = np.nan_to_num(band_data, nan=0.0, posinf=0.0, neginf=0.0)
        
        # Get percentiles for robust normalization
        p2, p98 = np.percentile(band_data, (2, 98))
        
        # Clip and normalize
        band_clipped = np.clip(band_data, p2, p98)
        
        if p98 - p2 > 0:
            band_normalized = ((band_clipped - p2) / (p98 - p2)) * 255
        else:
            band_normalized = np.zeros_like(band_clipped)
        
        return band_normalized
    
    @staticmethod
    def get_bounds_polygon(file_path: str) -> Optional[str]:
        """
        Get GeoTIFF bounds as WKT polygon.
        
        Args:
            file_path: Path to GeoTIFF file
            
        Returns:
            WKT polygon string or None
        """
        try:
            with rasterio.open(file_path) as src:
                if not src.bounds:
                    return None
                
                bounds = src.bounds
                # Create polygon from bounds
                wkt = f"POLYGON(({bounds.left} {bounds.bottom}, {bounds.right} {bounds.bottom}, {bounds.right} {bounds.top}, {bounds.left} {bounds.top}, {bounds.left} {bounds.bottom}))"
                return wkt
        except Exception:
            return None