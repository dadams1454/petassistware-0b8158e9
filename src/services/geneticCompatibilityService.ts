import { supabase } from '@/integrations/supabase/client';
import { 
  ColorProbability,
  DogGenotype, 
  GeneticPairingResult,
  HealthMarker
} from '@/types/genetics';
import { BreedComposition, ColorGenetics, GeneticTraitResults } from '@/types/common';
import { getDogGenetics } from './geneticsService';

// Calculate genetic compatibility between two dogs
export async function calculateGeneticCompatibility(
  sireId: string,
  damId: string
): Promise<GeneticPairingResult> {
  try {
    // Fetch genetic data for both dogs
    const sireGenotype = await getDogGenetics(sireId);
    const damGenotype = await getDogGenetics(damId);
    
    // Calculate potential outcomes
    const colorProbabilities = calculateColorProbabilities(sireGenotype, damGenotype);
    const healthRisks = calculateHealthRisks(sireGenotype, damGenotype);
    const inbreedingCoefficient = await calculateInbreedingCoefficient(sireId, damId);
    
    // Calculate overall compatibility score
    const compatibilityScore = calculateCompatibilityScore(healthRisks, inbreedingCoefficient);
    
    // Calculate health summary
    const healthSummary = calculateHealthSummary(healthRisks);
    
    // Generate recommendations
    const recommendations = generateRecommendations(healthRisks, inbreedingCoefficient, compatibilityScore);
    
    return {
      sireGenotype,
      damGenotype,
      colorProbabilities,
      healthRisks,
      inbreedingCoefficient,
      compatibilityScore,
      healthSummary,
      recommendations
    };
  } catch (error) {
    console.error('Error calculating genetic compatibility:', error);
    throw error;
  }
}

// Fetch raw genetic data from database
export async function fetchGeneticData(dogId: string) {
  try {
    const { data, error } = await supabase
      .from('genetic_data')
      .select('*')
      .eq('dog_id', dogId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching genetic data:', error);
    return null;
  }
}

// Extract dog genotype from database data
export async function extractDogGenotype(geneticData: any): Promise<DogGenotype | null> {
  if (!geneticData) return null;
  
  try {
    // Get dog info to include name and breed
    const { data: dogData, error } = await supabase
      .from('dogs')
      .select('name, breed')
      .eq('id', geneticData.dog_id)
      .single();
    
    if (error) throw error;
    
    // Properly cast JSON fields to typed objects
    const breedComposition = geneticData.breed_composition as BreedComposition || {};
    const traitResults = geneticData.trait_results as GeneticTraitResults || {};
    const colorGenetics = traitResults?.color || {};
    const healthResults = geneticData.health_results as Record<string, HealthMarker> || {};
    
    return {
      dog_id: geneticData.dog_id,
      name: dogData?.name || 'Unknown',
      breed: breedComposition?.primary || 'Unknown Breed',
      baseColor: colorGenetics?.base || 'Unknown',
      brownDilution: colorGenetics?.brown_dilution || 'Unknown',
      dilution: colorGenetics?.dilution || 'Unknown',
      agouti: colorGenetics?.agouti || 'Unknown',
      healthMarkers: healthResults,
      colorGenetics: colorGenetics || {},
      traits: traitResults || {}
    };
  } catch (error) {
    console.error('Error extracting dog genotype:', error);
    return null;
  }
}

// Calculate color probabilities for offspring
export function calculateColorProbabilities(
  sireGenotype: DogGenotype | null,
  damGenotype: DogGenotype | null
): ColorProbability[] {
  if (!sireGenotype || !damGenotype) {
    return [{ color: 'Unknown', probability: 1 }];
  }
  
  // This is a simplified implementation
  // A real implementation would use genetic inheritance models
  const colorProbabilities: ColorProbability[] = [
    { color: 'Black', probability: 0.4, hex: '#000000' },
    { color: 'Brown', probability: 0.3, hex: '#964B00' },
    { color: 'Golden', probability: 0.2, hex: '#FFD700' },
    { color: 'Cream', probability: 0.1, hex: '#FFFDD0' }
  ];
  
  return colorProbabilities;
}

// Calculate health risks for offspring
export function calculateHealthRisks(
  sireGenotype: DogGenotype | null,
  damGenotype: DogGenotype | null
): Record<string, { status: string; probability: number }> {
  if (!sireGenotype || !damGenotype) {
    return {};
  }
  
  const healthRisks: Record<string, { status: string; probability: number }> = {};
  
  // Collect all health conditions from both genotypes
  const allConditions = new Set<string>();
  if (sireGenotype.healthMarkers) {
    Object.keys(sireGenotype.healthMarkers).forEach(condition => allConditions.add(condition));
  }
  if (damGenotype.healthMarkers) {
    Object.keys(damGenotype.healthMarkers).forEach(condition => allConditions.add(condition));
  }
  
  // Calculate risk for each condition
  allConditions.forEach(condition => {
    const sireMarker = sireGenotype.healthMarkers?.[condition];
    const damMarker = damGenotype.healthMarkers?.[condition];
    
    if (!sireMarker || !damMarker) {
      healthRisks[condition] = { status: 'unknown', probability: 0 };
      return;
    }
    
    // Simple Mendelian inheritance for autosomal recessive conditions
    if (sireMarker.status === 'clear' && damMarker.status === 'clear') {
      healthRisks[condition] = { status: 'clear', probability: 0 };
    } else if (sireMarker.status === 'clear' && damMarker.status === 'carrier' || 
               sireMarker.status === 'carrier' && damMarker.status === 'clear') {
      healthRisks[condition] = { status: 'carrier', probability: 0.5 };
    } else if (sireMarker.status === 'carrier' && damMarker.status === 'carrier') {
      healthRisks[condition] = { status: 'at_risk', probability: 0.25 };
    } else if (sireMarker.status === 'affected' || damMarker.status === 'affected') {
      healthRisks[condition] = { status: 'at_risk', probability: 0.5 };
    } else {
      healthRisks[condition] = { status: 'unknown', probability: 0 };
    }
  });
  
  return healthRisks;
}

// Calculate COI (Coefficient of Inbreeding)
export async function calculateInbreedingCoefficient(
  sireId: string,
  damId: string
): Promise<number> {
  try {
    // This would normally involve complex pedigree analysis
    // For demonstration, we'll use a random value between 0-25%
    const randomCOI = Math.random() * 0.25;
    return randomCOI;
  } catch (error) {
    console.error('Error calculating COI:', error);
    return 0;
  }
}

// Calculate overall compatibility score
export function calculateCompatibilityScore(
  healthRisks: Record<string, { status: string; probability: number }>,
  inbreedingCoefficient: number
): number {
  // Base score starts at 100
  let score = 100;
  
  // Deduct for health risks
  Object.values(healthRisks).forEach(risk => {
    if (risk.status === 'at_risk') {
      score -= 15 * risk.probability;
    } else if (risk.status === 'carrier') {
      score -= 5 * risk.probability;
    }
  });
  
  // Deduct for inbreeding
  score -= inbreedingCoefficient * 100;
  
  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, score));
}

// Generate breeding recommendations based on genetic analysis
export function generateRecommendations(
  healthRisks: Record<string, { status: string; probability: number }>,
  inbreedingCoefficient: number,
  compatibilityScore: number
): string[] {
  const recommendations: string[] = [];
  
  if (compatibilityScore < 50) {
    recommendations.push('This pairing is not recommended due to significant genetic concerns.');
  }
  
  if (inbreedingCoefficient > 0.20) {
    recommendations.push('Consider a different pairing with a lower inbreeding coefficient.');
  }
  
  Object.entries(healthRisks).forEach(([condition, risk]) => {
    if (risk.status === 'at_risk') {
      recommendations.push(`Be aware of the risk of ${condition} in offspring.`);
    }
  });
  
  if (recommendations.length === 0) {
    recommendations.push('This pairing appears to be genetically compatible.');
  }
  
  return recommendations;
}

// Calculate health summary from health risks
export function calculateHealthSummary(
  healthRisks: Record<string, { status: string; probability: number }>
): { atRiskCount: number; carrierCount: number; clearCount: number; unknownCount: number; totalTests: number } {
  let atRiskCount = 0;
  let carrierCount = 0;
  let clearCount = 0;
  let unknownCount = 0;
  
  Object.values(healthRisks).forEach(risk => {
    if (risk.status === 'at_risk') {
      atRiskCount++;
    } else if (risk.status === 'carrier') {
      carrierCount++;
    } else if (risk.status === 'clear') {
      clearCount++;
    } else {
      unknownCount++;
    }
  });
  
  const totalTests = Object.keys(healthRisks).length;
  
  return { atRiskCount, carrierCount, clearCount, unknownCount, totalTests };
}
