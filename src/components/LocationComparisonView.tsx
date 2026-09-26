import React from 'react';
import { 
  Scale, 
  Trash2, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Compass,
  Building2
} from 'lucide-react';
import { LocationAnalysisResult, BusinessProfile } from '../types';

interface LocationComparisonViewProps {
  comparisonList: LocationAnalysisResult[];
  profile: BusinessProfile;
  onRemoveLocation: (index: number) => void;
  onSelectOnMap: (lat: number, lng: number) => void;
  onAddPresetLocation: (presetName: string) => void;
}

export const LocationComparisonView: React.FC<LocationComparisonViewProps> = ({
  comparisonList,
  profile,
  onRemoveLocation,
  onSelectOnMap,
  onAddPresetLocation
}) => {
  const PRESETS = [
    { name: 'SPUP & Mabini Corridor (Ugac Norte)', label: 'SPUP Student Corridor' },
    { name: 'USLT Student Corridor (Ugac Sur)', label: 'USLT Student Strip' },
    { name: 'SM City Tuguegarao (Bagay Road Node)', label: 'SM City Commercial Node' },
    { name: 'Buntun Commercial Strip (Highway Corridor)', label: 'Buntun Highway Strip' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold block mb-1">
              Multi-Site Decision Matrix
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Location Comparison Tool
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Compare potential business sites side-by-side across all 7 empirical factors. No location is labeled "guaranteed best"—evaluate specific trade-offs according to your operating model.
            </p>
          </div>

          {/* Quick preset buttons if empty or less than 3 */}
          {comparisonList.length < 3 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 font-mono">Load Demo Sites:</span>
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => onAddPresetLocation(p.name)}
                  className="px-3 py-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 rounded-lg transition-colors cursor-pointer"
                >
                  + {p.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Comparison Table / Matrix */}
        {comparisonList.length > 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                    <th className="p-4 sm:p-5 w-1/4">Evaluation Factor</th>
                    {comparisonList.map((loc, idx) => (
                      <th key={idx} className="p-4 sm:p-5 min-w-[220px]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-blue-400 font-bold">
                            Location {String.fromCharCode(65 + idx)}
                          </span>
                          <button
                            onClick={() => onRemoveLocation(idx)}
                            className="text-slate-500 hover:text-red-400 p-1 cursor-pointer transition-colors"
                            title="Remove from comparison"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-white font-bold text-sm truncate" title={loc.addressLabel}>
                          {loc.addressLabel}
                        </div>
                        <button
                          onClick={() => onSelectOnMap(loc.lat, loc.lng)}
                          className="mt-1 text-[11px] text-blue-400 hover:text-blue-300 font-sans font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <MapPin className="w-3 h-3" />
                          View on GIS Map
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  
                  {/* Overall Potential Row */}
                  <tr className="bg-blue-950/20 font-semibold">
                    <td className="p-4 sm:p-5 text-white font-bold">
                      Overall Location Potential
                    </td>
                    {comparisonList.map((loc, idx) => (
                      <td key={idx} className="p-4 sm:p-5 font-mono text-base font-extrabold text-blue-400 tabular-nums">
                        {loc.overallPotential}%
                      </td>
                    ))}
                  </tr>

                  {/* 1. Target Market Match */}
                  <tr>
                    <td className="p-4 sm:p-5 text-slate-300">
                      Target Market Match ({profile.targetMarket})
                    </td>
                    {comparisonList.map((loc, idx) => (
                      <td key={idx} className="p-4 sm:p-5 font-mono font-bold tabular-nums">
                        <span className={loc.metrics.targetMarketMatch.score >= 75 ? 'text-emerald-400' : 'text-slate-300'}>
                          {loc.metrics.targetMarketMatch.score}%
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* 2. Market Demand */}
                  <tr>
                    <td className="p-4 sm:p-5 text-slate-300">Market Demand (Footfall)</td>
                    {comparisonList.map((loc, idx) => (
                      <td key={idx} className="p-4 sm:p-5 font-mono font-bold tabular-nums">
                        <span className={loc.metrics.marketDemand.score >= 75 ? 'text-emerald-400' : 'text-slate-300'}>
                          {loc.metrics.marketDemand.score}%
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* 3. Competition Advantage */}
                  <tr>
                    <td className="p-4 sm:p-5 text-slate-300">
                      Competition Advantage
                    </td>
                    {comparisonList.map((loc, idx) => (
                      <td key={idx} className="p-4 sm:p-5 font-mono font-bold tabular-nums">
                        <span className={loc.metrics.competitionAdvantage.score >= 70 ? 'text-emerald-400' : 'text-amber-400'}>
                          {loc.metrics.competitionAdvantage.score}%
                        </span>
                        <span className="block text-[11px] text-slate-500 font-sans font-normal mt-0.5">
                          {loc.competitorsCount} competitors nearby
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* 4. Accessibility */}
                  <tr>
                    <td className="p-4 sm:p-5 text-slate-300">Accessibility & Road Infrastructure</td>
                    {comparisonList.map((loc, idx) => (
                      <td key={idx} className="p-4 sm:p-5 font-mono font-bold tabular-nums">
                        {loc.metrics.accessibility.score}%
                      </td>
                    ))}
                  </tr>

                  {/* 5. Cost Feasibility */}
                  <tr>
                    <td className="p-4 sm:p-5 text-slate-300">Cost Feasibility (Rent Overhead)</td>
                    {comparisonList.map((loc, idx) => (
                      <td key={idx} className="p-4 sm:p-5 font-mono font-bold tabular-nums">
                        {loc.metrics.costFeasibility.score}%
                      </td>
                    ))}
                  </tr>

                  {/* 6. Business Activity */}
                  <tr>
                    <td className="p-4 sm:p-5 text-slate-300">Commercial Business Activity</td>
                    {comparisonList.map((loc, idx) => (
                      <td key={idx} className="p-4 sm:p-5 font-mono font-bold tabular-nums">
                        {loc.metrics.businessActivity.score}%
                      </td>
                    ))}
                  </tr>

                  {/* 7. Event Opportunity */}
                  <tr>
                    <td className="p-4 sm:p-5 text-slate-300">Regional Event Opportunities</td>
                    {comparisonList.map((loc, idx) => (
                      <td key={idx} className="p-4 sm:p-5 font-mono font-bold tabular-nums">
                        {loc.metrics.eventOpportunity.score}%
                        <span className="block text-[11px] text-slate-500 font-sans font-normal mt-0.5">
                          {loc.nearbyEvents.length} listed event(s)
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Key Insight Summary */}
                  <tr className="bg-slate-950/40">
                    <td className="p-4 sm:p-5 text-white font-semibold">
                      Decision-Support Synthesis
                    </td>
                    {comparisonList.map((loc, idx) => (
                      <td key={idx} className="p-4 sm:p-5 text-xs text-slate-300 leading-relaxed font-sans">
                        {loc.aiInsight}
                      </td>
                    ))}
                  </tr>

                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
            <Scale className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Locations Saved for Comparison</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Open the interactive GIS map, drop a pin on any candidate location, and click the <strong>"+ Compare"</strong> button to add up to 3 candidate sites into this side-by-side matrix.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onAddPresetLocation('Tuguegarao Centro (Mabini / USLT)')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Load Tuguegarao Demo Sites
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
