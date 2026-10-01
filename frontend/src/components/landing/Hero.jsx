import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, MessageSquare, Layers, GitCompare } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-12 sm:pt-16 pb-16 sm:pb-20">
      <div className="max-w-[1200px] w-full mx-auto px-6">
        {/* Centered Hero Content Column */}
        <div className="max-w-[800px] mx-auto flex flex-col items-center text-center">
          {/* 1. AI-POWERED REMOTE SENSING badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#101A15] text-[#34D399] border border-[#1A2E22] mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
            <span>AI-Powered Remote Sensing</span>
          </div>
          
          {/* 2. Main heading (10px below badge) */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#F8FAFC] tracking-tight leading-tight mb-2.5">
            Terra<span className="text-[#22C55E]">ResQ</span>
          </h1>
          
          {/* 3. Tagline (18px below heading) */}
          <p className="text-xl sm:text-2xl text-[#F8FAFC] font-medium tracking-tight mb-[18px]">
            See the Earth. Solve for Tomorrow.
          </p>
          
          {/* 4. Description (32px below tagline) */}
          <p className="text-base sm:text-lg text-[#A7B0AA] max-w-2xl leading-relaxed mb-8">
            Transform satellite imagery into actionable intelligence using natural-language
            queries, vision-language models, and multimodal SAR-optical fusion.
          </p>
          
          {/* 5. CTA Buttons Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-7 bg-[#22C55E] hover:bg-[#16a34a] text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow-[#22C55E]/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:ring-offset-2 focus:ring-offset-[#07120D] group"
            >
              <span>Start Analysis</span>
              <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/about"
              className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-7 bg-[#101A15] hover:bg-[#162B1F] text-[#F8FAFC] font-semibold text-sm rounded-lg border border-[#1A2E22] transition-colors focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
            >
              <span>Platform Overview</span>
            </Link>
          </div>
        </div>
        
        {/* 6. Feature Cards Grid (Desktop: 3 columns, Tablet: 2 columns, Mobile: 1 column) */}
        <div className="mt-16 sm:mt-20 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={MessageSquare}
            title="Natural Language VQA"
            description="Query geospatial scenes in plain English. No complex GIS scripting or manual band math required."
          />
          <FeatureCard
            icon={Layers}
            title="Multimodal Fusion"
            description="Co-register SAR radar channels through cloud cover and pair with optical multispectral imagery."
          />
          <FeatureCard
            icon={GitCompare}
            title="Bi-Temporal Change"
            description="Quantify surface shifts, disaster destruction, and environmental recovery between temporal passes."
          />
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="h-full flex flex-col justify-start bg-[#0B1711] border border-[#1A2E22] hover:border-[#22C55E]/30 rounded-xl p-6 transition-colors shadow-xs">
      <div className="w-10 h-10 rounded-lg bg-[#07120D] border border-[#1A2E22] flex items-center justify-center text-[#22C55E] mb-4 shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2">{title}</h3>
      <p className="text-[#A7B0AA] text-sm leading-relaxed flex-1">{description}</p>
    </div>
  );
};

export default Hero;