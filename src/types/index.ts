export type ProvinceId = 'cagayan' | 'isabela' | 'nueva_vizcaya' | 'quirino' | 'batanes';

export interface ProvinceInfo {
  id: ProvinceId;
  name: string;
  capital: string;
  population: number; // 2020/2024 PSA census
  municipalitiesCount: number;
  citiesCount: number;
  center: [number, number];
  zoom: number;
  description: string;
  keyIndustries: string[];
}

export type BusinessCategory = 
  | 'Food & Beverage'
  | 'Café'
  | 'Restaurant'
  | 'Retail'
  | 'Grocery'
  | 'Clothing'
  | 'Salon/Beauty'
  | 'Printing'
  | 'Education'
  | 'Technology'
  | 'Services'
  | 'Tourism'
  | 'Agriculture'
  | 'Transportation'
  | 'Other';

export type TargetMarketType = 
  | 'Students'
  | 'Working Professionals'
  | 'Families / Households'
  | 'Tourists & Transients'
  | 'Farmers & Agri-producers'
  | 'Broad Consumer';

export type BusinessSize = 'Micro (< ₱3M)' | 'Small (₱3M - ₱15M)' | 'Medium (₱15M - ₱100M)';

export interface BusinessProfile {
  name: string;
  category: BusinessCategory;
  productOrService: string;
  targetMarket: TargetMarketType;
  startingBudget: string;
  monthlyOperatingBudget: string;
  preferredLocation: string;
  currentLocation?: string;
  businessSize: BusinessSize;
  employeeCount: string;
  challenges?: string[];
  // For existing/struggling business mode:
  isExistingBusiness?: boolean;
  monthlyRevenue?: string;
  monthlyExpenses?: string;
  customerVolume?: string;
  operatingPeriod?: string;
}

export type PoiCategory = 
  | 'School' 
  | 'Commercial' 
  | 'F&B' 
  | 'Cafe' 
  | 'Restaurant'
  | 'Retail' 
  | 'Hospital' 
  | 'Transport' 
  | 'Government'
  | 'Tourism';

export type DataStatus = 'VERIFIED DATA' | 'ESTIMATED DATA' | 'SAMPLE DATA' | 'DATA UNAVAILABLE';

export interface PointOfInterest {
  id: string;
  name: string;
  category: PoiCategory;
  subCategory?: string;
  province: ProvinceId;
  municipality: string;
  barangay?: string;
  address: string;
  lat: number;
  lng: number;
  populationOrFootTraffic?: number;
  operatingStatus?: string;
  rating?: number;
  reviewCount?: number;
  source: string;
  dataStatus: DataStatus;
  notes?: string;
}

export type EventType = 
  | 'School Event' 
  | 'City Festival' 
  | 'Provincial Festival' 
  | 'Barangay Event' 
  | 'Government Event' 
  | 'Trade Fair' 
  | 'Tourism Event' 
  | 'Sports Event' 
  | 'Expo';

export type VendorStatus = 'Available' | 'For Confirmation' | 'Sold Out' | 'Not Indicated';

export interface BusinessEvent {
  id: string;
  name: string;
  type: EventType;
  province: ProvinceId;
  municipality: string;
  venue: string;
  organizer: string;
  lat: number;
  lng: number;
  dateStart: string;
  dateEnd: string;
  expectedAudience?: string;
  vendorOpportunity: VendorStatus;
  source: string;
  dataStatus: DataStatus;
  description: string;
}

export interface MetricFactor {
  name: string;
  score: number; // 0 - 100
  why: string;
  factors: string[];
  dataStatus: DataStatus;
  riskIndicator?: number; // 0 - 100
  whyRisk?: string;
}

export interface LocationAnalysisResult {
  lat: number;
  lng: number;
  addressLabel: string;
  radiusKm: number;
  overallPotential: number; // 0 - 100
  metrics: {
    targetMarketMatch: MetricFactor;
    marketDemand: MetricFactor;
    competitionAdvantage: MetricFactor;
    accessibility: MetricFactor;
    costFeasibility: MetricFactor;
    businessActivity: MetricFactor;
    eventOpportunity: MetricFactor;
  };
  risks: {
    competitionRisk: number;
    costRisk: number;
    accessibilityRisk: number;
    demandRisk: number;
    marketMismatchRisk: number;
  };
  nearbyPois: (PointOfInterest & { distanceKm: number })[];
  nearbyEvents: (BusinessEvent & { distanceKm: number })[];
  competitorsCount: number;
  schoolsCount: number;
  commercialCount: number;
  aiInsight: string;
  isStrugglingDiagnostic?: boolean;
}

export interface MapLayerState {
  businesses: boolean;
  competition: boolean;
  schools: boolean;
  commercial: boolean;
  transport: boolean;
  events: boolean;
  targetMarketHeat: boolean;
  opportunityIndicator: boolean;
}
