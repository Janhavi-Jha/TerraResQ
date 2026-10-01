# TerraResQ System Architecture

TerraResQ is an AI-powered multimodal remote sensing intelligence platform that enables natural-language querying, bi-temporal change detection, object detection, and multimodal fusion over Earth observation imagery.

## 1. High-Level Architecture Overview

```
                          +-------------------------------+
                          |    Web Browser (User / GIS)   |
                          +---------------+---------------+
                                          |
                                          | HTTP / REST (port 5173 -> 8000)
                                          v
                    +-------------------------------------------+
                    |           TerraResQ Frontend              |
                    |     (Vite + React 18 + Tailwind CSS)      |
                    |   Leaflet Maps | Recharts | Lucide Icons  |
                    +---------------------+---------------------+
                                          |
                                          | JSON / Multipart API
                                          v
                    +-------------------------------------------+
                    |            TerraResQ Backend              |
                    |          (FastAPI Python 3.10)            |
                    +---------------------+---------------------+
                                          |
        +---------------------------------+---------------------------------+
        |                                 |                                 |
        v                                 v                                 v
+---------------+             +-----------------------+             +---------------+
| Task Router   |             |   Geospatial Engine   |             |  PostgreSQL   |
| NL Dispatcher |             | Rasterio & GeoTIFF    |             |  + PostGIS    |
+-------+-------+             +-----------+-----------+             |  SRID: 4326   |
        |                                 |                         +---------------+
        +---------------------------------+
        |
        v
+-------------------------------------------------------------------------------+
|                             AI Analysis Core                                  |
|  - Vision-Language Model (VQA & NL Understanding - Qwen2-VL / DemoVLM)        |
|  - Bi-Temporal Change Detection (Pixel differential & structural analysis)    |
|  - Object Detection (YOLO / DemoDetector - Infrastructure & Buildings)        |
|  - Optical-SAR Multimodal Fusion (Radar backscatter + Optical spectral)       |
|  - Land Cover Segmentation (SAM / DemoSegmentor)                              |
+-------------------------------------------------------------------------------+
```

## 2. Component Details

### Frontend (`/frontend`)
- **Framework**: React 18 with Vite 5 and React Router v6.
- **Styling**: Tailwind CSS v4 with custom space/earth/ocean theme palette.
- **Mapping**: Leaflet and React-Leaflet for geospatial bounds rendering and coordinate exploration.
- **Visualizations**: Recharts for object classification charts, change distribution, and telemetry.
- **File Ingestion**: `react-dropzone` with client-side validation for multi-format imagery (PNG, JPG, GeoTIFF).

### Backend (`/backend`)
- **Web API**: FastAPI with asynchronous endpoints, CORS configuration, and background task management.
- **Data Persistence**: SQLAlchemy 2.0 ORM with GeoAlchemy2 mapping to PostGIS.
- **Image Pipeline**: Rasterio for multi-band GeoTIFF ingestion, dynamic percentile normalization, and affine CRS transforms.
- **Intelligence Orchestration**: `AnalysisService` with modular task routing (`TaskRouter`).

### Database & Spatial Indexing
- **Database**: PostgreSQL 15 with PostGIS 3.4.
- **Geometries**: Bounding collection and spatial polygons stored in WGS 84 (EPSG:4326).
- **Tables**:
  - `analyses`: Query metadata, status, runtime, model attribution.
  - `uploaded_images`: File references, dimensions, band counts, GeoTIFF spatial metadata.
  - `analysis_results`: Model answers, confidence, detected objects, changes, and summary statistics.

## 3. Supported Analysis Modes

| Mode | Input | Engine / Model | Primary Output |
|---|---|---|---|
| **VQA / Query** | 1-2 Images + Query | DemoVLM / Qwen2-VL | Natural language synthesis & spatial explanation |
| **Change Detection** | 2 Temporal Images | DemoChangeDetector / SSIM | Change regions, area percentages, and delta metrics |
| **Object Detection** | 1 Image | DemoDetector / YOLO | Bounding boxes, class counts, and coordinates |
| **Optical-SAR Fusion** | 1 Optical + 1 SAR | DemoMultimodalAnalyzer | Cloud penetration analysis, backscatter interpretation |
| **Segmentation** | 1 Image | DemoSegmentor / SAM | Land cover distribution (vegetation, water, urban) |

## 4. Environment & Deployment Modes

- **Demo Mode (`DEMO_MODE=True`)**: Immediate zero-configuration runtime. Operates entirely on CPU without requiring external model weights, API keys, or GPU hardware.
- **Production Mode (`DEMO_MODE=False`)**: Loads full PyTorch/Transformers foundation models.
- **Docker Compose**: Pre-configured multi-container orchestration (`postgres`, `backend`, `frontend`).
