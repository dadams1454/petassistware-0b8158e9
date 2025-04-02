
import { ColorProbability, DogGenotype } from '@/types/genetics';

// Calculate color probabilities for offspring based on parent genotypes
export const calculateColorProbabilities = (
  sireGenotype: DogGenotype,
  damGenotype: DogGenotype
): ColorProbability[] => {
  // This is a simplified implementation - in a real app, this would use actual genetic rules
  // For now, just returning some sample data
  
  // If we don't have color information, return empty array
  if (!sireGenotype.baseColor || !damGenotype.baseColor) {
    return [];
  }
  
  // Mock results based on parent colors
  if (sireGenotype.baseColor === 'Black' && damGenotype.baseColor === 'Black') {
    return [
      {
        color: 'Black',
        probability: 0.75,
      },
      {
        color: 'Brown',
        probability: 0.25,
      }
    ];
  }
  
  if (sireGenotype.baseColor === 'Black' && damGenotype.baseColor === 'Brown') {
    return [
      {
        color: 'Black',
        probability: 0.5,
      },
      {
        color: 'Brown',
        probability: 0.5,
      }
    ];
  }
  
  // Default case
  return [
    {
      color: 'Mixed',
      probability: 1,
    }
  ];
};

// Calculate the potential health markers for offspring
export const calculateHealthRisks = (sireGenotype: DogGenotype, damGenotype: DogGenotype) => {
  const offspringRisks: Record<string, { status: string; probability: number }> = {};
  
  // Combine health markers from both parents
  const allConditions = new Set<string>();
  
  if (sireGenotype.healthMarkers) {
    Object.keys(sireGenotype.healthMarkers).forEach(key => allConditions.add(key));
  }
  
  if (damGenotype.healthMarkers) {
    Object.keys(damGenotype.healthMarkers).forEach(key => allConditions.add(key));
  }
  
  // Calculate risks for each condition
  allConditions.forEach(condition => {
    const sireStatus = sireGenotype.healthMarkers?.[condition]?.status || 'unknown';
    const damStatus = damGenotype.healthMarkers?.[condition]?.status || 'unknown';
    
    // Simple genetic inheritance rules (simplified for demonstration)
    if (sireStatus === 'at_risk' && damStatus === 'at_risk') {
      offspringRisks[condition] = { status: 'at_risk', probability: 1.0 };
    } else if (sireStatus === 'at_risk' && damStatus === 'carrier') {
      offspringRisks[condition] = { status: 'at_risk', probability: 0.5 };
    } else if (sireStatus === 'carrier' && damStatus === 'at_risk') {
      offspringRisks[condition] = { status: 'at_risk', probability: 0.5 };
    } else if (sireStatus === 'carrier' && damStatus === 'carrier') {
      offspringRisks[condition] = { status: 'at_risk', probability: 0.25 };
    } else if ((sireStatus === 'at_risk' && damStatus === 'clear') || 
               (sireStatus === 'clear' && damStatus === 'at_risk')) {
      offspringRisks[condition] = { status: 'carrier', probability: 1.0 };
    } else if ((sireStatus === 'carrier' && damStatus === 'clear') || 
               (sireStatus === 'clear' && damStatus === 'carrier')) {
      offspringRisks[condition] = { status: 'carrier', probability: 0.5 };
    } else if (sireStatus === 'clear' && damStatus === 'clear') {
      offspringRisks[condition] = { status: 'clear', probability: 1.0 };
    } else {
      offspringRisks[condition] = { status: 'unknown', probability: 0 };
    }
  });
  
  return offspringRisks;
};

// Calculate inbreeding coefficient (simplified example)
export const calculateInbreedingCoefficient = (
  sireGenotype: DogGenotype,
  damGenotype: DogGenotype
): number => {
  // This is a placeholder - actual calculation would require pedigree data
  return 0.0625; // Example value - 6.25% (equivalent to mating cousins)
};
