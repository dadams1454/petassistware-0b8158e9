
/**
 * Types for genetics and breeding analysis
 */

/**
 * Interface for color probability in breeding outcomes
 */
export interface ColorProbability {
  color: string;
  probability: number;
  hex?: string; // Optional hex code for displaying the color
}

/**
 * Interface for genotype data of a dog
 */
export interface DogGenotype {
  id: string;
  dog_id: string;
  baseColor: string;
  brownDilution: string;
  dilution: string;
  agouti: string;
  healthMarkers: Record<string, string>;
  updated_at: string;
}

/**
 * Interface for health marker in genetic testing
 */
export interface HealthMarker {
  status: string; // 'clear', 'carrier', 'at_risk', 'affected', 'unknown'
  testDate?: string;
  notes?: string;
  certified?: boolean;
}

/**
 * Interface for health summary statistics
 */
export interface HealthSummary {
  atRiskCount: number;
  carrierCount: number;
  clearCount: number;
  unknownCount: number;
  totalTests: number;
}

/**
 * Interface for color genetics data
 */
export interface ColorGenetics {
  baseColor: string;
  dilution: string;
  brownDilution: string;
  agouti: string;
  patterns?: string[];
}

/**
 * Interface for breed composition data
 */
export interface BreedComposition {
  primaryBreed: string;
  primaryPercentage: number;
  secondaryBreed?: string;
  secondaryPercentage?: number;
  otherBreeds?: Record<string, number>;
}

/**
 * Interface for genetic trait results
 */
export interface GeneticTraitResults {
  coat: Record<string, string>;
  size: Record<string, string>;
  performance: Record<string, string>;
  behavior: Record<string, string>;
}
