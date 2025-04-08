
import { ColorProbability, DogGenotype, HealthRisk } from '@/types/genetics';

/**
 * Calculate color probabilities for offspring based on sire and dam genotypes
 * 
 * @param sireGenotype The sire's genetic data
 * @param damGenotype The dam's genetic data
 * @returns Array of color probabilities for potential offspring
 */
export const calculateColorProbabilities = (
  sireGenotype: DogGenotype | null,
  damGenotype: DogGenotype | null
): ColorProbability[] => {
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
};

/**
 * Calculate health risks for offspring based on sire and dam genotypes
 * 
 * @param sireGenotype The sire's genetic data
 * @param damGenotype The dam's genetic data
 * @returns Record of health condition risks for potential offspring
 */
export const calculateHealthRisks = (
  sireGenotype: DogGenotype | null,
  damGenotype: DogGenotype | null
): Record<string, HealthRisk> => {
  if (!sireGenotype || !damGenotype) {
    return {};
  }
  
  const healthRisks: Record<string, HealthRisk> = {};
  
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
      healthRisks[condition] = { status: 'unknown', probability: 0, condition };
      return;
    }
    
    // Simple Mendelian inheritance for autosomal recessive conditions
    if (sireMarker.status === 'clear' && damMarker.status === 'clear') {
      healthRisks[condition] = { status: 'clear', probability: 0, condition };
    } else if (sireMarker.status === 'clear' && damMarker.status === 'carrier' || 
               sireMarker.status === 'carrier' && damMarker.status === 'clear') {
      healthRisks[condition] = { status: 'carrier', probability: 0.5, condition };
    } else if (sireMarker.status === 'carrier' && damMarker.status === 'carrier') {
      healthRisks[condition] = { status: 'at_risk', probability: 0.25, condition };
    } else if (sireMarker.status === 'affected' || damMarker.status === 'affected') {
      healthRisks[condition] = { status: 'at_risk', probability: 0.5, condition };
    } else {
      healthRisks[condition] = { status: 'unknown', probability: 0, condition };
    }
  });
  
  // Add some placeholder health risks for demonstration
  if (Object.keys(healthRisks).length === 0) {
    healthRisks['Hip Dysplasia'] = { status: 'carrier', probability: 0.25, condition: 'Hip Dysplasia' };
    healthRisks['Progressive Retinal Atrophy'] = { status: 'clear', probability: 0, condition: 'Progressive Retinal Atrophy' };
    healthRisks['von Willebrand Disease'] = { status: 'at_risk', probability: 0.25, condition: 'von Willebrand Disease' };
  }
  
  return healthRisks;
};
