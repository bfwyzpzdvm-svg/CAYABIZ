import { LocationAnalysisResult, BusinessProfile } from '../types';
import { GoogleGenAI } from '@google/genai';

export interface AnalyticalQueryResponse {
  question: string;
  answer: string;
  source: string;
}

export async function generateGeminiLocationAnalysis(
  result: LocationAnalysisResult,
  profile: BusinessProfile,
  specificQuestion?: string
): Promise<string> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');
  
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    // Return grounded deterministic analysis if API key is not configured
    return result.aiInsight;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are the GIS & Economic Intelligence Analyst for CAYABIZ, an analytical decision-support system for Cagayan Valley (Region II), Philippines.
Analyze this proposed business location strictly based on the provided empirical facts. Do NOT invent statistics or make guaranteed promises of success. Provide a concise, highly professional analytical synthesis (2-3 short paragraphs max).

BUSINESS PROFILE:
- Name: ${profile.name}
- Category: ${profile.category}
- Product/Service: ${profile.productOrService}
- Target Market: ${profile.targetMarket}
- Starting Budget: ${profile.startingBudget}
- Monthly Operating Budget: ${profile.monthlyOperatingBudget}
- Is Existing Struggling Business: ${profile.isExistingBusiness ? 'Yes' : 'No'}

LOCATION DATA:
- Coordinates: [${result.lat}, ${result.lng}]
- Address Label: ${result.addressLabel}
- Radius: ${result.radiusKm} km
- Overall Location Potential Indicator: ${result.overallPotential}%
- Target Market Match: ${result.metrics.targetMarketMatch.score}% (${result.metrics.targetMarketMatch.why})
- Market Demand: ${result.metrics.marketDemand.score}% (${result.metrics.marketDemand.why})
- Competition Advantage: ${result.metrics.competitionAdvantage.score}% (${result.metrics.competitionAdvantage.why})
- Accessibility: ${result.metrics.accessibility.score}% (${result.metrics.accessibility.why})
- Cost Feasibility: ${result.metrics.costFeasibility.score}% (${result.metrics.costFeasibility.why})
- Business Activity: ${result.metrics.businessActivity.score}% (${result.metrics.businessActivity.why})
- Event Opportunity: ${result.metrics.eventOpportunity.score}% (${result.metrics.eventOpportunity.why})
- Nearby Competitors Count: ${result.competitorsCount}
- Nearby Schools Count: ${result.schoolsCount}
- Nearby Verified Events: ${result.nearbyEvents.length}

${specificQuestion ? `USER SPECIFIC ANALYTICAL QUESTION: "${specificQuestion}"` : 'Synthesize the strategic advantages, critical risk indicators, and key operational recommendations for this specific site in Cagayan Valley.'}

Tone: Professional, objective, data-grounded economic intelligence advisor.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    if (response && response.text) {
      return response.text.trim();
    }
    return result.aiInsight;
  } catch (err) {
    console.warn('Gemini API call bypassed or errored, falling back to deterministic spatial insight:', err);
    return result.aiInsight;
  }
}

export function getQuickAnalyticalInsights(
  result: LocationAnalysisResult,
  profile: BusinessProfile,
  topic: string
): string {
  switch (topic) {
    case 'seasonality':
      return `In Tuguegarao City and university hubs in Region II, student-oriented businesses experience a 35-50% drop in footfall during the semestral break (June-July and late December). For "${profile.name}", maintaining a cash reserve or introducing non-student delivery catering can stabilize seasonal fluctuations.`;
    
    case 'competition_agglomeration':
      if (result.competitorsCount >= 3) {
        return `Operating in a commercial cluster with ${result.competitorsCount} competitors offers the benefit of "retail agglomeration" where customers already travel to this zone specifically for food/services. The key is micro-differentiation (e.g., speed of service, signature local ingredients, or comfortable extended seating).`;
      }
      return `With low direct competitor density in your category, you face minimal direct price warfare. However, you will need active marketing to establish this spot as a primary destination for ${profile.productOrService}.`;

    case 'lease_guidance':
      return `In prime Tuguegarao commercial strips (such as Mabini Street, Balzain Highway, or Tanza), commercial rents range from ₱600 to ₱1,500 per square meter. Standard retail rule of thumb suggests occupancy costs should not exceed 12% to 15% of projected monthly gross revenue.`;

    case 'event_strategy':
      if (result.nearbyEvents.length > 0) {
        const topEvent = result.nearbyEvents[0];
        return `Take advantage of ${topEvent.name} (${topEvent.dateStart}). Secure accreditation early through the organizers to deploy a satellite booth or offer tailored promotions for event attendees.`;
      }
      return `While no major festivals are listed within this immediate radius, regional trade fairs such as DTI's Padday na Lima and city fiestas in Tuguegarao draw inter-town crowds where pop-up vendor opportunities can supplement regular shop income.`;

    default:
      return result.aiInsight;
  }
}
