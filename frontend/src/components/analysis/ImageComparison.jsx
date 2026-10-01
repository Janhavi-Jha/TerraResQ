import React, { useState } from 'react';
import { Columns, SplitSquareVertical, Sliders } from 'lucide-react';

const ImageComparison = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Time T1 (Before)',
  afterLabel = 'Time T2 (After)',
}) => {
  const [viewMode, setViewMode] = useState('side-by-side'); // 'side-by-side' | 'slider'
  const [sliderPosition, setSliderPosition] = useState(50);

  const defaultPlaceholder1 = 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80';
  const defaultPlaceholder2 = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80';

  const img1 = beforeImage || defaultPlaceholder1;
  const img2 = afterImage || defaultPlaceholder2;

  return (
    <div className="bg-space-800/70 border border-space-700 rounded-xl overflow-hidden shadow-lg">
      {/* View controls */}
      <div className="px-4 py-3 bg-space-900/80 border-b border-space-700 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <span>Temporal Imagery Comparison</span>
        </h3>

        <div className="flex items-center space-x-1 bg-space-800 p-1 rounded-lg border border-space-700 text-xs">
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded transition-colors ${
              viewMode === 'side-by-side'
                ? 'bg-earth-600 text-white font-medium'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Side-by-Side</span>
          </button>
          <button
            onClick={() => setViewMode('slider')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded transition-colors ${
              viewMode === 'slider'
                ? 'bg-earth-600 text-white font-medium'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Split Slider</span>
          </button>
        </div>
      </div>

      {/* Comparison Body */}
      <div className="p-4">
        {viewMode === 'side-by-side' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-medium text-gray-300 bg-space-700/60 px-2.5 py-1 rounded border border-space-600 inline-block">
                {beforeLabel}
              </span>
              <div className="relative rounded-lg overflow-hidden border border-space-700 bg-black/40 aspect-video flex items-center justify-center">
                <img
                  src={img1}
                  alt={beforeLabel}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-medium text-earth-400 bg-space-700/60 px-2.5 py-1 rounded border border-space-600 inline-block">
                {afterLabel}
              </span>
              <div className="relative rounded-lg overflow-hidden border border-space-700 bg-black/40 aspect-video flex items-center justify-center">
                <img
                  src={img2}
                  alt={afterLabel}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-space-700 select-none bg-black/40">
              {/* After image (Background) */}
              <img
                src={img2}
                alt={afterLabel}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Before image (Foreground with clip-path) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <img
                  src={img1}
                  alt={beforeLabel}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* Slider separator line */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-earth-400 shadow-[0_0_10px_rgba(74,222,128,0.8)] cursor-ew-resize flex items-center justify-center"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-6 h-6 bg-earth-500 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[10px] text-space-900 font-bold">
                  ↔
                </div>
              </div>

              {/* Labels overlay */}
              <div className="absolute top-3 left-3 bg-space-900/80 backdrop-blur-sm px-2.5 py-1 rounded text-xs text-white border border-space-700">
                {beforeLabel}
              </div>
              <div className="absolute top-3 right-3 bg-space-900/80 backdrop-blur-sm px-2.5 py-1 rounded text-xs text-earth-400 border border-space-700">
                {afterLabel}
              </div>
            </div>

            {/* Slider control input */}
            <div className="flex items-center space-x-3">
              <span className="text-xs text-gray-400">Before</span>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="flex-1 accent-earth-500 bg-space-700 h-2 rounded-lg cursor-pointer"
              />
              <span className="text-xs text-gray-400">After</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageComparison;
