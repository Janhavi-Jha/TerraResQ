import React from 'react';
import { 
  Satellite, 
  GitCompare, 
  Boxes, 
  MessageSquare, 
  Radar, 
  Layers, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'Natural Language VQA',
    description: 'Ask questions about complex satellite imagery in plain English. Our vision-language models translate queries into detailed geospatial findings.',
    tag: 'Vision-Language AI',
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  },
  {
    icon: GitCompare,
    title: 'Bi-Temporal Change Detection',
    description: 'Upload before-and-after imagery to automatically detect construction, deforestation, flood inundation, and disaster destruction.',
    tag: 'Temporal Analytics',
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  },
  {
    icon: Boxes,
    title: 'Precision Feature Detection',
    description: 'Identify and count buildings, roads, water bodies, and vehicles with high-resolution bounding boxes and categorical statistics.',
    tag: 'Computer Vision',
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  },
  {
    icon: Radar,
    title: 'Optical & SAR Fusion',
    description: 'Overcome cloud cover and night limitations by combining Synthetic Aperture Radar (SAR) and multispectral optical imagery.',
    tag: 'Multimodal Sensor',
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  },
  {
    icon: Layers,
    title: 'GeoTIFF & PostGIS Storage',
    description: 'Native handling of multi-band GeoTIFFs, projection coordinates (CRS), bounding coordinates, and PostGIS spatial indexing.',
    tag: 'Geospatial Core',
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  },
  {
    icon: Zap,
    title: 'Fast Offline Demo Mode',
    description: 'Instant zero-configuration demo mode with CPU fallback. Test the full platform immediately without cloud GPU expenses or API keys.',
    tag: 'Instant Deployment',
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  },
];

const Features = () => {
  return (
    <section className="py-20 border-t border-[#1A2E22]">
      <div className="max-w-[1200px] w-full mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] mb-4">
            Full-Spectrum Earth Intelligence
          </h2>
          <p className="text-[#A7B0AA] text-base sm:text-lg leading-relaxed">
            TerraResQ pairs state-of-the-art vision models with remote sensing workflows to make satellite data accessible to responders, analysts, and researchers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="h-full flex flex-col justify-start bg-[#0B1711] border border-[#1A2E22] hover:border-[#22C55E]/30 rounded-xl p-6 transition-colors shadow-xs"
              >
                <div className="w-11 h-11 rounded-lg flex items-center justify-center border border-[#1A2E22] bg-[#07120D] text-[#22C55E] mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="inline-block self-start px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#101A15] text-[#34D399] mb-3 border border-[#1A2E22]">
                  {feature.tag}
                </div>
                <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#A7B0AA] text-sm leading-relaxed mt-auto">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
