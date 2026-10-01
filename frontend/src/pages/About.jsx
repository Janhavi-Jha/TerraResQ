import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Satellite, 
  Cpu, 
  Layers, 
  Database, 
  Eye, 
  Zap, 
  CheckCircle, 
  ArrowRight 
} from 'lucide-react';

const About = () => {
  return (
    <div className="py-12">
      <div className="max-w-[1200px] w-full mx-auto px-6 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-[#101A15] border border-[#1A2E22] rounded-full px-4 py-1.5 text-xs text-[#22C55E] font-medium">
            <Satellite className="w-4 h-4" />
            <span>Earth Observation Intelligence System</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#F8FAFC] tracking-tight">
            About <span className="text-[#22C55E]">TerraResQ</span>
          </h1>
          <p className="text-lg text-[#A7B0AA] max-w-2xl mx-auto">
            Democratizing satellite remote sensing through multimodal artificial intelligence and natural language understanding.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-[#0B1711] border border-[#1A2E22] rounded-2xl p-8 shadow-xs">
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-4">Our Mission</h2>
          <p className="text-[#A7B0AA] leading-relaxed mb-4">
            Earth observation data from Sentinel, Landsat, and commercial constellations holds critical insights for disaster relief, climate resilience, and urban planning. However, analyzing raw multi-band TIFFs and radar data typically demands specialized GIS software, radiometric knowledge, and costly manual annotation.
          </p>
          <p className="text-[#A7B0AA] leading-relaxed">
            TerraResQ removes the technical barrier. First responders, environmentalists, and decision makers can upload satellite imagery and query the landscape using standard conversational English—uncovering building counts, flood extents, vegetation loss, and construction patterns in seconds.
          </p>
        </div>

        {/* Architecture Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#F8FAFC]">System Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0B1711] border border-[#1A2E22] p-6 rounded-xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#101A15] border border-[#1A2E22] flex items-center justify-center text-[#22C55E]">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#F8FAFC]">Multimodal Vision-Language Core</h3>
              <p className="text-sm text-[#A7B0AA]">
                Powered by foundation vision-language models capable of dense spatial grounding, temporal comparison, and conversational question-answering over satellite frames.
              </p>
            </div>

            <div className="bg-[#0B1711] border border-[#1A2E22] p-6 rounded-xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#101A15] border border-[#1A2E22] flex items-center justify-center text-[#22C55E]">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#F8FAFC]">PostGIS Spatial Database</h3>
              <p className="text-sm text-[#A7B0AA]">
                PostgreSQL with PostGIS extension for storage of geospatial geometries, coordinates, bounding polygons, and multi-temporal metadata.
              </p>
            </div>

            <div className="bg-[#0B1711] border border-[#1A2E22] p-6 rounded-xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#101A15] border border-[#1A2E22] flex items-center justify-center text-[#22C55E]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#F8FAFC]">Rasterio & GDAL Pipeline</h3>
              <p className="text-sm text-[#A7B0AA]">
                Native handling of high-bitdepth multi-spectral GeoTIFFs, CRS re-projections, affine transformations, and dynamic band synthesis.
              </p>
            </div>

            <div className="bg-[#0B1711] border border-[#1A2E22] p-6 rounded-xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#101A15] border border-[#1A2E22] flex items-center justify-center text-[#22C55E]">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#F8FAFC]">Zero-Friction Demo Mode</h3>
              <p className="text-sm text-[#A7B0AA]">
                Equipped with realistic offline simulation pipelines running completely on CPU. Test and demonstrate the full user flow without cloud GPU dependencies or API keys.
              </p>
            </div>
          </div>
        </div>

        {/* Key Features List */}
        <div className="bg-[#0B1711] border border-[#1A2E22] rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-[#F8FAFC]">Core Capabilities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Bi-temporal change detection & quantification',
              'Object detection (buildings, infrastructure, transport)',
              'Natural language visual Q&A for remote sensing',
              'Optical and Synthetic Aperture Radar (SAR) fusion',
              'Interactive Leaflet maps with bounding polygon overlays',
              'GeoTIFF metadata extraction and 8-bit normalization',
              'Exportable structured analysis reports (JSON/PDF)',
              'Containerized Docker Compose multi-service deployment',
            ].map((item, idx) => (
              <div key={idx} className="flex items-start space-x-2.5 text-sm text-[#A7B0AA]">
                <CheckCircle className="w-4 h-4 text-[#22C55E] mt-0.5 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-[#22C55E] hover:bg-[#16a34a] text-[#07120D] rounded-xl text-lg font-semibold shadow-md transition-all"
          >
            <span>Launch Analysis Studio</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
