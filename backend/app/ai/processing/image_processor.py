from PIL import Image
import numpy as np
from typing import Tuple, Optional
import cv2

class ImagePreprocessor:
    """
    Handles image preprocessing for AI models.
    """
    
    @staticmethod
    def resize_image(
        image: Image.Image,
        target_size: Tuple[int, int] = (512, 512),
        maintain_aspect: bool = True
    ) -> Image.Image:
        """
        Resize image to target size.
        
        Args:
            image: Input PIL Image
            target_size: Target (width, height)
            maintain_aspect: Whether to maintain aspect ratio
            
        Returns:
            Resized PIL Image
        """
        if maintain_aspect:
            image.thumbnail(target_size, Image.Resampling.LANCZOS)
            return image
        else:
            return image.resize(target_size, Image.Resampling.LANCZOS)
    
    @staticmethod
    def normalize_image(image: Image.Image) -> np.ndarray:
        """
        Normalize image to [0, 1] range.
        
        Args:
            image: Input PIL Image
            
        Returns:
            Normalized numpy array
        """
        img_array = np.array(image, dtype=np.float32)
        return img_array / 255.0
    
    @staticmethod
    def ensure_rgb(image: Image.Image) -> Image.Image:
        """
        Ensure image is in RGB mode.
        
        Args:
            image: Input PIL Image
            
        Returns:
            RGB PIL Image
        """
        if image.mode != 'RGB':
            return image.convert('RGB')
        return image
    
    @staticmethod
    def create_thumbnail(
        image: Image.Image,
        max_size: Tuple[int, int] = (300, 300)
    ) -> Image.Image:
        """
        Create a thumbnail for preview.
        
        Args:
            image: Input PIL Image
            max_size: Maximum thumbnail size
            
        Returns:
            Thumbnail PIL Image
        """
        thumb = image.copy()
        thumb.thumbnail(max_size, Image.Resampling.LANCZOS)
        return thumb
    
    @staticmethod
    def match_image_sizes(
        image1: Image.Image,
        image2: Image.Image
    ) -> Tuple[Image.Image, Image.Image]:
        """
        Resize two images to match dimensions (for change detection).
        
        Args:
            image1: First PIL Image
            image2: Second PIL Image
            
        Returns:
            Tuple of resized images
        """
        # Get minimum dimensions
        min_width = min(image1.width, image2.width)
        min_height = min(image1.height, image2.height)
        
        target_size = (min_width, min_height)
        
        img1_resized = image1.resize(target_size, Image.Resampling.LANCZOS)
        img2_resized = image2.resize(target_size, Image.Resampling.LANCZOS)
        
        return img1_resized, img2_resized