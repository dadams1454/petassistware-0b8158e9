
import { ColorProbability, DogGenotype } from '@/types/genetics';

/**
 * Calculate color probabilities for offspring
 */
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

/**
 * Calculate health risks for offspring
 */
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

/**
 * Calculate COI (Coefficient of Inbreeding)
 */
export function calculateInbreedingCoefficient(
  sireGenotype: DogGenotype | null,
  damGenotype: DogGenotype | null
): number {
  if (!sireGenotype || !damGenotype) {
    return 0;
  }
  
  // In a real implementation, this would use a complex algorithm
  // For demonstration, we return a random value between 0-25%
  return Math.random() * 0.25;
}
