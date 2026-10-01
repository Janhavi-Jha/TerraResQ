import React, { useState } from 'react';
import { Maximize2, Minimize2, Image as ImageIcon, Layers } from 'lucide-react';

const ImagePreview = ({ src, alt = 'Satellite Image Preview', metadata = {} }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!src) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-space-800/40 border border-dashed border-space-700 rounded-xl text-gray-500">
        <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
        <p className="text-sm">No image available for preview</p>
      </div>
    );
  }

  return (
    <div className="relative bg-space-800/60 border border-space-700 rounded-xl overflow-hidden group">
      {/* Header bar */}
      <div className="px-4 py-2.5 bg-space-900/80 border-b border-space-700/80 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center space-x-2 truncate">
          <Layers className="w-3.5 h-3.5 text-earth-400 shrink-0" />
          <span className="truncate font-medium text-gray-300">
            {metadata.filename || alt}
          </span>
          {metadata.is_geotiff && (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-earth-950 text-earth-400 border border-earth-800">
              GeoTIFF
            </span>
          )}
        </div>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-1 hover:bg-space-700 rounded text-gray-400 hover:text-white transition-colors"
          title={isFullscreen ? 'Exit full view' : 'Expand full view'}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Image container */}
      <div className={`relative flex items-center justify-center bg-black/40 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 p-8 bg-black/90' : 'max-h-[420px]'}`}>
        {isFullscreen && (
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-2 bg-space-800/80 text-white rounded-lg hover:bg-space-700 z-10"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        )}
        <img
          src={src}
          alt={alt}
          className={`object-contain transition-transform duration-200 ${isFullscreen ? 'max-h-[90vh] max-w-[90vw]' : 'w-full h-auto max-h-[420px]'}`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80';
          }}
        />
      </div>

      {/* Footer metadata */}
      {(metadata.width || metadata.bands || metadata.crs) && (
        <div className="px-4 py-2 bg-space-900/60 border-t border-space-700/60 flex flex-wrap gap-3 text-[11px] text-gray-400">
          {metadata.width && metadata.height && (
            <span>Dimensions: {metadata.width} × {metadata.height}px</span>
          )}
          {metadata.bands && <span>Bands: {metadata.bands}</span>}
          {metadata.crs && <span className="truncate max-w-[200px]">CRS: {metadata.crs}</span>}
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
