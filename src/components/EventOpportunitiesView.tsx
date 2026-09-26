import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Store, 
  ExternalLink, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  Tag
} from 'lucide-react';
import { REAL_EVENTS } from '../data/cagayanValleyData';
import { BusinessEvent, ProvinceId, EventType, VendorStatus } from '../types';

interface EventOpportunitiesViewProps {
  onLocateEventOnMap: (lat: number, lng: number, eventName: string) => void;
}

export const EventOpportunitiesView: React.FC<EventOpportunitiesViewProps> = ({
  onLocateEventOnMap
}) => {
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedVendorStatus, setSelectedVendorStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEvents = REAL_EVENTS.filter((evt) => {
    if (selectedProvince !== 'all' && evt.province !== selectedProvince) return false;
    if (selectedType !== 'all' && evt.type !== selectedType) return false;
    if (selectedVendorStatus !== 'all' && evt.vendorOpportunity !== selectedVendorStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        evt.name.toLowerCase().includes(q) ||
        evt.venue.toLowerCase().includes(q) ||
        evt.municipality.toLowerCase().includes(q) ||
        evt.organizer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold mb-2">
            <Calendar className="w-4 h-4" />
            <span>High-Turnover Pop-Up & Vendor Opportunities</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Cagayan Valley Event Opportunities
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Engineered for food carts, beverage stalls, student entrepreneurs, printing services, and artisanal merchandise sellers looking for high-attendance festivals, university intramurals, and DTI trade expos.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Search Input */}
          <div className="relative">
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
              Search Event or Venue
            </label>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white">
              <Search className="w-3.5 h-3.5 text-slate-500 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Afi Festival, USLT..."
                className="bg-transparent border-none outline-none w-full text-white placeholder-slate-600"
              />
            </div>
          </div>

          {/* Province Filter */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
              Province
            </label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">All Provinces (Region II)</option>
              <option value="cagayan">Cagayan (Tuguegarao)</option>
              <option value="isabela">Isabela</option>
              <option value="nueva_vizcaya">Nueva Vizcaya</option>
              <option value="quirino">Quirino</option>
              <option value="batanes">Batanes</option>
            </select>
          </div>

          {/* Event Type Filter */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
              Event Category
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">All Event Types</option>
              <option value="School Event">University & School Fairs</option>
              <option value="City Festival">City Festivals</option>
              <option value="Provincial Festival">Provincial Festivals</option>
              <option value="Trade Fair">DTI & MSME Trade Fairs</option>
            </select>
          </div>

          {/* Vendor Opportunity Filter */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
              Vendor / Booth Status
            </label>
            <select
              value={selectedVendorStatus}
              onChange={(e) => setSelectedVendorStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Available">Vendor Space Available</option>
              <option value="For Confirmation">For Confirmation</option>
            </select>
          </div>

        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => {
            const isAvailable = evt.vendorOpportunity === 'Available';
            return (
              <div
                key={evt.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-xl"
              >
                <div>
                  
                  {/* Category & Status Row */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                      ★ {evt.type}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        isAvailable
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      Booth: {evt.vendorOpportunity}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                    {evt.name}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-400 font-mono mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{evt.dateStart} to {evt.dateEnd}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{evt.expectedAudience || 'Official Figures Pending'}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="text-emerald-400 font-semibold">{evt.dataStatus}</span>
                    <span className="truncate max-w-[160px]">{evt.source.split('/')[0]}</span>
                  </div>

                  <button
                    onClick={() => onLocateEventOnMap(evt.lat, evt.lng, evt.name)}
                    className="w-full py-2.5 bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    Locate Venue on GIS Map
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
