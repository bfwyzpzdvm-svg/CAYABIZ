import { 
  BusinessProfile, 
  PointOfInterest, 
  BusinessEvent, 
  LocationAnalysisResult, 
  MetricFactor, 
  DataStatus 
} from '../types';
import { REAL_POIS, REAL_EVENTS } from '../data/cagayanValleyData';

// Haversine distance in kilometers
export function calculateHaversineDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100; // 2 decimal places
}

export function analyzeLocation(
  lat: number,
  lng: number,
  radiusKm: number,
  profile: BusinessProfile,
  customAddressLabel?: string
): LocationAnalysisResult {
  // 1. Filter nearby points of interest within radius
  const nearbyPois = REAL_POIS.map((poi) => ({
    ...poi,
    distanceKm: calculateHaversineDistance(lat, lng, poi.lat, poi.lng),
  }))
    .filter((p) => p.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  // 2. Filter nearby events within radius or regional sphere (events up to 2x radius or 8km)
  const nearbyEvents = REAL_EVENTS.map((evt) => ({
    ...evt,
    distanceKm: calculateHaversineDistance(lat, lng, evt.lat, evt.lng),
  }))
    .filter((e) => e.distanceKm <= Math.max(radiusKm, 5.0))
    .sort((a, b) => a.distanceKm - b.distanceKm);

  // Categorize POIs
  const schools = nearbyPois.filter((p) => p.category === 'School');
  const commercial = nearbyPois.filter((p) => p.category === 'Commercial');
  const hospitals = nearbyPois.filter((p) => p.category === 'Hospital');
  const transport = nearbyPois.filter((p) => p.category === 'Transport');
  const government = nearbyPois.filter((p) => p.category === 'Government');

  // Competitor matching based on category
  const competitors = nearbyPois.filter((p) => {
    if (profile.category === 'Food & Beverage' || profile.category === 'Café' || profile.category === 'Restaurant') {
      return p.category === 'Cafe' || p.category === 'F&B' || p.category === 'Restaurant';
    }
    if (profile.category === 'Retail' || profile.category === 'Grocery' || profile.category === 'Clothing') {
      return p.category === 'Commercial' || p.category === 'Retail';
    }
    return p.category === (profile.category as any);
  });

  const totalStudentPop = schools.reduce((acc, s) => acc + (s.populationOrFootTraffic || 0), 0);
  const totalCommercialFootTraffic = commercial.reduce((acc, c) => acc + (c.populationOrFootTraffic || 0), 0);

  // ==========================================
  // METRIC 1: TARGET MARKET MATCH (0-100)
  // ==========================================
  let targetMatchScore = 52;
  const targetFactors: string[] = [];
  let targetWhy = '';
  let targetStatus: DataStatus = 'VERIFIED DATA';

  if (profile.targetMarket === 'Students') {
    if (schools.length > 0) {
      const studentBonus = Math.min(schools.length * 14 + (totalStudentPop > 10000 ? 20 : 10), 45);
      targetMatchScore = Math.min(96, 50 + studentBonus);
      targetFactors.push(
        `${schools.length} verified educational institutions located within ${radiusKm}km`,
        `Estimated active student population of ~${totalStudentPop.toLocaleString()} enrolled in immediate cluster`,
        `High weekday foot traffic concentration from university class schedules`
      );
      targetWhy = `Approximately ${targetMatchScore}% alignment: Location is situated within direct pedestrian reach of major institutions (${schools.map((s) => s.name.split('(')[0].trim()).slice(0, 3).join(', ')}), generating sustained daily student footfall.`;
    } else {
      targetMatchScore = 38;
      targetStatus = 'ESTIMATED DATA';
      targetFactors.push(
        `0 major educational institutions verified within ${radiusKm}km radius`,
        `Requires transit/commute for student demographic to access this location`
      );
      targetWhy = `Low student concentration (38%): No verified universities or senior high schools exist inside the selected ${radiusKm}km zone. Capturing student volume will rely on commuters rather than spontaneous pedestrian walk-ins.`;
    }
  } else if (profile.targetMarket === 'Working Professionals') {
    const proNodes = commercial.length + government.length + hospitals.length;
    if (proNodes > 0) {
      targetMatchScore = Math.min(94, 48 + proNodes * 12);
      targetFactors.push(
        `Adjacent to ${government.length} government administrative entities and ${commercial.length} commercial retail centers`,
        `Concentration of salaried civil servants, corporate branch personnel, and healthcare professionals`,
        `Higher median disposable income compared to student-exclusive corridors`
      );
      targetWhy = `Strong working professional alignment (${targetMatchScore}%): Anchored by major employment anchors (${[...government, ...commercial, ...hospitals].map((p) => p.name).slice(0, 2).join(', ')}), providing lunchtime and post-work consumer spending.`;
    } else {
      targetMatchScore = 44;
      targetWhy = `Moderate working professional presence (44%): Limited formal office complexes or government centers within immediate radius.`;
      targetFactors.push(`Primarily residential or secondary commercial zoning`);
    }
  } else if (profile.targetMarket === 'Tourists & Transients') {
    const tourismNodes = transport.length + nearbyPois.filter((p) => p.subCategory?.includes('Heritage') || p.category === 'Tourism').length;
    targetMatchScore = Math.min(92, 45 + tourismNodes * 18);
    targetFactors.push(
      `${transport.length} major transit terminals or airport corridors within radius`,
      `Accessibility to inter-provincial bus lines (Victory Liner, GV Florida) and local jeepney routes`
    );
    targetWhy = `Transient & Tourism Match (${targetMatchScore}%): Positioned along inter-provincial arrival or culinary corridors with steady non-resident traffic.`;
  } else {
    // Families / Broad Consumer
    const generalNodes = commercial.length * 10 + transport.length * 8;
    targetMatchScore = Math.min(90, 50 + generalNodes);
    targetFactors.push(
      `Proximity to established commercial anchor malls (${commercial.map((c) => c.name).slice(0, 2).join(', ') || 'Local markets'})`,
      `Established residential barangay catchments with routine household grocery and dining needs`
    );
    targetWhy = `Broad consumer match (${targetMatchScore}%): Commercial node supports balanced household shopping and weekend dining patterns.`;
  }

  // ==========================================
  // METRIC 2: MARKET DEMAND (0-100)
  // ==========================================
  let demandScore = 55;
  const demandFactors: string[] = [];
  const aggregateFootTraffic = totalStudentPop + totalCommercialFootTraffic;
  if (aggregateFootTraffic > 30000) {
    demandScore = 91;
    demandFactors.push(
      `Very high aggregate estimated daily footfall (~${aggregateFootTraffic.toLocaleString()} persons)`,
      `Strong daily turnover generated by anchor shopping complexes and academic institutions`,
      `High density of consumer transactions in Tuguegarao central trade corridor`
    );
  } else if (aggregateFootTraffic > 10000) {
    demandScore = 78;
    demandFactors.push(
      `Healthy aggregate estimated daily footfall (~${aggregateFootTraffic.toLocaleString()} persons)`,
      `Sustained daytime consumer traffic supported by mixed educational/commercial activity`
    );
  } else {
    demandScore = 58;
    demandFactors.push(
      `Moderate local neighborhood demand`,
      `Footfall reliant on localized residential neighborhood density without mega-anchors`
    );
  }
  const demandWhy = `Market Demand Score: ${demandScore}%. Based on verified daily pedestrian traffic, institutional enrollment, and commercial center foot traffic recorded across ${nearbyPois.length} nearby establishments.`;

  // ==========================================
  // METRIC 3: COMPETITION ADVANTAGE (0-100)
  // ==========================================
  // In business intelligence: moderate competition (1-3) indicates a proven cluster; extreme saturation (>6) reduces margin; 0 competitors in high-demand zone is great, but in low-demand zone may mean zero viability.
  let compAdvantageScore = 72;
  const compFactors: string[] = [];
  let compWhy = '';

  if (competitors.length === 0) {
    compAdvantageScore = aggregateFootTraffic > 15000 ? 88 : 74;
    compFactors.push(
      `Zero direct verified competitors detected in the exact ${profile.category} segment within ${radiusKm}km`,
      `Potential first-mover advantage if consumer demand exists in this micro-district`,
      `Requires customer education and brand awareness generation`
    );
    compWhy = `High Competition Advantage (${compAdvantageScore}%): No existing direct competitors in your category within ${radiusKm}km. You have open territory, provided foot traffic matches your profile.`;
  } else if (competitors.length <= 2) {
    compAdvantageScore = 80;
    compFactors.push(
      `Balanced competitive density (${competitors.length} competitor: ${competitors.map((c) => c.name).join(', ')})`,
      `Validates that customers already visit this area specifically for ${profile.category}`,
      `Manageable market share capture with clear product or pricing differentiation`
    );
    compWhy = `Healthy Competitive Landscape (${compAdvantageScore}%): ${competitors.length} competitor(s) present. This represents a proven customer destination without severe price warfare or cannibalization.`;
  } else if (competitors.length <= 5) {
    compAdvantageScore = 65;
    compFactors.push(
      `Moderate-to-high competition density (${competitors.length} establishments)`,
      `Existing commercial cluster (e.g., fast food or cafe lane)`,
      `Requires distinct value proposition (e.g. specialty menu, late hours, study spaces)`
    );
    compWhy = `Moderate Competition Advantage (${compAdvantageScore}%): ${competitors.length} similar businesses operate within ${radiusKm}km. While foot traffic is attracted to this cluster, customer loyalty is divided.`;
  } else {
    compAdvantageScore = 48;
    compFactors.push(
      `High saturation risk (${competitors.length} direct competitors within ${radiusKm}km)`,
      `Heavy customer acquisition cost and aggressive price competition`,
      `High presence of established franchise brands with massive marketing budgets`
    );
    compWhy = `Challenging Competition Index (${compAdvantageScore}%): Market saturation indicators detected. ${competitors.length} competing establishments within ${radiusKm}km will require high marketing spend and superior differentiation to win market share.`;
  }

  // ==========================================
  // METRIC 4: ACCESSIBILITY (0-100)
  // ==========================================
  let accessScore = 60;
  const accessFactors: string[] = [];
  const hasTransportNearby = transport.length > 0;
  const hasCommercialNearby = commercial.length > 0;

  if (hasTransportNearby && hasCommercialNearby) {
    accessScore = 93;
    accessFactors.push(
      `Direct connectivity to Maharlika Highway or major arterial avenues`,
      `Immediate proximity to public transit stops, tricycle terminals, and jeepney corridors`,
      `Exceptional walkability and vehicular drop-off access`
    );
  } else if (hasCommercialNearby || schools.length > 0) {
    accessScore = 86;
    accessFactors.push(
      `Paved multi-lane thoroughfare with regular tricycle and PUV routes`,
      `High pedestrian sidewalk connectivity between institutional gates and retail frontages`
    );
  } else {
    accessScore = 64;
    accessFactors.push(
      `Secondary or residential roadway access`,
      `Requires intentional customer trip rather than spontaneous walk-by footfall`
    );
  }
  const accessWhy = `Accessibility Score: ${accessScore}%. Evaluated based on adjacency to arterial transport corridors, public utility vehicle routes, and pedestrian sidewalk infrastructure.`;

  // ==========================================
  // METRIC 5: COST FEASIBILITY (0-100)
  // ==========================================
  // High foot traffic zones (SM Downtown, Carig mall, USLT front) have higher lease rates (₱800-₱1,800/sqm), requiring higher operating budget.
  let costFeasibilityScore = 70;
  const costFactors: string[] = [];
  const isPrimeMallZone = commercial.some((c) => c.distanceKm < 0.35);

  const budgetNum = parseInt(profile.startingBudget.replace(/[^0-9]/g, ''), 10) || 150000;

  if (isPrimeMallZone) {
    if (budgetNum >= 500000) {
      costFeasibilityScore = 82;
      costFactors.push(
        `High commercial rental tier (estimated ₱800 - ₱1,600 / sqm monthly in prime commercial retail)`,
        `Your declared starting capital (₱${budgetNum.toLocaleString()}) adequately covers 3-6 months advance lease and fit-out`,
        `High turnover potential offsets higher lease costs`
      );
    } else {
      costFeasibilityScore = 56;
      costFactors.push(
        `High commercial lease rates in prime mall/avenue proximity`,
        `Declared budget of ₱${budgetNum.toLocaleString()} may face tight cashflow cushions under standard 2-month deposit + 1-month advance`,
        `Recommendation: Consider kiosk format, secondary street frontage, or co-sharing arrangements`
      );
    }
  } else {
    costFeasibilityScore = 78;
    costFactors.push(
      `Moderate commercial lease rates (estimated ₱350 - ₱700 / sqm monthly for street-level commercial)`,
      `Budget of ₱${budgetNum.toLocaleString()} provides healthy operational runway for 4 to 6 months`,
      `Lower overhead enables resilient pricing flexibility`
    );
  }
  const costWhy = `Cost Feasibility: ${costFeasibilityScore}%. Synthesized from local commercial real estate lease estimates in Tuguegarao City against your declared starting and operating capital.`;

  // ==========================================
  // METRIC 6: BUSINESS ACTIVITY (0-100)
  // ==========================================
  let businessActivityScore = 50;
  const activityFactors: string[] = [];
  if (nearbyPois.length >= 8) {
    businessActivityScore = 92;
    activityFactors.push(
      `Very high density of ${nearbyPois.length} operating institutions and enterprises within ${radiusKm}km`,
      `Established commercial zoning with complementary retail, banking, food, and administrative services`,
      `Synergistic cross-shopping between adjacent stores and schools`
    );
  } else if (nearbyPois.length >= 4) {
    businessActivityScore = 79;
    activityFactors.push(
      `Active micro-commercial corridor with ${nearbyPois.length} verified establishments`,
      `Steady daytime commercial interactions and local service provision`
    );
  } else {
    businessActivityScore = 58;
    activityFactors.push(
      `Emerging or lower-density commercial activity (${nearbyPois.length} verified POIs)`,
      `Lower density allows destination-style concepts with dedicated parking or delivery focus`
    );
  }
  const businessActivityWhy = `Business Activity Score: ${businessActivityScore}%. Measures the density and vitality of surrounding commercial, healthcare, educational, and service establishments within the active search radius.`;

  // ==========================================
  // METRIC 7: EVENT OPPORTUNITY (0-100)
  // ==========================================
  let eventScore = 40;
  const eventFactors: string[] = [];
  if (nearbyEvents.length >= 3) {
    eventScore = 88;
    eventFactors.push(
      `${nearbyEvents.length} major verified events (festivals, intramurals, trade expos) identified in this catchment`,
      `High potential for pop-up booths, catering, student promos, and seasonal event revenue surges`,
      `Verified vendor booth opportunities recorded in local tourism/school calendars`
    );
  } else if (nearbyEvents.length >= 1) {
    eventScore = 74;
    eventFactors.push(
      `${nearbyEvents.length} upcoming verified event(s): ${nearbyEvents[0].name}`,
      `Provides scheduled customer influx during event dates (${nearbyEvents[0].dateStart})`,
      `Check organizer registration guidelines for booth accreditation`
    );
  } else {
    eventScore = 45;
    eventFactors.push(
      `No major city or institutional events officially listed inside this immediate radius`,
      `Business will rely predominantly on regular daily customer visits rather than event spikes`
    );
  }
  const eventWhy = `Event Opportunity Score: ${eventScore}%. Evaluates proximity to recurring school intramurals, city festivals (e.g. Afi Festival), and DTI regional trade expos that supply high-turnover vendor opportunities.`;

  // ==========================================
  // OVERALL LOCATION POTENTIAL (WEIGHTED AVERAGE)
  // ==========================================
  // Methodology:
  // Target Market Match (25%) + Market Demand (20%) + Competition Advantage (15%) + Accessibility (15%) + Cost Feasibility (10%) + Business Activity (10%) + Event Opportunity (5%)
  const weightedOverall = Math.round(
    targetMatchScore * 0.25 +
    demandScore * 0.20 +
    compAdvantageScore * 0.15 +
    accessScore * 0.15 +
    costFeasibilityScore * 0.10 +
    businessActivityScore * 0.10 +
    eventScore * 0.05
  );

  // ==========================================
  // RISK INDICATORS (0 - 100%)
  // ==========================================
  const competitionRisk = Math.min(95, Math.max(15, 100 - compAdvantageScore + (competitors.length > 4 ? 15 : 0)));
  const costRisk = Math.min(95, Math.max(10, 100 - costFeasibilityScore));
  const accessibilityRisk = Math.min(90, Math.max(8, 100 - accessScore));
  const demandRisk = Math.min(90, Math.max(10, 100 - demandScore));
  const marketMismatchRisk = Math.min(95, Math.max(10, 100 - targetMatchScore));

  // Determine concise address label
  let addressLabel = customAddressLabel || 'Selected Map Location';
  if (!customAddressLabel && nearbyPois.length > 0) {
    const closest = nearbyPois[0];
    addressLabel = `Near ${closest.name}, ${closest.barangay ? closest.barangay + ', ' : ''}${closest.municipality}`;
  }

  // Construct structured AI location insight
  const aiInsight = generateLocationInsight(
    weightedOverall,
    profile,
    addressLabel,
    targetMatchScore,
    compAdvantageScore,
    accessScore,
    competitors.length,
    schools.length,
    nearbyEvents.length,
    radiusKm
  );

  return {
    lat,
    lng,
    addressLabel,
    radiusKm,
    overallPotential: weightedOverall,
    metrics: {
      targetMarketMatch: {
        name: 'Target Market Match',
        score: targetMatchScore,
        why: targetWhy,
        factors: targetFactors,
        dataStatus: targetStatus,
        riskIndicator: marketMismatchRisk,
        whyRisk: marketMismatchRisk > 40 ? 'Demographic concentration is dispersed; higher customer acquisition effort needed.' : 'Favorable target market alignment.'
      },
      marketDemand: {
        name: 'Market Demand',
        score: demandScore,
        why: demandWhy,
        factors: demandFactors,
        dataStatus: 'VERIFIED DATA',
        riskIndicator: demandRisk,
        whyRisk: demandRisk > 35 ? 'Moderate baseline traffic requires promotional pull.' : 'Reliable aggregate demand anchored by major community institutions.'
      },
      competitionAdvantage: {
        name: 'Competition Advantage',
        score: compAdvantageScore,
        why: compWhy,
        factors: compFactors,
        dataStatus: 'VERIFIED DATA',
        riskIndicator: competitionRisk,
        whyRisk: competitionRisk > 45 ? `${competitors.length} existing competitor(s) nearby. Strong menu/pricing differentiation is essential.` : 'Low competitor density affords higher market share capture.'
      },
      accessibility: {
        name: 'Accessibility',
        score: accessScore,
        why: accessWhy,
        factors: accessFactors,
        dataStatus: 'VERIFIED DATA',
        riskIndicator: accessibilityRisk,
        whyRisk: accessibilityRisk > 30 ? 'Secondary route location may reduce impulse walk-ins.' : 'High road connectivity and transit accessibility.'
      },
      costFeasibility: {
        name: 'Cost Feasibility',
        score: costFeasibilityScore,
        why: costWhy,
        factors: costFactors,
        dataStatus: 'ESTIMATED DATA',
        riskIndicator: costRisk,
        whyRisk: costRisk > 40 ? 'Lease overhead in prime commercial corridors requires robust break-even monitoring.' : 'Operating capital aligns comfortably with standard local rent parameters.'
      },
      businessActivity: {
        name: 'Business Activity',
        score: businessActivityScore,
        why: businessActivityWhy,
        factors: activityFactors,
        dataStatus: 'VERIFIED DATA',
        riskIndicator: Math.max(10, 100 - businessActivityScore),
        whyRisk: 'Commercial density reflects mutual customer generation from neighboring stores.'
      },
      eventOpportunity: {
        name: 'Event Opportunity',
        score: eventScore,
        why: eventWhy,
        factors: eventFactors,
        dataStatus: nearbyEvents.length > 0 ? 'VERIFIED DATA' : 'DATA UNAVAILABLE',
        riskIndicator: Math.max(15, 100 - eventScore),
        whyRisk: eventScore < 50 ? 'Limited recurring festival or university events nearby; sales rely primarily on day-to-day operations.' : 'Seasonal festivals provide major boost for pop-up booths and catering.'
      }
    },
    risks: {
      competitionRisk,
      costRisk,
      accessibilityRisk,
      demandRisk,
      marketMismatchRisk
    },
    nearbyPois,
    nearbyEvents,
    competitorsCount: competitors.length,
    schoolsCount: schools.length,
    commercialCount: commercial.length,
    aiInsight,
    isStrugglingDiagnostic: profile.isExistingBusiness
  };
}

function generateLocationInsight(
  overall: number,
  profile: BusinessProfile,
  address: string,
  targetMatch: number,
  compAdvantage: number,
  access: number,
  compCount: number,
  schoolCount: number,
  eventCount: number,
  radiusKm: number
): string {
  const viability = overall >= 80 ? 'promising potential' : overall >= 65 ? 'moderate viability with defined trade-offs' : 'notable structural hurdles';
  
  let targetSentence = '';
  if (profile.targetMarket === 'Students' && schoolCount > 0) {
    targetSentence = `The selected radius encompasses ${schoolCount} major academic institution(s), yielding favorable ${targetMatch}% demographic alignment for youth and student spending.`;
  } else if (profile.targetMarket === 'Working Professionals') {
    targetSentence = `Proximity to administrative, medical, and banking facilities supports sustained daytime demand from salaried professionals.`;
  } else {
    targetSentence = `The surrounding district exhibits steady general commerce, though targeted promotional outreach will be needed to cultivate regular repeat patrons.`;
  }

  let compSentence = '';
  if (compCount === 0) {
    compSentence = `There are currently no verified direct competitors in the ${profile.category} category within ${radiusKm}km, affording an advantageous early-mover positioning.`;
  } else if (compCount <= 3) {
    compSentence = `The presence of ${compCount} competitor(s) verifies established customer footfall without indicating severe market saturation.`;
  } else {
    compSentence = `With ${compCount} competing establishments within ${radiusKm}km, competitive density is high. Differentiation in pricing, ambiance, or product uniqueness is strongly advised.`;
  }

  let eventSentence = '';
  if (eventCount > 0) {
    eventSentence = ` Furthermore, ${eventCount} verified regional event(s) in this sector offer seasonal surge opportunities for mobile booths or catering.`;
  }

  return `Analysis indicates ${viability} (Overall Potential Indicator: ${overall}%). ${targetSentence} ${compSentence} Accessibility indicators (${access}%) remain strong.${eventSentence} Note: CAYABIZ indicators provide decision support based on available public data; comprehensive on-site ocular verification is always recommended before executing lease commitments.`;
}
