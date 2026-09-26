import React from 'react';
import { 
  ShieldCheck, 
  X, 
  Layers, 
  FileText, 
  Database, 
  CheckCircle2, 
  AlertCircle,
  BarChart2
} from 'lucide-react';

interface AboutMethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutMethodologyModal: React.FC<AboutMethodologyModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1100] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>CAYABIZ Framework</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Data Transparency & Scoring Methodology
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Core Principle */}
        <div className="bg-blue-950/20 border border-blue-500/30 rounded-xl p-4 text-xs text-blue-200 leading-relaxed">
          <strong className="text-white block mb-1">Core Operational Principle:</strong>
          CAYABIZ is designed as an analytical decision-support system, not a crystal ball. It does NOT claim that a business will "definitely succeed" in any spot. Every percentage metric is derived from clear spatial equations applied to public geographic and demographic data for Cagayan Valley (Region II).
        </div>

        {/* Section 2: Data Status Classification Badges */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            1. Data Verification Tier Classification
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            
            <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/30 space-y-1">
              <span className="font-mono text-emerald-400 font-bold block">
                VERIFIED DATA
              </span>
              <p className="text-slate-400 leading-relaxed">
                Directly corroborated by an authoritative public agency, regulatory registry, university directory, or official festival program (e.g. PSA census, CHED, DOH, LGU permits).
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-blue-500/30 space-y-1">
              <span className="font-mono text-blue-400 font-bold block">
                ESTIMATED DATA
              </span>
              <p className="text-slate-400 leading-relaxed">
                Calculated algorithmically from verified empirical anchors (e.g., Haversine spherical distance models, pedestrian reach buffers, or lease rate ranges per square meter).
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-amber-500/30 space-y-1">
              <span className="font-mono text-amber-400 font-bold block">
                SAMPLE DATA
              </span>
              <p className="text-slate-400 leading-relaxed">
                Utilized exclusively for prototype testing in regions where micro-level public cadastral records are awaiting digitization. Clearly flagged on cards.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-700 space-y-1">
              <span className="font-mono text-slate-400 font-bold block">
                DATA UNAVAILABLE
              </span>
              <p className="text-slate-400 leading-relaxed">
                Discloses that verified empirical indicators could not be confirmed for this coordinate. CAYABIZ never fabricates substitute values.
              </p>
            </div>

          </div>
        </div>

        {/* Section 3: 7-Factor Weighted Scoring Methodology */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            2. Overall Location Potential Formula
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The composite <strong>Location Potential Index (0–100%)</strong> is a mathematically transparent weighted average of seven sub-indicators:
          </p>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2 text-slate-300">
            <div className="flex justify-between border-b border-slate-800/80 pb-1.5 font-bold text-white">
              <span>Factor</span>
              <span>Weight</span>
            </div>
            <div className="flex justify-between">
              <span>Target Market Match (Demographic alignment)</span>
              <span className="text-blue-400 font-bold">25%</span>
            </div>
            <div className="flex justify-between">
              <span>Market Demand (Aggregate footfall & enrollment)</span>
              <span className="text-blue-400 font-bold">20%</span>
            </div>
            <div className="flex justify-between">
              <span>Competition Advantage (Saturation vs Agglomeration)</span>
              <span className="text-blue-400 font-bold">15%</span>
            </div>
            <div className="flex justify-between">
              <span>Accessibility (Highways, terminals, PUV routes)</span>
              <span className="text-blue-400 font-bold">15%</span>
            </div>
            <div className="flex justify-between">
              <span>Cost Feasibility (Rent overhead vs starting capital)</span>
              <span className="text-blue-400 font-bold">10%</span>
            </div>
            <div className="flex justify-between">
              <span>Business Activity (Commercial density & vitality)</span>
              <span className="text-blue-400 font-bold">10%</span>
            </div>
            <div className="flex justify-between">
              <span>Event Opportunity (Festivals, fairs & intramurals)</span>
              <span className="text-blue-400 font-bold">5%</span>
            </div>
          </div>
        </div>

        {/* Section 4: Public Datasets Utilized */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            3. Authoritative Public Data Sources
          </h3>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Philippine Statistics Authority (PSA):</strong> 2020 Census of Population & Housing and Regional Economic Accounts for Region II.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Commission on Higher Education (CHED) Region II:</strong> University student enrollment and campus directories (USLT, CSU, SPUP, ISU, SMU, NVSU, QSU, BSC).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Department of Trade and Industry (DTI Region II):</strong> MSME enterprise registry and regional trade fair schedules (Padday na Lima).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Local Government Units (LGUs):</strong> City of Tuguegarao Tourism, City of Ilagan, Cauayan City, and Provincial Tourism Calendars.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>OpenStreetMap Contributors:</strong> Geographic coordinates, road centerlines, and building footprint nodes under the Open Database License.</span>
            </li>
          </ul>
        </div>

        {/* Footer Close Button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            I Understand the Methodology
          </button>
        </div>

      </div>
    </div>
  );
};
