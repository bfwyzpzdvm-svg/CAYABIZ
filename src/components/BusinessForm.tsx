import React, { useState } from 'react';
import { 
  Building2, 
  ArrowRight, 
  AlertCircle, 
  Store, 
  Wallet, 
  Users, 
  MapPin, 
  Briefcase,
  HelpCircle,
  Clock,
  TrendingDown
} from 'lucide-react';
import { BusinessProfile, BusinessCategory, TargetMarketType, BusinessSize, ProvinceId } from '../types';
import { PROVINCES_DATA } from '../data/cagayanValleyData';

interface BusinessFormProps {
  initialProfile: BusinessProfile;
  isExistingModeInitial?: boolean;
  onSubmit: (profile: BusinessProfile) => void;
  onCancel: () => void;
}

const CATEGORIES: BusinessCategory[] = [
  'Food & Beverage',
  'Café',
  'Restaurant',
  'Retail',
  'Grocery',
  'Clothing',
  'Salon/Beauty',
  'Printing',
  'Education',
  'Technology',
  'Services',
  'Tourism',
  'Agriculture',
  'Transportation',
  'Other'
];

const TARGET_MARKETS: TargetMarketType[] = [
  'Students',
  'Working Professionals',
  'Families / Households',
  'Tourists & Transients',
  'Farmers & Agri-producers',
  'Broad Consumer'
];

const BUSINESS_SIZES: BusinessSize[] = [
  'Micro (< ₱3M)',
  'Small (₱3M - ₱15M)',
  'Medium (₱15M - ₱100M)'
];

const CHALLENGES_OPTIONS = [
  'Low spontaneous foot traffic',
  'High commercial rent / occupancy costs',
  'Intense competitor discounting / price warfare',
  'Seasonal drop during university break periods',
  'Limited parking or difficult PUV accessibility',
  'High supplier transportation costs into Region II',
  'Lack of local market awareness'
];

export const BusinessForm: React.FC<BusinessFormProps> = ({
  initialProfile,
  isExistingModeInitial = false,
  onSubmit,
  onCancel
}) => {
  const [isExisting, setIsExisting] = useState(isExistingModeInitial || initialProfile.isExistingBusiness || false);
  const [profile, setProfile] = useState<BusinessProfile>({
    ...initialProfile,
    isExistingBusiness: isExistingModeInitial || initialProfile.isExistingBusiness || false
  });

  const [selectedChallenges, setSelectedChallenges] = useState<string[]>(
    profile.challenges || []
  );

  const toggleChallenge = (item: string) => {
    if (selectedChallenges.includes(item)) {
      setSelectedChallenges(selectedChallenges.filter((c) => c !== item));
    } else {
      setSelectedChallenges([...selectedChallenges, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...profile,
      isExistingBusiness: isExisting,
      challenges: selectedChallenges
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header with Mode Switcher */}
        <div className="p-6 sm:p-8 bg-slate-900/90 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold block mb-1">
                Decision-Support Input
              </span>
              <h2 className="text-2xl font-bold text-white">
                {isExisting ? 'Analyze My Existing / Struggling Business' : 'Analyze a New Business'}
              </h2>
            </div>

            {/* Mode Toggle Button */}
            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsExisting(false);
                  setProfile((prev) => ({ ...prev, isExistingBusiness: false }));
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  !isExisting ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                New Business
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsExisting(true);
                  setProfile((prev) => ({ ...prev, isExistingBusiness: true }));
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  isExisting ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Existing Business
              </button>
            </div>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed">
            {isExisting
              ? 'Evaluate structural location hurdles, customer foot traffic constraints, and cost burdens affecting your current operations in Cagayan Valley.'
              : 'Enter your business model, target market, and capital parameters to configure spatial intelligence on the GIS map.'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {/* Row 1: Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Business Name
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="e.g. Brew & Study Lounge"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Business Category
              </label>
              <select
                value={profile.category}
                onChange={(e) => setProfile({ ...profile, category: e.target.value as BusinessCategory })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Specific Product and Target Market */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Product or Service
              </label>
              <input
                type="text"
                required
                value={profile.productOrService}
                onChange={(e) => setProfile({ ...profile, productOrService: e.target.value })}
                placeholder="e.g. Specialty coffee, pastries, student study stations"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Target Customers
              </label>
              <select
                value={profile.targetMarket}
                onChange={(e) => setProfile({ ...profile, targetMarket: e.target.value as TargetMarketType })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
              >
                {TARGET_MARKETS.map((mkt) => (
                  <option key={mkt} value={mkt} className="bg-slate-900 text-white">
                    {mkt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Financial Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Estimated Starting Capital</span>
                <span className="text-slate-500 lowercase font-mono">PHP</span>
              </label>
              <input
                type="text"
                value={profile.startingBudget}
                onChange={(e) => setProfile({ ...profile, startingBudget: e.target.value })}
                placeholder="e.g. ₱150,000"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white font-mono tabular-nums focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Monthly Operating Budget</span>
                <span className="text-slate-500 lowercase font-mono">Rent, Utilities, Payroll</span>
              </label>
              <input
                type="text"
                value={profile.monthlyOperatingBudget}
                onChange={(e) => setProfile({ ...profile, monthlyOperatingBudget: e.target.value })}
                placeholder="e.g. ₱35,000"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white font-mono tabular-nums focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Row 4: Scale & Organization */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Business Scale
              </label>
              <select
                value={profile.businessSize}
                onChange={(e) => setProfile({ ...profile, businessSize: e.target.value as BusinessSize })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {BUSINESS_SIZES.map((size) => (
                  <option key={size} value={size} className="bg-slate-900 text-white">
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Team Size
              </label>
              <select
                value={profile.employeeCount}
                onChange={(e) => setProfile({ ...profile, employeeCount: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="1-2 people">1 - 2 Staff (Owner-Operated)</option>
                <option value="3-5 people">3 - 5 Staff</option>
                <option value="6-9 people">6 - 9 Staff</option>
                <option value="10+ people">10+ Staff</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Primary Target Area
              </label>
              <select
                value={profile.preferredLocation}
                onChange={(e) => setProfile({ ...profile, preferredLocation: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Tuguegarao City, Cagayan">Tuguegarao City, Cagayan</option>
                <option value="Solana, Cagayan">Solana, Cagayan</option>
                <option value="Aparri, Cagayan">Aparri, Cagayan</option>
                <option value="Cauayan City, Isabela">Cauayan City, Isabela</option>
                <option value="Santiago City, Isabela">Santiago City, Isabela</option>
                <option value="City of Ilagan, Isabela">City of Ilagan, Isabela</option>
                <option value="Bayombong, Nueva Vizcaya">Bayombong, Nueva Vizcaya</option>
                <option value="Solano, Nueva Vizcaya">Solano, Nueva Vizcaya</option>
                <option value="Cabarroguis, Quirino">Cabarroguis, Quirino</option>
                <option value="Basco, Batanes">Basco, Batanes</option>
              </select>
            </div>
          </div>

          {/* Section: Diagnostic Fields for Existing / Struggling Business Mode */}
          {isExisting && (
            <div className="pt-6 border-t border-slate-800 space-y-5 bg-amber-950/10 p-5 rounded-xl border border-amber-500/20">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-semibold uppercase">
                <AlertCircle className="w-4 h-4" />
                <span>Existing Business Diagnostic Metrics</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Operating Tenure
                  </label>
                  <select
                    value={profile.operatingPeriod || '6-12 months'}
                    onChange={(e) => setProfile({ ...profile, operatingPeriod: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="Under 6 months">Under 6 months</option>
                    <option value="6-12 months">6 - 12 months</option>
                    <option value="1-2 years">1 - 2 years</option>
                    <option value="3+ years">3+ years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Current Monthly Revenue
                  </label>
                  <input
                    type="text"
                    value={profile.monthlyRevenue || '₱30,000 - ₱45,000'}
                    onChange={(e) => setProfile({ ...profile, monthlyRevenue: e.target.value })}
                    placeholder="e.g. ₱35,000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Current Monthly Expenses
                  </label>
                  <input
                    type="text"
                    value={profile.monthlyExpenses || '₱40,000'}
                    onChange={(e) => setProfile({ ...profile, monthlyExpenses: e.target.value })}
                    placeholder="e.g. ₱40,000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Observed Pain Points & Operating Challenges
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {CHALLENGES_OPTIONS.map((ch) => {
                    const isChecked = selectedChallenges.includes(ch);
                    return (
                      <button
                        type="button"
                        key={ch}
                        onClick={() => toggleChallenge(ch)}
                        className={`text-left px-3 py-2 rounded-lg border transition-colors cursor-pointer flex items-center gap-2 ${
                          isChecked
                            ? 'bg-amber-600/20 border-amber-500/50 text-amber-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[10px] ${
                          isChecked ? 'bg-amber-600 border-amber-500 text-white' : 'border-slate-700'
                        }`}>
                          {isChecked ? '✓' : ''}
                        </span>
                        <span className="truncate">{ch}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`w-full sm:w-auto px-6 py-3 font-semibold text-sm rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isExisting
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
              }`}
            >
              {isExisting ? 'ANALYZE STRUGGLING BUSINESS' : 'ANALYZE BUSINESS'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
