import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, CheckCircle2, Clock, AlertTriangle, ExternalLink, MessageSquare } from 'lucide-react';

// Custom Leaflet DivIcons
const createCivilianIcon = () => {
  return L.divIcon({
    className: 'custom-civilian-pin',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
        <span style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background-color: rgba(59, 130, 246, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
        <div style="width: 28px; height: 28px; border-radius: 50%; background-color: #1d4ed8; border: 3px solid #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: bold; font-size: 13px;">
          📍
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

const createProjectIcon = (isCompleted) => {
  const bgColor = isCompleted ? '#059669' : '#d97706';
  const iconEmoji = isCompleted ? '✓' : '🏗️';
  return L.divIcon({
    className: 'custom-project-pin',
    html: `
      <div style="width: 30px; height: 30px; border-radius: 50%; background-color: ${bgColor}; border: 2.5px solid #ffffff; box-shadow: 0 3px 6px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 13px; font-weight: bold; cursor: pointer;">
        ${iconEmoji}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

// Map Viewport Controller to smooth fly to center
function MapController({ center, zoom = 11 }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function CivilianProjectMap({
  civilianCoords,
  projects = [],
  radiusKm = 25,
  onSelectProject,
  onGiveFeedback,
  onReportIssue,
  height = '500px',
  className = '',
}) {
  const centerLat = civilianCoords?.latitude || civilianCoords?.lat || 23.0225;
  const centerLng = civilianCoords?.longitude || civilianCoords?.lng || 72.5714;
  const center = [centerLat, centerLng];

  // Circle radius in meters
  const radiusMeters = (radiusKm || 25) * 1000;

  return (
    <div className={`relative rounded-xl overflow-hidden border border-slate-200 shadow-sm ${className}`} style={{ height }}>
      {/* Map Legend Overlay */}
      <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg p-3 shadow-md text-xs space-y-2 max-w-[200px]">
        <div className="font-bold text-slate-800 border-b border-slate-100 pb-1 flex items-center justify-between">
          <span>Map Legend</span>
          <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
            {radiusKm} km Zone
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <span className="w-3.5 h-3.5 rounded-full bg-blue-600 border border-white shrink-0"></span>
          <span>Your Location</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-white shrink-0"></span>
          <span>Ongoing Project</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 border border-white shrink-0"></span>
          <span>Completed Project</span>
        </div>
        <div className="pt-1 text-[10px] text-slate-500 border-t border-slate-100">
          Radius circle shows the {radiusKm} km geographic discovery boundary.
        </div>
      </div>

      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <MapController center={center} zoom={11} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 25 KM Radius Circle */}
        {civilianCoords && (
          <Circle
            center={center}
            radius={radiusMeters}
            pathOptions={{
              color: '#2563eb',
              fillColor: '#3b82f6',
              fillOpacity: 0.08,
              weight: 2,
              dashArray: '4, 4',
            }}
          />
        )}

        {/* Civilian Marker */}
        {civilianCoords && (
          <Marker position={center} icon={createCivilianIcon()}>
            <Popup>
              <div className="p-1 space-y-1 text-xs">
                <div className="font-bold text-blue-900 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  Your Civilian Location
                </div>
                <p className="text-slate-600 text-[11px]">
                  Center of your {radiusKm} km public project discovery radius.
                </p>
                <div className="font-mono text-[10px] text-slate-500">
                  {centerLat.toFixed(4)}° N, {centerLng.toFixed(4)}° E
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Nearby Projects Markers */}
        {projects.map((p) => {
          if (!p.latitude || !p.longitude) return null;
          const isCompleted = p.isCompleted || p.completionStatus === 'Completed' || p.status === 'Completed';
          const pos = [p.latitude, p.longitude];

          return (
            <Marker
              key={p.projectId || p.id}
              position={pos}
              icon={createProjectIcon(isCompleted)}
            >
              <Popup>
                <div className="p-1 max-w-[240px] space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
                    <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-semibold">
                      #{p.projectId || p.id}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isCompleted ? 'Completed' : 'Ongoing'}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs leading-tight">
                    {p.projectName || p.name}
                  </h4>

                  <div className="text-[11px] text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Sector:</span>
                      <span className="font-medium text-slate-800 truncate max-w-[140px]">{p.sector || p.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Distance:</span>
                      <strong className="text-blue-700">{p.distanceKm || p.distance || 0} km</strong>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-1 pt-1">
                    {onSelectProject && (
                      <button
                        type="button"
                        onClick={() => onSelectProject(p)}
                        className="text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-2 py-1 rounded transition-colors"
                      >
                        Details
                      </button>
                    )}
                    {onGiveFeedback && (
                      <button
                        type="button"
                        onClick={() => onGiveFeedback(p)}
                        className="text-[10px] bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold px-2 py-1 rounded transition-colors"
                      >
                        Feedback
                      </button>
                    )}
                    {onReportIssue && (
                      <button
                        type="button"
                        onClick={() => onReportIssue(p)}
                        className="text-[10px] bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold px-2 py-1 rounded transition-colors"
                      >
                        Issue
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
