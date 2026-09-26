import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Sparkles, 
  HelpCircle, 
  Calendar, 
  ShieldAlert, 
  Plus, 
  Compass, 
  BarChart, 
  Store,
  Layers,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  LocationAnalysisResult, 
  BusinessProfile, 
  MetricFactor, 
  DataStatus 
} from '../types';
import { getQuickAnalyticalInsights } from '../services/aiService';

interface LocationAnalysisPanelProps {
  analysis: LocationAnalysisResult | null;
  profile: BusinessProfile;
  onSaveToComparison: (analysis: LocationAnalysisResult) => void;
  isSavedInComparison: boolean;
  onJumpToEvent?: (eventId: string) => void;
  onOpenMethodology: () => void;
}

export const LocationAnalysisPanel: React.FC<LocationAnalysisPanelProps> = ({
  analysis,
  profile,
  onSaveToComparison,
  isSavedInComparison,
  onJumpToEvent,
  onOpenMethodology
}) => {
  const [activeWhyModal, setActiveWhyModal] = useState<MetricFactor | null>(null);
  const [quickAiTopic, setQuickAiTopic] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'metrics' | 'risks' | 'nearby' | 'events'>('metrics');
  const [isMobileCollapsed, setIsMobileCollapsed] = useState(false);

  if (!analysis) {
    return (
      <div className="h-full bg-slate-900 border-l border-slate-800 p-6 flex flex-col items-center justify-center text-center text-slate-400">
        <MapPin className="w-10 h-10 text-slate-600 mb-3 animate-pulse" />
        <h3 className="text-white font-semibold mb-1">Select a Business Location</h3>
        <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
          Click anywhere on the GIS map or drag the blue pin to generate location intelligence and market analysis.
        </p>
      </div>
    );
  }

  const { overallPotential, metrics, risks, nearbyPois, nearbyEvents, competitorsCount, schoolsCount, aiInsight, addressLabel, radiusKm } = analysis;

  const currentAiText = quickAiTopic 
    ? getQuickAnalyticalInsights(analysis, profile, quickAiTopic)
    : aiInsight;

  return (
    <div className="h-full bg-slate-900 border-l border-slate-800 flex flex-col overflow-hidden text-slate-200">
      
      {/* Top Header Card */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 shrink-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 font-semibold block truncate">
              {profile.name} · {profile.category}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white truncate" title={addressLabel}>
              {addressLabel}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
              <span>Target: {profile.targetMarket}</span>
              <span>·</span>
              <span>Radius: {radiusKm}km</span>
            </div>
          </div>

          <button
            onClick={() => onSaveToComparison(analysis)}
            disabled={isSavedInComparison}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors flex items-center gap-1 cursor-pointer ${
              isSavedInComparison
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-600/30'
            }`}
          >
            {isSavedInComparison ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Compare</span>
              </>
            )}
          </button>
        </div>

        {/* Primary Overall Score Badge */}
        <div className="mt-3 bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase font-mono text-slate-400 tracking-wider">
              {profile.isExistingBusiness ? 'Current Location Potential' : 'Overall Location Potential'}
            </div>
            <div className="text-xs text-slate-500">
              Composite weighted index of 7 empirical factors
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-extrabold text-blue-400 font-mono tabular-nums">
              {overallPotential}%
            </span>
          </div>
        </div>

        {/* Segmented Sub-Tabs */}
        <div className="mt-3 flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`flex-1 py-1 text-center font-medium rounded transition-colors cursor-pointer ${
              activeTab === 'metrics' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Metrics
          </button>
          <button
            onClick={() => setActiveTab('risks')}
            className={`flex-1 py-1 text-center font-medium rounded transition-colors cursor-pointer ${
              activeTab === 'risks' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Risks
          </button>
          <button
            onClick={() => setActiveTab('nearby')}
            className={`flex-1 py-1 text-center font-medium rounded transition-colors cursor-pointer ${
              activeTab === 'nearby' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            POIs ({nearbyPois.length})
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 py-1 text-center font-medium rounded transition-colors cursor-pointer ${
              activeTab === 'events' ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Events ({nearbyEvents.length})
          </button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
        
        {/* TAB 1: 7-FACTOR METRICS */}
        {activeTab === 'metrics' && (
          <div className="space-y-4">
            
            {/* AI Location Insight Card */}
            <div className="bg-slate-950 border border-blue-500/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>AI Location Insight</span>
                </div>
                {quickAiTopic && (
                  <button
                    onClick={() => setQuickAiTopic(null)}
                    className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Reset to Synthesis
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {currentAiText}
              </p>

              {/* Analytical Interactive Queries */}
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1.5">
                  Deep-Dive Analytical Topics:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setQuickAiTopic('seasonality')}
                    className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
                      quickAiTopic === 'seasonality'
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    School Seasonality
                  </button>
                  <button
                    onClick={() => setQuickAiTopic('competition_agglomeration')}
                    className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
                      quickAiTopic === 'competition_agglomeration'
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    Agglomeration Effect
                  </button>
                  <button
                    onClick={() => setQuickAiTopic('lease_guidance')}
                    className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
                      quickAiTopic === 'lease_guidance'
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    Rent Bounds
                  </button>
                  <button
                    onClick={() => setQuickAiTopic('event_strategy')}
                    className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
                      quickAiTopic === 'event_strategy'
                        ? 'bg-amber-600 border-amber-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    Event Booth Strategy
                  </button>
                </div>
              </div>
            </div>

            {/* List of 7 Factors */}
            <div className="space-y-3">
              {Object.values(metrics).map((metric) => (
                <div
                  key={metric.name}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 transition-all hover:border-slate-700"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{metric.name}</span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-medium ${
                        metric.dataStatus === 'VERIFIED DATA'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : metric.dataStatus === 'ESTIMATED DATA'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {metric.dataStatus}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white font-mono tabular-nums">
                        {metric.score}%
                      </span>
                      <button
                        onClick={() => setActiveWhyModal(metric)}
                        className="px-2 py-0.5 text-[11px] font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 rounded border border-blue-500/20 transition-colors cursor-pointer"
                        title="View mathematical methodology and underlying empirical factors"
                      >
                        Why?
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        metric.score >= 75
                          ? 'bg-emerald-500'
                          : metric.score >= 55
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${metric.score}%` }}
                    />
                  </div>

                  {/* Inline concise explanation */}
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                    {metric.why}
                  </p>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 2: RISK ANALYSIS (Section 20) */}
        {activeTab === 'risks' && (
          <div className="space-y-4">
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold mb-1">
                <ShieldAlert className="w-4 h-4" />
                <span>Transparent Risk Indicators</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Risk percentages reflect structural trade challenges observed in Region II. These indicators do not predict guaranteed failure, but highlight vulnerabilities that require active mitigation.
              </p>
            </div>

            <div className="space-y-3">
              
              {/* Competition Risk */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-semibold text-white">Competition Risk</span>
                  <span className="font-mono font-bold text-amber-400 tabular-nums">
                    {risks.competitionRisk}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${risks.competitionRisk}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {metrics.competitionAdvantage.whyRisk}
                </p>
              </div>

              {/* Cost Risk */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-semibold text-white">Cost & Rent Risk</span>
                  <span className="font-mono font-bold text-amber-400 tabular-nums">
                    {risks.costRisk}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${risks.costRisk}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {metrics.costFeasibility.whyRisk}
                </p>
              </div>

              {/* Demand Risk */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-semibold text-white">Market Demand Risk</span>
                  <span className="font-mono font-bold text-amber-400 tabular-nums">
                    {risks.demandRisk}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${risks.demandRisk}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {metrics.marketDemand.whyRisk}
                </p>
              </div>

              {/* Accessibility Risk */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-semibold text-white">Accessibility & Transit Risk</span>
                  <span className="font-mono font-bold text-amber-400 tabular-nums">
                    {risks.accessibilityRisk}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${risks.accessibilityRisk}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {metrics.accessibility.whyRisk}
                </p>
              </div>

              {/* Market Mismatch Risk */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-semibold text-white">Target Demographic Mismatch Risk</span>
                  <span className="font-mono font-bold text-amber-400 tabular-nums">
                    {risks.marketMismatchRisk}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${risks.marketMismatchRisk}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {metrics.targetMarketMatch.whyRisk}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: NEARBY POIs */}
        {activeTab === 'nearby' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800 font-mono">
              <span>{nearbyPois.length} Establishments within {radiusKm}km</span>
              <span>Sorted by Proximity</span>
            </div>

            {nearbyPois.map((poi) => (
              <div
                key={poi.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1.5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-blue-400 uppercase font-semibold">
                    {poi.subCategory || poi.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300 tabular-nums">
                    {poi.distanceKm} km
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white leading-snug">
                  {poi.name}
                </h4>

                <p className="text-[11px] text-slate-400 truncate">
                  {poi.address}
                </p>

                {poi.populationOrFootTraffic && (
                  <div className="text-[10px] text-slate-500 font-mono">
                    Estimated Catchment: ~{poi.populationOrFootTraffic.toLocaleString()} persons
                  </div>
                )}

                <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-emerald-400 font-semibold">{poi.dataStatus}</span>
                  <span className="text-slate-500 truncate max-w-[140px]">{poi.source}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: NEARBY EVENTS */}
        {activeTab === 'events' && (
          <div className="space-y-3">
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200">
              <span className="font-semibold block mb-0.5">Event Opportunity Engine</span>
              Events that generate sudden influxes of students, families, or commercial buyers.
            </div>

            {nearbyEvents.length > 0 ? (
              nearbyEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 hover:border-amber-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">
                      ★ {evt.type}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-300 tabular-nums">
                      {evt.distanceKm} km
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white">
                    {evt.name}
                  </h4>

                  <div className="text-[11px] text-slate-400 space-y-0.5 font-mono">
                    <div>📅 {evt.dateStart} to {evt.dateEnd}</div>
                    <div>📍 {evt.venue}</div>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                    <span className={`px-2 py-0.5 rounded font-semibold ${
                      evt.vendorOpportunity === 'Available'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      Vendor: {evt.vendorOpportunity}
                    </span>
                    <span className="text-slate-400">Audience: {evt.expectedAudience}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-500">
                No major verified festivals or school intramurals listed within this radius.
              </div>
            )}
          </div>
        )}

      </div>

      {/* Footer Audit & Methodology Link */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 shrink-0 flex items-center justify-between text-[11px] text-slate-400">
        <span>Decision-Support Intelligence</span>
        <button
          onClick={onOpenMethodology}
          className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer underline flex items-center gap-1"
        >
          View Methodology & Sources
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* WHY MODAL DIALOG (Section 8: Transparent Scoring Audit) */}
      {activeWhyModal && (
        <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono uppercase text-blue-400 font-semibold block">
                  Scoring Transparency & Methodology
                </span>
                <h3 className="text-lg font-bold text-white">
                  {activeWhyModal.name} — {activeWhyModal.score}%
                </h3>
              </div>
              <span className={`text-[10px] font-mono px-2 py-1 rounded font-semibold ${
                activeWhyModal.dataStatus === 'VERIFIED DATA'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
              }`}>
                {activeWhyModal.dataStatus}
              </span>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Detailed Evaluation Rationale
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                {activeWhyModal.why}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Underlying Empirical Factors
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                {activeWhyModal.factors.map((factor, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">·</span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveWhyModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Close Explanation
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
