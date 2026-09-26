import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Search, 
  Layers, 
  MapPin, 
  Filter, 
  Maximize2, 
  Compass, 
  Navigation, 
  Check, 
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { 
  BusinessProfile, 
  LocationAnalysisResult, 
  MapLayerState, 
  PointOfInterest, 
  BusinessEvent,
  ProvinceId
} from '../types';
import { REAL_POIS, REAL_EVENTS, PROVINCES_DATA } from '../data/cagayanValleyData';

interface GisMapProps {
  businessProfile: BusinessProfile;
  selectedLocation: { lat: number; lng: number };
  radiusKm: number;
  layers: MapLayerState;
  onLocationChange: (lat: number, lng: number, addressLabel?: string) => void;
  onRadiusChange: (radiusKm: number) => void;
  onToggleLayer: (layerName: keyof MapLayerState) => void;
  analysisResult: LocationAnalysisResult | null;
  onInspectPoi?: (poi: PointOfInterest) => void;
  onInspectEvent?: (event: BusinessEvent) => void;
}

// Marker custom icon generator
function createCustomPin(color: string, label: string) {
  return L.divIcon({
    className: 'custom-cayabiz-pin',
    html: `
      <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        <div style="width: 28px; height: 28px; background-color: ${color}; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 4px 10px rgba(0,0,0,0.5); border: 2px solid #ffffff; display: flex; align-items: center; justify-content: center;">
        </div>
        <div style="position: absolute; top: 5px; color: #ffffff; font-weight: 700; font-size: 10px; font-family: monospace;">
          ${label}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
}

const PIN_ICONS = {
  selectedPin: L.divIcon({
    className: 'selected-drag-pin',
    html: `
      <div style="position: relative; width: 36px; height: 42px; display: flex; flex-direction: column; align-items: center;">
        <div style="width: 32px; height: 32px; background: #2563eb; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 6px 16px rgba(37,99,235,0.6); border: 2.5px solid #ffffff; display: flex; align-items: center; justify-content: center;">
          <div style="width: 10px; height: 10px; background: #ffffff; border-radius: 50%; transform: rotate(45deg);"></div>
        </div>
        <div style="margin-top: -3px; width: 14px; height: 4px; background: rgba(0,0,0,0.4); border-radius: 50%; filter: blur(1px);"></div>
      </div>
    `,
    iconSize: [36, 42],
    iconAnchor: [18, 38],
    popupAnchor: [0, -38]
  }),
  School: createCustomPin('#3b82f6', 'U'),
  Commercial: createCustomPin('#8b5cf6', 'M'),
  Cafe: createCustomPin('#ec4899', 'C'),
  'F&B': createCustomPin('#ef4444', 'F'),
  Restaurant: createCustomPin('#f97316', 'R'),
  Hospital: createCustomPin('#10b981', 'H'),
  Transport: createCustomPin('#06b6d4', 'T'),
  Government: createCustomPin('#64748b', 'G'),
  Tourism: createCustomPin('#eab308', 'V'),
  Event: L.divIcon({
    className: 'custom-event-pin',
    html: `
      <div style="position: relative; width: 30px; height: 30px; background: #f59e0b; border: 2px solid #ffffff; border-radius: 6px; transform: rotate(45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(245,158,11,0.5);">
        <span style="transform: rotate(-45deg); font-size: 11px; font-weight: 800; color: #ffffff;">★</span>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  })
};

export const GisMap: React.FC<GisMapProps> = ({
  businessProfile,
  selectedLocation,
  radiusKm,
  layers,
  onLocationChange,
  onRadiusChange,
  onToggleLayer,
  analysisResult,
  onInspectPoi,
  onInspectEvent
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const dragMarkerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const poisLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const eventsLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [layerDropdownOpen, setLayerDropdownOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<ProvinceId>('cagayan');
  const [baseMapStyle, setBaseMapStyle] = useState<'maptiler' | 'satellite' | 'streets'>('maptiler');

  // Search shortcuts
  const QUICK_SEARCH_TARGETS = [
    { label: 'St. Paul University Philippines (SPUP)', lat: 17.61925, lng: 121.72202, prov: 'cagayan' as ProvinceId },
    { label: 'USLT Mabini Campus', lat: 17.61014, lng: 121.72366, prov: 'cagayan' as ProvinceId },
    { label: 'CSU Andrews Campus (Caritan)', lat: 17.61961, lng: 121.72537, prov: 'cagayan' as ProvinceId },
    { label: 'Tuguegarao Centro / SM Downtown', lat: 17.6127, lng: 121.7236, prov: 'cagayan' as ProvinceId },
    { label: 'Robinsons Place Tuguegarao (Tanza)', lat: 17.6283, lng: 121.7327, prov: 'cagayan' as ProvinceId },
    { label: 'SM City Tuguegarao (Bagay Road)', lat: 17.6278, lng: 121.7186, prov: 'cagayan' as ProvinceId },
    { label: 'Buntun Food Corridor / Jollibee', lat: 17.6148, lng: 121.7065, prov: 'cagayan' as ProvinceId },
    { label: 'SM City Cauayan (Isabela)', lat: 16.9280, lng: 121.7750, prov: 'isabela' as ProvinceId },
    { label: 'Santiago City (Isabela)', lat: 16.6900, lng: 121.5450, prov: 'isabela' as ProvinceId },
    { label: 'SMU Bayombong (N. Vizcaya)', lat: 16.4820, lng: 121.1490, prov: 'nueva_vizcaya' as ProvinceId },
    { label: 'Basco Town Center (Batanes)', lat: 20.4490, lng: 121.9680, prov: 'batanes' as ProvinceId }
  ];

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Professional CartoDB Voyager tiles for clear business analytics
    const map = L.map(mapContainerRef.current, {
      center: [selectedLocation.lat, selectedLocation.lng],
      zoom: 15,
      zoomControl: false,
    });

    // Base map tile layer using user provided MapTiler / Google-compatible GIS API
    const maptilerUrl = 'https://api.maptiler.com/maps/landscape-v4/{z}/{x}/{y}.png?key=cW7VSEyIonZj1gl0M7Os';
    const tileLayer = L.tileLayer(maptilerUrl, {
      attribution: '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>',
      maxZoom: 20,
      tileSize: 512,
      zoomOffset: -1,
      crossOrigin: true
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Draggable Location Pin (Foodpanda-style)
    const marker = L.marker([selectedLocation.lat, selectedLocation.lng], {
      icon: PIN_ICONS.selectedPin,
      draggable: true,
      zIndexOffset: 1000
    }).addTo(map);

    marker.bindPopup(`
      <div style="font-family: inherit; font-size: 13px;">
        <strong style="color: #ffffff; display: block; margin-bottom: 2px;">Selected Potential Business Site</strong>
        <span style="color: #94a3b8; font-size: 11px;">Drag anywhere to reposition · Click map to drop</span>
      </div>
    `);

    marker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      onLocationChange(pos.lat, pos.lng);
    });

    // Map click to drop pin anywhere
    map.on('click', (e) => {
      marker.setLatLng(e.latlng);
      onLocationChange(e.latlng.lat, e.latlng.lng);
    });

    // Dynamic radius buffer
    const circle = L.circle([selectedLocation.lat, selectedLocation.lng], {
      radius: radiusKm * 1000,
      color: '#2563eb',
      fillColor: '#3b82f6',
      fillOpacity: 0.08,
      weight: 1.5,
      dashArray: '4, 6'
    }).addTo(map);

    const poisGroup = L.layerGroup().addTo(map);
    const eventsGroup = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    dragMarkerRef.current = marker;
    circleRef.current = circle;
    poisLayerGroupRef.current = poisGroup;
    eventsLayerGroupRef.current = eventsGroup;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Base Map Style if changed
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    let url = 'https://api.maptiler.com/maps/landscape-v4/{z}/{x}/{y}.png?key=cW7VSEyIonZj1gl0M7Os';
    let attribution = '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>';
    let maxZoom = 20;

    if (baseMapStyle === 'satellite') {
      url = 'https://api.maptiler.com/maps/satellite-v2/{z}/{x}/{y}.jpg?key=cW7VSEyIonZj1gl0M7Os';
    } else if (baseMapStyle === 'streets') {
      url = 'https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=cW7VSEyIonZj1gl0M7Os';
    }

    const newLayer = L.tileLayer(url, {
      attribution,
      maxZoom,
      tileSize: 512,
      zoomOffset: -1,
      crossOrigin: true
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newLayer;
  }, [baseMapStyle]);

  // Update Pin & Circle when selectedLocation or radius changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (dragMarkerRef.current) {
      dragMarkerRef.current.setLatLng([selectedLocation.lat, selectedLocation.lng]);
    }
    if (circleRef.current) {
      circleRef.current.setLatLng([selectedLocation.lat, selectedLocation.lng]);
      circleRef.current.setRadius(radiusKm * 1000);
    }
  }, [selectedLocation, radiusKm]);

  // Render POI Markers based on active layers
  useEffect(() => {
    if (!poisLayerGroupRef.current || !mapInstanceRef.current) return;
    const group = poisLayerGroupRef.current;
    group.clearLayers();

    REAL_POIS.forEach((poi) => {
      // Filter by layer
      if (poi.category === 'School' && !layers.schools) return;
      if (poi.category === 'Commercial' && !layers.commercial) return;
      if (poi.category === 'Transport' && !layers.transport) return;
      if (
        (poi.category === 'F&B' || poi.category === 'Cafe' || poi.category === 'Restaurant') &&
        !layers.businesses &&
        !layers.competition
      ) {
        return;
      }

      const icon = PIN_ICONS[poi.category as keyof typeof PIN_ICONS] || PIN_ICONS.Commercial;
      const marker = L.marker([poi.lat, poi.lng], { icon });

      const dist = (
        L.latLng(selectedLocation.lat, selectedLocation.lng).distanceTo(L.latLng(poi.lat, poi.lng)) / 1000
      ).toFixed(2);

      const isCompetitor =
        (businessProfile.category === 'Food & Beverage' ||
          businessProfile.category === 'Café' ||
          businessProfile.category === 'Restaurant') &&
        (poi.category === 'F&B' || poi.category === 'Cafe' || poi.category === 'Restaurant');

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; max-width: 250px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 700; color: #60a5fa; text-transform: uppercase;">
              ${poi.subCategory || poi.category}
            </span>
            <span style="font-size: 10px; color: #94a3b8; font-family: monospace;">
              ${dist} km from pin
            </span>
          </div>

          <strong style="font-size: 14px; color: #ffffff; display: block; line-height: 1.3; margin-bottom: 4px;">
            ${poi.name}
          </strong>

          <div style="color: #cbd5e1; font-size: 11px; margin-bottom: 6px;">
            ${poi.address}
          </div>

          ${
            poi.populationOrFootTraffic
              ? `<div style="font-size: 11px; color: #38bdf8; margin-bottom: 4px; font-family: monospace;">
                   Catchment: ~${poi.populationOrFootTraffic.toLocaleString()} persons
                 </div>`
              : ''
          }

          ${
            isCompetitor
              ? `<div style="background: rgba(239,68,68,0.2); border: 1px solid rgba(239,68,68,0.4); color: #fca5a5; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600; margin-bottom: 6px; display: inline-block;">
                   Category Competitor (${businessProfile.category})
                 </div>`
              : ''
          }

          <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 6px; margin-top: 6px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 9px; color: #10b981; font-weight: 600;">
              ${poi.dataStatus}
            </span>
            <span style="font-size: 9px; color: #64748b;">
              ${poi.source.split('/')[0]}
            </span>
          </div>
        </div>
      `);

      marker.on('click', () => {
        if (onInspectPoi) onInspectPoi(poi);
      });

      group.addLayer(marker);
    });
  }, [layers, selectedLocation, businessProfile]);

  // Render Event Markers
  useEffect(() => {
    if (!eventsLayerGroupRef.current || !mapInstanceRef.current) return;
    const group = eventsLayerGroupRef.current;
    group.clearLayers();

    if (!layers.events) return;

    REAL_EVENTS.forEach((evt) => {
      const marker = L.marker([evt.lat, evt.lng], { icon: PIN_ICONS.Event });
      const dist = (
        L.latLng(selectedLocation.lat, selectedLocation.lng).distanceTo(L.latLng(evt.lat, evt.lng)) / 1000
      ).toFixed(2);

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; max-width: 260px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 700; color: #fbbf24; text-transform: uppercase;">
              ★ ${evt.type}
            </span>
            <span style="font-size: 10px; color: #94a3b8; font-family: monospace;">
              ${dist} km
            </span>
          </div>

          <strong style="font-size: 14px; color: #ffffff; display: block; line-height: 1.3; margin-bottom: 4px;">
            ${evt.name}
          </strong>

          <div style="color: #cbd5e1; font-size: 11px; margin-bottom: 4px;">
            📅 ${evt.dateStart} to ${evt.dateEnd}
          </div>

          <div style="color: #cbd5e1; font-size: 11px; margin-bottom: 6px;">
            📍 ${evt.venue}
          </div>

          <div style="background: rgba(245,158,11,0.2); border: 1px solid rgba(245,158,11,0.4); color: #fde68a; padding: 3px 6px; border-radius: 4px; font-size: 10px; font-weight: 600; margin-bottom: 6px;">
            Vendor Opportunity: ${evt.vendorOpportunity}
          </div>

          <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 4px; font-size: 9px; color: #94a3b8;">
            Expected Audience: ${evt.expectedAudience || 'Official Figures Pending'}
          </div>
        </div>
      `);

      marker.on('click', () => {
        if (onInspectEvent) onInspectEvent(evt);
      });

      group.addLayer(marker);
    });
  }, [layers.events, selectedLocation]);

  // Fly to province center
  const handleSelectProvince = (provId: ProvinceId) => {
    setSelectedProvince(provId);
    const prov = PROVINCES_DATA[provId];
    if (mapInstanceRef.current && prov) {
      mapInstanceRef.current.flyTo(prov.center, prov.zoom, { duration: 1.2 });
      onLocationChange(prov.center[0], prov.center[1], `${prov.name} Capital Center`);
    }
  };

  // Fly to search target
  const handleQuickJump = (item: (typeof QUICK_SEARCH_TARGETS)[0]) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([item.lat, item.lng], 16, { duration: 1.2 });
      onLocationChange(item.lat, item.lng, item.label);
    }
    setSearchQuery('');
  };

  const filteredSearch = QUICK_SEARCH_TARGETS.filter((t) =>
    t.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950 flex flex-col">
      
      {/* Top Floating GIS Navigation Bar */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Search Bar */}
        <div className="pointer-events-auto relative w-full sm:w-80 md:w-96 shadow-xl">
          <div className="flex items-center bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Tuguegarao, malls, universities..."
              className="bg-transparent border-none outline-none w-full text-xs sm:text-sm text-white placeholder-slate-500"
            />
          </div>

          {/* Search Dropdown Results */}
          {searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl overflow-hidden py-1 max-h-60 overflow-y-auto">
              {filteredSearch.length > 0 ? (
                filteredSearch.map((target, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickJump(target)}
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>{target.label}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">
                      {target.prov}
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-3.5 py-2 text-xs text-slate-500">
                  No matching registered POI found in Region II.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Floating Controls: Province Selector & Radius Slider */}
        <div className="pointer-events-auto flex items-center gap-2">
          
          {/* Province Zoom Buttons */}
          <div className="hidden lg:flex items-center bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-1 text-xs">
            {(Object.keys(PROVINCES_DATA) as ProvinceId[]).map((pId) => {
              const p = PROVINCES_DATA[pId];
              const isActive = selectedProvince === pId;
              return (
                <button
                  key={pId}
                  onClick={() => handleSelectProvince(pId)}
                  className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer font-medium ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>

          {/* Radius Selector */}
          <div className="flex items-center bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white shadow-xl">
            <span className="text-slate-400 mr-2 font-mono">Radius:</span>
            <div className="flex items-center gap-1">
              {[0.5, 1.0, 2.0, 5.0].map((r) => (
                <button
                  key={r}
                  onClick={() => onRadiusChange(r)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                    radiusKm === r
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {r}km
                </button>
              ))}
            </div>
          </div>

          {/* Map Layer Menu Button */}
          <div className="relative">
            <button
              onClick={() => setLayerDropdownOpen(!layerDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl text-xs font-semibold text-white shadow-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Layers</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Layer Toggles Popover */}
            {layerDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl p-3 space-y-2 text-xs">
                <div className="font-semibold text-slate-300 border-b border-slate-800 pb-1.5 text-[11px] uppercase tracking-wider font-mono">
                  Base Map Tile Provider
                </div>

                <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-medium">
                  <button
                    type="button"
                    onClick={() => setBaseMapStyle('maptiler')}
                    className={`py-1 text-center rounded transition-colors cursor-pointer ${
                      baseMapStyle === 'maptiler' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Landscape
                  </button>
                  <button
                    type="button"
                    onClick={() => setBaseMapStyle('satellite')}
                    className={`py-1 text-center rounded transition-colors cursor-pointer ${
                      baseMapStyle === 'satellite' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Satellite
                  </button>
                  <button
                    type="button"
                    onClick={() => setBaseMapStyle('streets')}
                    className={`py-1 text-center rounded transition-colors cursor-pointer ${
                      baseMapStyle === 'streets' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Streets
                  </button>
                </div>

                <div className="font-semibold text-slate-300 border-b border-slate-800 pt-2 pb-1.5 text-[11px] uppercase tracking-wider font-mono">
                  Toggle GIS Map Layers
                </div>

                <label className="flex items-center justify-between text-slate-200 cursor-pointer hover:bg-slate-800/60 p-1.5 rounded">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span>Universities & Schools</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layers.schools}
                    onChange={() => onToggleLayer('schools')}
                    className="accent-blue-600 w-3.5 h-3.5"
                  />
                </label>

                <label className="flex items-center justify-between text-slate-200 cursor-pointer hover:bg-slate-800/60 p-1.5 rounded">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <span>Commercial Malls & Retail</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layers.commercial}
                    onChange={() => onToggleLayer('commercial')}
                    className="accent-purple-600 w-3.5 h-3.5"
                  />
                </label>

                <label className="flex items-center justify-between text-slate-200 cursor-pointer hover:bg-slate-800/60 p-1.5 rounded">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span>Existing F&B / Competitors</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layers.businesses}
                    onChange={() => onToggleLayer('businesses')}
                    className="accent-red-600 w-3.5 h-3.5"
                  />
                </label>

                <label className="flex items-center justify-between text-slate-200 cursor-pointer hover:bg-slate-800/60 p-1.5 rounded">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                    <span>Transport Hubs & Terminals</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layers.transport}
                    onChange={() => onToggleLayer('transport')}
                    className="accent-cyan-600 w-3.5 h-3.5"
                  />
                </label>

                <label className="flex items-center justify-between text-slate-200 cursor-pointer hover:bg-slate-800/60 p-1.5 rounded">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="font-semibold text-amber-300">Upcoming Regional Events</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layers.events}
                    onChange={() => onToggleLayer('events')}
                    className="accent-amber-500 w-3.5 h-3.5"
                  />
                </label>

                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
                  Base data: OpenStreetMap & Public Directories
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Main Leaflet Map Viewport */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Bottom Floating Instructions Badge */}
      <div className="absolute bottom-4 left-4 z-[400] bg-slate-900/90 backdrop-blur-md border border-slate-800 text-slate-300 text-xs px-3.5 py-2 rounded-xl shadow-xl flex items-center gap-2 pointer-events-none">
        <MapPin className="w-4 h-4 text-blue-400 animate-bounce" />
        <span>
          <strong className="text-white">Click map</strong> or <strong className="text-white">drag blue pin</strong> to analyze a site.
        </span>
      </div>

    </div>
  );
};
