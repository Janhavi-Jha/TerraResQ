# TerraResQ - AI-Powered Remote Sensing Analysis Platform

> **See the Earth. Solve for Tomorrow.**  
> Transform multi-spectral satellite imagery and radar data into actionable intelligence using natural language queries and multimodal AI.

---

## Key Features

- 🛰️ **Natural Language VQA**: Ask questions about remote sensing imagery in plain English.
- 🔄 **Bi-Temporal Change Detection**: Quantify land cover changes, construction, and disaster damage over time.
- 📦 **Object & Infrastructure Detection**: Automatically detect and count buildings, roads, water bodies, and vehicles.
- 📡 **Optical & SAR Multimodal Fusion**: Leverage radar penetration to analyze scenes regardless of cloud cover.
- 🗺️ **Interactive Leaflet Mapping**: Explore imagery footprints with bounding polygons and coordinate markers.
- ⚡ **Zero-Friction Offline Demo Mode**: Fully runnable out of the box on CPU without GPU or external API keys.

---

## Project Structure

```
terraresq/
├── backend/                  # FastAPI Python backend
│   ├── app/
│   │   ├── ai/               # AI models (VLM, detection, change, segmentation, optical-SAR)
│   │   ├── api/routes/       # Endpoints (analyze, upload, history, health, reports)
│   │   ├── core/             # Configuration & security
│   │   ├── database/         # SQLAlchemy session & init
│   │   ├── geospatial/       # Rasterio GeoTIFF handler & spatial utils
│   │   ├── models/           # Database models (Analysis, UploadedImage, AnalysisResult)
│   │   ├── schemas/          # Pydantic request/response schemas
│   │   └── services/         # Orchestration & business logic
│   ├── DockerFile            # Backend container definition
│   └── requirements.txt      # Python dependencies
├── frontend/                 # Vite + React 18 + Tailwind CSS frontend
│   ├── src/
│   │   ├── components/       # UI modules (analysis, dashboard, history, landing, common)
│   │   ├── pages/            # Landing, Dashboard, Results, History, About
│   │   ├── services/         # Axios API client
│   │   └── utils/            # Formatters and validators
│   ├── DockerFile            # Frontend container definition
│   └── package.json          # Node dependencies
├── data/                     # Data directory (uploads, samples)
├── models/                   # Model weight cache directory
├── reports/                  # Generated analysis reports
└── docker-compose.yml        # Multi-container orchestration (PostGIS + Backend + Frontend)
```

---

## Quick Start Guide

### Option 1: Running with Docker Compose (Recommended)

To start all services (PostgreSQL/PostGIS, Backend API, and Frontend) simultaneously:

```bash
docker compose up --build
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **API Health Endpoint**: [http://localhost:8000/api/health](http://localhost:8000/api/health)
- **PostgreSQL / PostGIS**: `localhost:5432`

---

### Option 2: Running Locally for Development

#### 1. Backend Setup

```bash
cd backend
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Default settings enable `DEMO_MODE=True` and `DEVICE=cpu` for instant local execution.

---

## License

This project is licensed under the MIT License.
