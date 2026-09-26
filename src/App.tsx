/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, NavView } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { GisMap } from './components/GisMap';
import { LocationAnalysisPanel } from './components/LocationAnalysisPanel';
import { BusinessForm } from './components/BusinessForm';
import { LocationComparisonView } from './components/LocationComparisonView';
import { MarketAnalysisView } from './components/MarketAnalysisView';
import { EventOpportunitiesView } from './components/EventOpportunitiesView';
import { AboutMethodologyModal } from './components/AboutMethodologyModal';

import { 
  BusinessProfile, 
  LocationAnalysisResult, 
  MapLayerState, 
  ProvinceId 
} from './types';
import { analyzeLocation } from './services/scoringEngine';
import { PROVINCES_DATA } from './data/cagayanValleyData';

// Initial Demo Profile focused on Tuguegarao City
const INITIAL_PROFILE: BusinessProfile = {
  name: 'North Peak Artisan Cafe & Study Hub',
  category: 'Café',
  productOrService: 'Specialty coffee, pastries, study stations with Wi-Fi',
  targetMarket: 'Students',
  startingBudget: '₱250,000',
  monthlyOperatingBudget: '₱45,000',
  preferredLocation: 'Tuguegarao City, Cagayan',
  businessSize: 'Micro (< ₱3M)',
  employeeCount: '3-5 people',
  isExistingBusiness: false,
};

const DEFAULT_LAYERS: MapLayerState = {
  businesses: true,
  competition: true,
  schools: true,
  commercial: true,
  transport: true,
  events: true,
  targetMarketHeat: true,
  opportunityIndicator: true,
};

export default function App() {
  const [currentView, setCurrentView] = useState<NavView>('landing');
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(INITIAL_PROFILE);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number }>({
    lat: 17.61925, // St. Paul University Philippines / Mabini St, Tuguegarao City
    lng: 121.72202,
  });
  const [selectedLocationLabel, setSelectedLocationLabel] = useState<string>('Near St. Paul University Philippines (SPUP), Tuguegarao');
  const [radiusKm, setRadiusKm] = useState<number>(1.0);
  const [layers, setLayers] = useState<MapLayerState>(DEFAULT_LAYERS);
  
  // Real-time Spatial Analysis
  const [analysisResult, setAnalysisResult] = useState<LocationAnalysisResult | null>(null);
  
  // Comparison List (Up to 3 locations)
  const [comparisonList, setComparisonList] = useState<LocationAnalysisResult[]>([]);
  
  // Methodology Modal state
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isExistingModeInitial, setIsExistingModeInitial] = useState(false);

  // Recalculate analysis when location, radius, or profile changes
  useEffect(() => {
    const result = analyzeLocation(
      selectedLocation.lat,
      selectedLocation.lng,
      radiusKm,
      businessProfile,
      selectedLocationLabel
    );
    setAnalysisResult(result);
  }, [selectedLocation, radiusKm, businessProfile, selectedLocationLabel]);

  // Handlers
  const handleLocationChange = (lat: number, lng: number, addressLabel?: string) => {
    setSelectedLocation({ lat, lng });
    if (addressLabel) {
      setSelectedLocationLabel(addressLabel);
    }
  };

  const handleToggleLayer = (layerName: keyof MapLayerState) => {
    setLayers((prev) => ({ ...prev, [layerName]: !prev[layerName] }));
  };

  const handleSaveToComparison = (analysis: LocationAnalysisResult) => {
    if (comparisonList.length >= 3) {
      alert('You can compare a maximum of 3 locations simultaneously. Remove one to add a new site.');
      return;
    }
    const alreadySaved = comparisonList.some(
      (c) => Math.abs(c.lat - analysis.lat) < 0.0001 && Math.abs(c.lng - analysis.lng) < 0.0001
    );
    if (!alreadySaved) {
      setComparisonList([...comparisonList, analysis]);
    }
  };

  const handleRemoveComparison = (index: number) => {
    setComparisonList(comparisonList.filter((_, i) => i !== index));
  };

  const handleAddPresetComparison = (presetName: string) => {
    let target = { lat: 17.61925, lng: 121.72202, label: 'SPUP & Mabini Corridor (Ugac Norte)' };
    if (presetName.includes('USLT')) {
      target = { lat: 17.61014, lng: 121.72366, label: 'USLT Student Corridor (Ugac Sur)' };
    } else if (presetName.includes('Carig') || presetName.includes('SM City')) {
      target = { lat: 17.6278, lng: 121.7186, label: 'SM City Tuguegarao (Bagay Road Node)' };
    } else if (presetName.includes('Buntun')) {
      target = { lat: 17.6148, lng: 121.7065, label: 'Buntun Commercial Strip (Highway Corridor)' };
    }

    const calculated = analyzeLocation(target.lat, target.lng, 1.0, businessProfile, target.label);
    if (comparisonList.length < 3) {
      setComparisonList((prev) => [...prev, calculated]);
    }
  };

  const handleSelectOnMapFromComparison = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setCurrentView('map');
  };

  const handleLocateEventOnMap = (lat: number, lng: number, eventName: string) => {
    setSelectedLocation({ lat, lng });
    setSelectedLocationLabel(`Venue: ${eventName}`);
    setCurrentView('map');
  };

  const handleFormSubmit = (newProfile: BusinessProfile) => {
    setBusinessProfile(newProfile);
    setCurrentView('map');
  };

  const isSavedInComparison = Boolean(
    analysisResult &&
    comparisonList.some(
      (c) => Math.abs(c.lat - analysisResult.lat) < 0.0001 && Math.abs(c.lng - analysisResult.lng) < 0.0001
    )
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* 3-Zone Clean Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'methodology') {
            setIsMethodologyOpen(true);
          } else {
            setCurrentView(view);
          }
        }}
        onStartAnalysis={() => {
          setIsExistingModeInitial(false);
          setCurrentView('analyze-form');
        }}
        selectedLocationName={analysisResult?.addressLabel || selectedLocationLabel}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* VIEW 1: LANDING PAGE */}
        {currentView === 'landing' && (
          <LandingPage
            onAnalyzeNew={() => {
              setIsExistingModeInitial(false);
              setCurrentView('analyze-form');
            }}
            onAnalyzeExisting={() => {
              setIsExistingModeInitial(true);
              setCurrentView('analyze-form');
            }}
            onExploreMap={(provId) => {
              if (provId) {
                const prov = PROVINCES_DATA[provId];
                setSelectedLocation({ lat: prov.center[0], lng: prov.center[1] });
                setSelectedLocationLabel(`${prov.name} Capital Center`);
              }
              setCurrentView('map');
            }}
            onViewEvents={() => setCurrentView('events')}
            onViewMethodology={() => setIsMethodologyOpen(true)}
          />
        )}

        {/* VIEW 2: BUSINESS FORM */}
        {currentView === 'analyze-form' && (
          <BusinessForm
            initialProfile={businessProfile}
            isExistingModeInitial={isExistingModeInitial}
            onSubmit={handleFormSubmit}
            onCancel={() => setCurrentView('landing')}
          />
        )}

        {/* VIEW 3: INTERACTIVE GIS MAP & LOCATION ANALYSIS WORKSPACE */}
        {currentView === 'map' && (
          <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-4rem)] relative overflow-hidden">
            
            {/* GIS Map Viewport (Left / Main) */}
            <div className="flex-1 h-3/5 lg:h-full relative">
              <GisMap
                businessProfile={businessProfile}
                selectedLocation={selectedLocation}
                radiusKm={radiusKm}
                layers={layers}
                onLocationChange={handleLocationChange}
                onRadiusChange={setRadiusKm}
                onToggleLayer={handleToggleLayer}
                analysisResult={analysisResult}
              />
            </div>

            {/* Location Analysis Panel (Right on Desktop, Bottom Sheet on Mobile) */}
            <div className="w-full lg:w-[420px] xl:w-[460px] h-2/5 lg:h-full shrink-0 shadow-2xl z-20">
              <LocationAnalysisPanel
                analysis={analysisResult}
                profile={businessProfile}
                onSaveToComparison={handleSaveToComparison}
                isSavedInComparison={isSavedInComparison}
                onOpenMethodology={() => setIsMethodologyOpen(true)}
              />
            </div>

          </div>
        )}

        {/* VIEW 4: MARKET DEMOGRAPHIC INTELLIGENCE */}
        {currentView === 'market' && (
          <MarketAnalysisView
            profile={businessProfile}
            onExploreOnMap={(lat, lng, label) => {
              setSelectedLocation({ lat, lng });
              setSelectedLocationLabel(label);
              setCurrentView('map');
            }}
          />
        )}

        {/* VIEW 5: REGIONAL EVENT OPPORTUNITIES */}
        {currentView === 'events' && (
          <EventOpportunitiesView
            onLocateEventOnMap={handleLocateEventOnMap}
          />
        )}

        {/* VIEW 6: MULTI-LOCATION COMPARISON MATRIX */}
        {currentView === 'compare' && (
          <LocationComparisonView
            comparisonList={comparisonList}
            profile={businessProfile}
            onRemoveLocation={handleRemoveComparison}
            onSelectOnMap={handleSelectOnMapFromComparison}
            onAddPresetLocation={handleAddPresetComparison}
          />
        )}

      </main>

      {/* Transparency & Methodology Modal */}
      <AboutMethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

    </div>
  );
}
