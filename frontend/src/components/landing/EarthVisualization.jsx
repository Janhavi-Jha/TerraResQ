import React, { useState, useEffect } from 'react';
import { Satellite, Radio, Globe2, ShieldCheck, Activity } from 'lucide-react';

const EarthVisualization = () => {
  const [activeSat, setActiveSat] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSat((prev) => (prev % 3) + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-[1200px] w-full mx-auto px-6">
        <div className="relative p-6 sm:p-8 bg-[#0B1711] border border-[#1A2E22] rounded-2xl overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Animated Satellite / Globe Centerpiece (Flexbox layout) */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-[#07120D] rounded-xl border border-[#1A2E22]">
              {/* Top Sensor Status Badges */}
              <div className="flex flex-wrap items-center justify-between w-full max-w-md gap-2 mb-6">
                <div className="inline-flex items-center gap-2 bg-[#101A15] border border-[#1A2E22] px-3 py-1.5 rounded-full text-xs text-[#34D399]">
                  <Satellite className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
                  <span>Terra-SAR (Active)</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-[#101A15] border border-[#1A2E22] px-3 py-1.5 rounded-full text-xs text-[#34D399]">
                  <Radio className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
                  <span>Band 4, 3, 2 (RGB)</span>
                </div>
              </div>
              
              {/* Planetary Core */}
              <div className="w-44 h-44 rounded-full bg-gradient-to-tr from-[#162B1F] via-[#0B1711] to-[#101A15] p-1.5 shadow-md flex items-center justify-center my-2">
                <div className="w-full h-full rounded-full bg-[#07120D] border border-[#1A2E22] flex flex-col items-center justify-center p-4 text-center">
                  <Globe2 className="w-12 h-12 text-[#22C55E] mb-1" />
                  <span className="text-xs font-semibold text-[#F8FAFC] tracking-widest uppercase">Sentinel-2</span>
                  <span className="text-[10px] text-[#34D399] font-mono">10m Multispectral</span>
                </div>
              </div>

              {/* Bottom Sensor Detail */}
              <div className="mt-6 text-center">
                <span className="text-xs text-[#A7B0AA]">
                  Active Orbit: <strong className="text-[#F8FAFC]">Sun-Synchronous (786 km)</strong> • Repeat Cycle: <strong className="text-[#F8FAFC]">5 Days</strong>
                </span>
              </div>
            </div>

            {/* Live Remote Sensing Telemetry Panel */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1A2E22] pb-3">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-[#22C55E]" />
                  <h4 className="text-sm font-semibold text-[#F8FAFC] uppercase tracking-wider">Live Pipeline Telemetry</h4>
                </div>
                <span className="inline-flex items-center text-[10px] bg-[#101A15] text-[#34D399] border border-[#1A2E22] px-2.5 py-0.5 rounded-full font-medium">
                  LIVE DEMO
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className={`p-3 rounded-lg border transition-colors ${activeSat === 1 ? 'bg-[#101A15] border-[#22C55E]/50' : 'bg-[#07120D] border-[#1A2E22] text-[#A7B0AA]'}`}>
                  <div className="flex justify-between font-semibold text-[#F8FAFC] mb-1">
                    <span>Task Router</span>
                    <span className="text-[#34D399] font-mono">Qwen2-VL Ready</span>
                  </div>
                  <p className="text-[11px] text-[#A7B0AA]">Natural language multi-turn VQA query dispatch</p>
                </div>

                <div className={`p-3 rounded-lg border transition-colors ${activeSat === 2 ? 'bg-[#101A15] border-[#22C55E]/50' : 'bg-[#07120D] border-[#1A2E22] text-[#A7B0AA]'}`}>
                  <div className="flex justify-between font-semibold text-[#F8FAFC] mb-1">
                    <span>Change Detector</span>
                    <span className="text-[#34D399] font-mono">SSIM + Contours</span>
                  </div>
                  <p className="text-[11px] text-[#A7B0AA]">Pixel-level bi-temporal surface differential analysis</p>
                </div>

                <div className={`p-3 rounded-lg border transition-colors ${activeSat === 3 ? 'bg-[#101A15] border-[#22C55E]/50' : 'bg-[#07120D] border-[#1A2E22] text-[#A7B0AA]'}`}>
                  <div className="flex justify-between font-semibold text-[#F8FAFC] mb-1">
                    <span>PostGIS Spatial Bridge</span>
                    <span className="text-[#34D399] font-mono">SRID: 4326</span>
                  </div>
                  <p className="text-[11px] text-[#A7B0AA]">GeoTIFF affine transform & coordinate projections</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EarthVisualization;
