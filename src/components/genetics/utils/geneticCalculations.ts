
import { ColorProbability } from '@/types/genetics';

/**
 * Calculate color probabilities based on parental genotypes
 */
export const calculateColorProbabilities = (
  sireGenotype: Record<string, any>,
  damGenotype: Record<string, any>
): ColorProbability[] => {
  // This is a simplified implementation
  // A real implementation would use Punnett squares or similar genetic algorithms
  
  // Mock data for demonstration
  return [
    {
      color: 'Black',
      probability: 0.5,
      hex: '#000000',
      percentage: 50,
      name: 'Black',
      value: 50
    },
    {
      color: 'Brown',
      probability: 0.25,
      hex: '#8B4513',
      percentage: 25,
      name: 'Brown',
      value: 25
    },
    {
      color: 'Gray',
      probability: 0.25,
      hex: '#808080',
      percentage: 25,
      name: 'Gray',
      value: 25
    }
  ];
};

/**
 * Calculate coat pattern probabilities
 */
export const calculatePatternProbabilities = (
  sireGenotype: Record<string, any>,
  damGenotype: Record<string, any>
): Record<string, number> => {
  // Simplified mock implementation
  return {
    'Solid': 0.6,
    'Landseer': 0.4
  };
};

/**
 * Calculate coefficient of inbreeding
 */
export const calculateCOI = (
  sirePedigree: any[],
  damPedigree: any[],
  generations: number = 5
): number => {
  // This is a simplified placeholder
  // A real implementation would analyze pedigrees for common ancestors
  // and apply Wright's formula or a similar algorithm
  
  return 0.05; // 5% COI as a default
};

/**
 * Format coefficient of inbreeding value
 */
export const formatCOI = (coi: number): string => {
  return `${(coi * 100).toFixed(2)}%`;
};

/**
 * Get risk level based on COI
 */
export const getCOIRiskLevel = (coi: number): 'low' | 'medium' | 'high' => {
  if (coi < 0.0625) return 'low';
  if (coi < 0.125) return 'medium';
  return 'high';
};
