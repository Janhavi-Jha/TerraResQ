import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Rectangle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Layers } from 'lucide-react';

// Fix for default Leaflet icon paths in Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to dynamically fit bounds
const BoundsFitter = ({ bounds }) => {
  const map = useMap();
  React.useEffect(() => {
    if (bounds && bounds.length === 2) {
      try {
        map.fitBounds(bounds, { padding: [30, 30] });
      } catch (err) {
        console.warn('Could not fit map bounds:', err);
      }
    }
  }, [bounds, map]);
  return null;
};

const MapView = ({
  bounds, // [minLat, minLon, maxLat, maxLon] or [[lat1, lon1], [lat2, lon2]]
  center = [28.6139, 77.2090], // Default center
  zoom = 10,
  title = 'Geospatial Location & Footprint',
  detectedRegions = [],
}) => {
  // Normalize bounds format to [[south, west], [north, east]]
  const normalizedBounds = useMemo(() => {
    if (!bounds) return null;
    if (Array.isArray(bounds) && bounds.length === 4) {
      // Typically [minX, minY, maxX, maxY] or [west, south, east, north]
      const [west, south, east, north] = bounds;
      // Sanity check coordinates
      if (south >= -90 && south <= 90 && north >= -90 && north <= 90) {
        return [
          [south, west],
          [north, east],
        ];
      }
    }
    if (Array.isArray(bounds) && bounds.length === 2 && Array.isArray(bounds[0])) {
      return bounds;
    }
    return null;
  }, [bounds]);

  const mapCenter = useMemo(() => {
    if (normalizedBounds) {
      return [
        (normalizedBounds[0][0] + normalizedBounds[1][0]) / 2,
        (normalizedBounds[0][1] + normalizedBounds[1][1]) / 2,
      ];
    }
    return center;
  }, [normalizedBounds, center]);

  return (
    <div className="bg-space-800/80 border border-space-700 rounded-xl overflow-hidden shadow-lg">
      <div className="px-4 py-3 bg-space-900/80 border-b border-space-700 flex items-center justify-between text-xs text-gray-300">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-earth-400" />
          <span className="font-semibold text-white">{title}</span>
        </div>
        <span className="text-[11px] text-gray-400 font-mono">
          EPSG:4326 (WGS 84)
        </span>
      </div>

      <div className="relative w-full h-[360px] bg-space-900">
        <MapContainer
          center={mapCenter}
          zoom={zoom}
          scrollWheelZoom={false}
          className="w-full h-full z-0"
        >
          {/* Satellite Hybrid / OpenStreetMap TileLayer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {normalizedBounds && (
            <>
              <Rectangle
                bounds={normalizedBounds}
                pathOptions={{
                  color: '#4ade80',
                  weight: 2,
                  fillColor: '#4ade80',
                  fillOpacity: 0.15,
                }}
              />
              <BoundsFitter bounds={normalizedBounds} />
            </>
          )}

          <Marker position={mapCenter}>
            <Popup>
              <div className="text-xs text-space-900 p-1">
                <p className="font-bold">Target Region</p>
                <p>Lat: {mapCenter[0].toFixed(4)}, Lon: {mapCenter[1].toFixed(4)}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
