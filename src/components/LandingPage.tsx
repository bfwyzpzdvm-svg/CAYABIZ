import React from 'react';
import { 
  MapPin, 
  Compass, 
  BarChart3, 
  Calendar, 
  ShieldCheck, 
  ArrowRight, 
  Building, 
  TrendingUp, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  Layers,
  Map as MapIcon
} from 'lucide-react';
import { PROVINCES_DATA, DEMOGRAPHIC_INSIGHTS } from '../data/cagayanValleyData';
import { ProvinceId } from '../types';

interface LandingPageProps {
  onAnalyzeNew: () => void;
  onAnalyzeExisting: () => void;
  onExploreMap: (provinceId?: ProvinceId) => void;
  onViewEvents: () => void;
  onViewMethodology: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onAnalyzeNew,
  onAnalyzeExisting,
  onExploreMap,
  onViewEvents,
  onViewMethodology,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800/80">
        <div className="absolute inset-0 z-0 opacity-25">
          <img 
            src="/src/assets/images/cagayan_valley_hero_1790331946243.jpg" 
            alt="Cagayan Valley Landscape and Commercial Center" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            
            {/* Editorial brand kicker without pill box */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-400 uppercase mb-4 font-mono">
              <span>CAYABIZ</span>
              <span aria-hidden="true">·</span>
              <span>Business Location & Market Intelligence</span>
              <span aria-hidden="true">·</span>
              <span>Region II (Cagayan Valley)</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6" style={{ textWrap: 'balance' }}>
              Know the Market. Find the Place. Understand the Opportunity.
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-8 max-w-2xl">
              CAYABIZ helps entrepreneurs and small businesses analyze locations, markets, competition, accessibility, costs, events, and surrounding business activity using geographic and market data.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={onAnalyzeNew}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                Analyze a Business
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onExploreMap('cagayan')}
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold rounded-lg transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                <MapIcon className="w-4 h-4 text-blue-400" />
                Explore Cagayan Valley Map
              </button>

              <button
                onClick={onAnalyzeExisting}
                className="px-4 py-3.5 text-xs sm:text-sm font-medium text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer ml-auto sm:ml-0"
              >
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Analyze My Existing / Struggling Business
              </button>
            </div>

            {/* Factual Coverage Bar */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-400">
              <div>
                <span className="block font-bold text-white text-base font-mono tabular-nums">5 Provinces</span>
                Cagayan, Isabela, N. Vizcaya, Quirino, Batanes
              </div>
              <div>
                <span className="block font-bold text-white text-base font-mono tabular-nums">Tuguegarao City</span>
                Primary High-Density Demonstration Hub
              </div>
              <div>
                <span className="block font-bold text-white text-base font-mono tabular-nums">3.68M+ Pop</span>
                PSA 2020/2024 Verified Demographic Base
              </div>
              <div>
                <span className="block font-bold text-white text-base font-mono tabular-nums">100% Transparent</span>
                Every Metric Backed by Source & Formula
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Decision-Support Philosophy Section */}
      <section className="py-12 bg-slate-900/60 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold mb-2 block">
                Foundational Decision-Support Principle
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                We Don't Promise Guarantees. We Provide Analytical Clarity.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                CAYABIZ does not claim that a business will "definitely succeed" in any spot. Instead, it systematically models geographic foot traffic, competitor clustering, student catchments, commercial rent bounds, and seasonal event surges so entrepreneurs can make informed, data-grounded choices.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={onViewMethodology}
                className="px-4 py-2.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Review Scoring Methodology
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Five Provinces Geographic Coverage Showcase */}
      <section className="py-16 lg:py-24 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold mb-2 block">
                Geographic Coverage: Region II
              </span>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                All 5 Provinces of Cagayan Valley
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-md mt-2 md:mt-0">
              Zoom from regional economic patterns down to provincial capitals, municipalities, barangays, and exact parcel-level pins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.values(PROVINCES_DATA).map((prov) => {
              const isPrimary = prov.id === 'cagayan';
              return (
                <div
                  key={prov.id}
                  className={`bg-slate-900/70 border rounded-xl p-5 flex flex-col justify-between transition-all hover:border-blue-500/50 ${
                    isPrimary ? 'border-blue-500/40 bg-blue-950/20' : 'border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                      <span>{prov.capital}</span>
                      {isPrimary && (
                        <span className="text-blue-400 font-semibold">Primary Hub</span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1.5">{prov.name}</h3>
                    <p className="text-xs text-slate-400 mb-4 line-clamp-3 leading-relaxed">
                      {prov.description}
                    </p>
                    <div className="space-y-1 mb-4 text-xs font-mono tabular-nums text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Population:</span>
                        <span>{prov.population.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Municipalities:</span>
                        <span>{prov.municipalitiesCount} {prov.citiesCount > 0 ? `+ ${prov.citiesCount} City` : ''}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onExploreMap(prov.id)}
                    className="w-full mt-2 py-2 text-xs font-medium text-center bg-slate-800/90 hover:bg-blue-600 hover:text-white text-slate-200 border border-slate-700/60 rounded-md transition-colors cursor-pointer"
                  >
                    Open in GIS Map →
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Core Capabilities Grid (Anti-slop, clean layout) */}
      <section className="py-16 lg:py-24 bg-slate-900/30 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold mb-2 block">
              Core Intelligence Modules
            </span>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              A Complete Business Analytics & GIS Platform
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Every tool is engineered to evaluate empirical trade realities across Cagayan Valley without relying on generic mock templates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center mb-5">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Foodpanda-Style Location Pinning</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  Click anywhere on the map or drag your pin to evaluate exact parcel coordinates. Adjust analysis radius from 500m walking radius up to 5km driving corridors with live polygon calculation.
                </p>
              </div>
              <div className="text-xs text-slate-500 font-mono pt-4 border-t border-slate-800">
                Live Geocoding · Haversine Spatial Distance · Polygon Buffer
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-5">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">7-Factor Location Potential Index</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  Transparent scoring across Target Market Match, Market Demand, Competition Advantage, Accessibility, Cost Feasibility, Business Activity, and Event Opportunity, complete with a detailed "Why?" audit trail.
                </p>
              </div>
              <div className="text-xs text-slate-500 font-mono pt-4 border-t border-slate-800">
                Weighted Scoring Matrix · Data Status Badges · No Hallucinated Metrics
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center mb-5">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Regional Event Opportunities</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  Tailored for food stalls, beverage sellers, and student entrepreneurs. Tracks verified school intramurals, Afi Festival, Bambanti Festival, and DTI regional trade fairs with vendor booth status.
                </p>
              </div>
              <div className="text-xs text-slate-500 font-mono pt-4 border-t border-slate-800">
                Festival Calendars · Vendor Accreditation Status · Footfall Surges
              </div>
            </div>

          </div>

          {/* Secondary Bento Grid with Real Photos & Workflows */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Visual Preview 1 */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between">
              <div className="p-6">
                <span className="text-xs font-mono uppercase text-blue-400 font-semibold mb-1 block">
                  GIS Intelligence Dashboard Preview
                </span>
                <h3 className="text-xl font-bold text-white mb-2">
                  Multi-Layer Geospatial Mapping
                </h3>
                <p className="text-sm text-slate-400 mb-4">
                  Toggle competition layers, educational catchment heatmaps, transit terminals, and commercial centers across Tuguegarao City and neighboring districts.
                </p>
              </div>
              <div className="px-6 pb-6">
                <div className="relative rounded-lg overflow-hidden border border-slate-800">
                  <img
                    src="/src/assets/images/gis_intelligence_preview_1790331959448.jpg"
                    alt="GIS Intelligence Preview"
                    className="w-full h-56 sm:h-72 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-sm border border-slate-700/60 rounded px-2.5 py-1 text-xs font-mono text-slate-300">
                    Tuguegarao City Centro · 1.0 km Active Radius
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Preview 2: Tuguegarao Commercial Hub */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between">
              <div className="p-6">
                <span className="text-xs font-mono uppercase text-emerald-400 font-semibold mb-1 block">
                  Local Ground Realities
                </span>
                <h3 className="text-xl font-bold text-white mb-2">
                  Tuguegarao University & Commercial Strips
                </h3>
                <p className="text-sm text-slate-400 mb-4">
                  Over 35,000 enrolled university students between USLT, CSU Andrews, and SPUP converge along Mabini and College Avenue corridors.
                </p>
              </div>
              <div className="px-6 pb-6">
                <div className="relative rounded-lg overflow-hidden border border-slate-800">
                  <img
                    src="/src/assets/images/tuguegarao_commercial_1790331970746.jpg"
                    alt="Tuguegarao Commercial District"
                    className="w-full h-56 sm:h-72 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-sm border border-slate-700/60 rounded px-2.5 py-1 text-xs font-mono text-slate-300">
                    Mabini - Balzain Corridor · High Pedestrian Density
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Existing Business Diagnostic Callout */}
      <section className="py-16 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 to-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-8 sm:p-10 relative overflow-hidden">
            <div className="max-w-2xl relative z-10">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase font-semibold mb-2">
                <AlertCircle className="w-4 h-4" />
                <span>Specialized Diagnostic Module</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Already Running a Business in Cagayan Valley That Is Struggling?
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Enter your current location, operating expenses, and footfall challenges. CAYABIZ analyzes potential risk indicators—such as target-market mismatch, rent overhead strain, or competitor oversaturation—and allows you to benchmark your current site against alternative locations in Region II.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={onAnalyzeExisting}
                  className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm rounded-lg shadow-md shadow-amber-600/20 transition-all cursor-pointer"
                >
                  Analyze My Existing Business
                </button>
                <button
                  onClick={() => onExploreMap('cagayan')}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Test Alternative Sites on GIS Map
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Transparency Banner & Footer */}
      <footer className="py-12 bg-slate-950 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 pb-8 border-b border-slate-800">
            <div>
              <div className="text-sm font-bold text-white mb-2">CAYABIZ</div>
              <p className="text-slate-400 leading-relaxed">
                Empowering small businesses, entrepreneurs, and local enterprises with transparent geospatial and market intelligence across Region II.
              </p>
            </div>
            <div>
              <div className="text-sm font-semibold text-white mb-2">Data Sources</div>
              <ul className="space-y-1 text-slate-400">
                <li>Philippine Statistics Authority (PSA)</li>
                <li>DTI Region II MSME Registry</li>
                <li>CHED & DepEd Region II</li>
                <li>LGU Tuguegarao & Regional Tourism</li>
                <li>OpenStreetMap Contributors</li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-semibold text-white mb-2">Verification Levels</div>
              <ul className="space-y-1 font-mono text-[11px]">
                <li className="text-emerald-400">VERIFIED DATA: Official Public Records</li>
                <li className="text-blue-400">ESTIMATED DATA: Modeled Heuristics</li>
                <li className="text-amber-400">SAMPLE DATA: Demonstration Only</li>
                <li className="text-slate-500">DATA UNAVAILABLE: Disclosed Gap</li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-semibold text-white mb-2">Quick Navigation</div>
              <div className="space-y-2">
                <button onClick={onAnalyzeNew} className="block hover:text-white transition-colors cursor-pointer">
                  Analyze New Business
                </button>
                <button onClick={() => onExploreMap('cagayan')} className="block hover:text-white transition-colors cursor-pointer">
                  Tuguegarao GIS Map
                </button>
                <button onClick={onViewEvents} className="block hover:text-white transition-colors cursor-pointer">
                  Regional Events Directory
                </button>
                <button onClick={onViewMethodology} className="block hover:text-white transition-colors cursor-pointer">
                  Full Methodology & Formulas
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 font-mono">
            <div>
              © 2026 CAYABIZ. Built for Cagayan Valley Entrepreneurs.
            </div>
            <div>
              Decision-support system for Region II · No automated commercial warranty
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
