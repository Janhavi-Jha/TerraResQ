import React from 'react';
import { Link } from 'react-router-dom';
import { Satellite, Github, Globe, Shield, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#07120D] border-t border-[#1A2E22] text-[#A7B0AA] py-12 mt-auto">
      <div className="max-w-[1200px] w-full mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Satellite className="h-6 w-6 text-[#22C55E]" />
              <span className="text-xl font-bold text-[#F8FAFC] tracking-wide">Terra<span className="text-[#22C55E]">ResQ</span></span>
            </div>
            <p className="text-sm text-[#A7B0AA] leading-relaxed">
              AI-powered multimodal remote sensing intelligence platform. Bridging Earth observation with natural language understanding.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider mb-3">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-[#22C55E] transition-colors">Home</Link></li>
              <li><Link to="/dashboard" className="hover:text-[#22C55E] transition-colors">Analysis Studio</Link></li>
              <li><Link to="/history" className="hover:text-[#22C55E] transition-colors">History & Archive</Link></li>
              <li><Link to="/about" className="hover:text-[#22C55E] transition-colors">About System</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider mb-3">Capabilities</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2"><Globe className="h-4 w-4 text-[#22C55E] shrink-0" /><span>Multimodal VLM Reasoning</span></li>
              <li className="flex items-center space-x-2"><Shield className="h-4 w-4 text-[#22C55E] shrink-0" /><span>Bi-Temporal Change Detection</span></li>
              <li className="flex items-center space-x-2"><Globe className="h-4 w-4 text-[#22C55E] shrink-0" /><span>Optical & SAR Fusion</span></li>
              <li className="flex items-center space-x-2"><Shield className="h-4 w-4 text-[#22C55E] shrink-0" /><span>PostGIS Spatial Intelligence</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider mb-3">Project</h3>
            <p className="text-sm text-[#A7B0AA] mb-3 leading-relaxed">
              Built for disaster response, environmental monitoring, and sustainable development.
            </p>
            <div className="flex items-center space-x-3 text-[#A7B0AA]">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-[#0B1711] hover:bg-[#101A15] border border-[#1A2E22] hover:text-[#F8FAFC] transition-colors"
                aria-label="GitHub Repository"
              >
                <Github className="h-5 w-5" />
              </a>
              <span className="text-xs text-[#A7B0AA]">v1.0.0 • Production Ready</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#1A2E22] flex flex-col sm:flex-row items-center justify-between text-xs text-[#A7B0AA]">
          <p>© {new Date().getFullYear()} TerraResQ Platform. All rights reserved.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Engineered with</span>
            <Heart className="h-3 w-3 text-[#22C55E] inline fill-[#22C55E]" />
            <span>for Earth Observation & Emergency Response</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
