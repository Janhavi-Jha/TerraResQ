# TerraResQ - AI-Powered Remote Sensing Analysis Platform

**"See the Earth. Solve for Tomorrow."**

TerraResQ is a production-ready full-stack web application that transforms satellite imagery into actionable intelligence using natural-language queries and multimodal AI.

## 🌟 Features

- **Natural Language Interaction**: Ask questions in plain English, no GIS expertise required
- **Multimodal Analysis**: Combine optical and SAR imagery for comprehensive insights
- **Multi-temporal Change Detection**: Automatically detect and quantify changes between images
- **AI-Driven Pipeline Selection**: System automatically selects the appropriate analysis method
- **Visual Grounding**: Results are visualized directly on imagery with explanations
- **Object Detection**: Identify buildings, roads, vehicles, and infrastructure
- **Segmentation**: Extract and analyze specific regions of interest
- **GeoTIFF Support**: Full support for georeferenced satellite imagery

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React.js + Vite
- Tailwind CSS
- React Router
- Leaflet (mapping)
- Recharts (visualization)
- Axios (API client)

**Backend:**
- Python + FastAPI
- PostgreSQL + PostGIS
- PyTorch
- Hugging Face Transformers
- Rasterio + GDAL
- OpenCV

**AI/ML:**
- Vision-Language Models (VLM)
- Object Detection (YOLO)
- Segmentation (SAM)
- Change Detection
- Modular AI pipeline with easy model replacement

## 🚀 Quick Start

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd terraresq