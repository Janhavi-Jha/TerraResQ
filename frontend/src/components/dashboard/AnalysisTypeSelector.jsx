import React from 'react';
import { Image, GitCompare, Radio, Search, Grid } from 'lucide-react';

const ANALYSIS_TYPES = [
  {
    id: 'single_image',
    label: 'Single Image Analysis',
    description: 'Analyze a single satellite image',
    icon: Image,
    minImages: 1,
    maxImages: 1,
  },
  {
    id: 'change_detection',
    label: 'Change Detection',
    description: 'Compare two temporal images',
    icon: GitCompare,
    minImages: 2,
    maxImages: 2,
  },
  {
    id: 'object_detection',
    label: 'Object Detection',
    description: 'Detect buildings, roads, vehicles',
    icon: Grid,
    minImages: 1,
    maxImages: 1,
  },
  {
    id: 'vqa',
    label: 'Visual Q&A',
    description: 'Ask questions about imagery',
    icon: Search,
    minImages: 1,
    maxImages: 2,
  },
  {
    id: 'custom',
    label: 'Auto-detect',
    description: 'AI selects best analysis type',
    icon: Radio,
    minImages: 1,
    maxImages: 2,
  },
];

const AnalysisTypeSelector = ({ selected, onChange, numImages }) => {
  return (
    <div className="space-y-3">
      <label className="text-lg font-medium text-white">Analysis Type</label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {ANALYSIS_TYPES.map((type) => {
          const Icon = type.icon;
          const isCompatible = numImages >= type.minImages && numImages <= type.maxImages;
          const isSelected = selected === type.id;
          
          return (
            <button
              key={type.id}
              onClick={() => isCompatible && onChange(type.id)}
              disabled={!isCompatible}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                isSelected
                  ? 'border-earth-500 bg-earth-500/10'
                  : isCompatible
                  ? 'border-space-700 bg-space-800 hover:border-earth-500/50'
                  : 'border-space-700 bg-space-800/30 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start space-x-3">
                <Icon className={`h-6 w-6 mt-0.5 ${isSelected ? 'text-earth-500' : 'text-gray-400'}`} />
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium mb-1 ${isSelected ? 'text-earth-500' : 'text-white'}`}>
                    {type.label}
                  </h3>
                  <p className="text-sm text-gray-400">{type.description}</p>
                  {!isCompatible && (
                    <p className="text-xs text-red-400 mt-2">
                      Requires {type.minImages === type.maxImages ? type.minImages : `${type.minImages}-${type.maxImages}`} image(s)
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AnalysisTypeSelector;