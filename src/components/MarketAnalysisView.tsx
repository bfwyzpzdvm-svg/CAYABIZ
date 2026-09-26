import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Building2, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  DollarSign,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { PROVINCES_DATA, DEMOGRAPHIC_INSIGHTS, REAL_POIS } from '../data/cagayanValleyData';
import { BusinessProfile, ProvinceId } from '../types';

interface MarketAnalysisViewProps {
  profile: BusinessProfile;
  onExploreOnMap: (lat: number, lng: number, label: string) => void;
}

export const MarketAnalysisView: React.FC<MarketAnalysisViewProps> = ({
  profile,
  onExploreOnMap
}) => {
  const [activeProvince, setActiveProvince] = useState<ProvinceId>('cagayan');
  const currentProv = PROVINCES_DATA[activeProvince];

  const poisInProvince = REAL_POIS.filter((p) => p.province === activeProvince);
  const schoolsInProvince = poisInProvince.filter((p) => p.category === 'School');
  const commercialInProvince = poisInProvince.filter((p) => p.category === 'Commercial');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold mb-2">
            <BarChart3 className="w-4 h-4" />
            <span>Region II Demographics & Economic Structure</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Cagayan Valley Market Intelligence
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Macro-demographic distributions, institutional catchments, and commercial density figures sourced from the Philippine Statistics Authority (PSA) and regional registries.
          </p>
        </div>

        {/* Dynamic Business Context Banner */}
        <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase text-blue-400 font-semibold block mb-1">
              Active Business Context
            </span>
            <h2 className="text-lg font-bold text-white">
              {profile.name} · {profile.category} targeting {profile.targetMarket}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              {profile.targetMarket === 'Students'
                ? 'Market analysis prioritized toward higher education enrollment hubs (USLT, CSU, SPUP, ISU, SMU) and youth discretionary spending.'
                : profile.targetMarket === 'Working Professionals'
                ? 'Market analysis prioritized toward regional administrative centers (Carig), tertiary healthcare clusters, and commercial financial districts.'
                : 'Market analysis focused on household purchasing power, mall anchors, and arterial transit hubs.'}
            </p>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-500 block">Est. Capital:</span>
              <span className="font-bold text-white">{profile.startingBudget}</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-slate-500 block">Scale:</span>
              <span className="font-bold text-white">{profile.businessSize}</span>
            </div>
          </div>
        </div>

        {/* Province Selector Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          {(Object.keys(PROVINCES_DATA) as ProvinceId[]).map((pId) => {
            const p = PROVINCES_DATA[pId];
            const isActive = activeProvince === pId;
            return (
              <button
                key={pId}
                onClick={() => setActiveProvince(pId)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>

        {/* Selected Province Detailed Demographic Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Overview & Population */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div>
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold block mb-1">
                Provincial Capital & Catchment
              </span>
              <h3 className="text-2xl font-bold text-white">{currentProv.name}</h3>
              <p className="text-xs text-blue-400 font-mono mt-0.5">Capital: {currentProv.capital}</p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentProv.description}
            </p>

            <div className="pt-4 border-t border-slate-800 space-y-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Population (PSA):</span>
                <span className="font-bold text-white tabular-nums">{currentProv.population.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Municipalities:</span>
                <span className="font-bold text-white">{currentProv.municipalitiesCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Component Cities:</span>
                <span className="font-bold text-white">{currentProv.citiesCount}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onExploreOnMap(currentProv.center[0], currentProv.center[1], `${currentProv.name} Capital`)}
                className="w-full py-2.5 bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" />
                Focus {currentProv.name} on GIS Map
              </button>
            </div>
          </div>

          {/* Card 2: Key Industries & Economic Drivers */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div>
              <span className="text-xs font-mono uppercase text-emerald-400 font-semibold block mb-1">
                Economic Drivers
              </span>
              <h3 className="text-xl font-bold text-white">Dominant Enterprise Sectors</h3>
            </div>

            <ul className="space-y-2 text-xs text-slate-300">
              {currentProv.keyIndustries.map((ind, i) => (
                <li key={i} className="flex items-center gap-2 p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{ind}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
              <span className="font-semibold text-slate-300 block mb-1">Regional Labor Participation:</span>
              <span>63.8% across Region II (Philippine Statistics Authority)</span>
            </div>
          </div>

          {/* Card 3: Institutional Presence in Province */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div>
              <span className="text-xs font-mono uppercase text-purple-400 font-semibold block mb-1">
                Commercial & Educational Anchors
              </span>
              <h3 className="text-xl font-bold text-white">Anchor Establishments</h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white block">Higher Ed / Schools</span>
                  <span className="text-slate-500 font-mono text-[11px]">{schoolsInProvince.length} major campuses mapped</span>
                </div>
                <GraduationCap className="w-5 h-5 text-blue-400" />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white block">Shopping & Retail Malls</span>
                  <span className="text-slate-500 font-mono text-[11px]">{commercialInProvince.length} regional/supermalls mapped</span>
                </div>
                <Building2 className="w-5 h-5 text-purple-400" />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Institutions provide verified anchor foot traffic. Proximity to these hubs significantly elevates target-market match and daily transaction volume.
            </p>
          </div>

        </div>

        {/* Regional Economic Hubs & Income Indicators Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-blue-400 font-semibold block mb-1">
                Purchasing Power Benchmarks
              </span>
              <h3 className="text-lg font-bold text-white">
                Major Urban Centers & Estimated Household Income
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
              PSA & LGU Tax Profiles
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 font-mono text-slate-400 uppercase text-[11px]">
                  <th className="pb-3">Economic Center</th>
                  <th className="pb-3">Strategic Regional Role</th>
                  <th className="pb-3 text-right">Estimated Monthly Household Income</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {DEMOGRAPHIC_INSIGHTS.regionalHubs.map((hub, i) => (
                  <tr key={i} className="hover:bg-slate-950/40">
                    <td className="py-3 font-bold text-white">{hub.name}</td>
                    <td className="py-3 text-slate-400">{hub.role}</td>
                    <td className="py-3 text-right font-mono font-semibold text-emerald-400 tabular-nums">
                      {hub.avgMonthlyHouseholdIncome}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
