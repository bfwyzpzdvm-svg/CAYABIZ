import React, { useState } from 'react';
import { Map, Layers, BarChart2, Calendar, Scale, Compass, Menu, X, Building2 } from 'lucide-react';

export type NavView = 'landing' | 'map' | 'analyze-form' | 'market' | 'events' | 'compare' | 'methodology';

interface NavbarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  onStartAnalysis: () => void;
  selectedLocationName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onStartAnalysis,
  selectedLocationName
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { view: NavView; label: string; icon: React.ReactNode }[] = [
    { view: 'landing', label: 'Home', icon: <Compass className="w-4 h-4" /> },
    { view: 'map', label: 'GIS Map', icon: <Map className="w-4 h-4" /> },
    { view: 'market', label: 'Market', icon: <BarChart2 className="w-4 h-4" /> },
    { view: 'events', label: 'Events', icon: <Calendar className="w-4 h-4" /> },
    { view: 'compare', label: 'Compare', icon: <Scale className="w-4 h-4" /> },
    { view: 'methodology', label: 'Data & Methodology', icon: <Layers className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-500 transition-colors">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
              CAYABIZ
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 Clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`text-sm font-medium transition-colors cursor-pointer py-1 relative ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 Primary actions */}
        <div className="hidden sm:flex items-center gap-3">
          {selectedLocationName && (
            <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-400 font-mono tabular-nums px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="truncate max-w-[160px]">{selectedLocationName}</span>
            </div>
          )}
          <button
            onClick={onStartAnalysis}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-600/30 transition-colors cursor-pointer whitespace-nowrap"
          >
            Analyze a Business
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-5 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => {
                onNavigate(item.view);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === item.view
                  ? 'bg-blue-600/20 text-blue-400 font-semibold'
                  : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={() => {
                onStartAnalysis();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-center text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
            >
              Analyze a Business
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
