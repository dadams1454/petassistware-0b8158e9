
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
  healthMarkers: Record<string, HealthMarker>;
  updated_at: string;
  // Additional fields that may be present
  name?: string;
  breed?: string;
  colorProbabilities?: ColorProbability[];
}

/**
 * Interface for health marker in genetic testing
 */
export interface HealthMarker {
  status: string; // 'clear', 'carrier', 'at_risk', 'affected', 'unknown'
  testDate?: string;
  notes?: string;
  certified?: boolean;
  name?: string; // Name of the health marker
}

/**
 * Interface for compact genotype view props
 */
export interface CompactGenotypeViewProps {
  genotype: DogGenotype;
  showBreed?: boolean;
  showColorTraits?: boolean;
  showHealthTests?: boolean;
  showTitle?: boolean;
  showHealth?: boolean;
  showColor?: boolean;
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

/**
 * Interface for genetic import result
 */
export interface GeneticImportResult {
  success: boolean;
  dogId?: string;
  genotypeId?: string;
  message: string;
  errors?: string[];
}

/**
 * Interface for test result
 */
export interface TestResult {
  name: string;
  result: string;
  date: string;
}

/**
 * Interface for genetic health status
 */
export interface GeneticHealthStatus {
  clear: string[];
  carrier: string[];
  atRisk: string[];
  affected: string[];
  unknown: string[];
}

/**
 * Interface for health risk
 */
export interface HealthRisk {
  status: string;
  probability: number;
}

/**
 * Interface for health warning
 */
export interface HealthWarning {
  condition: string;
  status: string;
  description: string;
  recommendation: string;
  severity: 'low' | 'medium' | 'high';
}

/**
 * Interface for genetic pairing result
 */
export interface GeneticPairingResult {
  inbreedingCoefficient: number;
  colorProbabilities: ColorProbability[];
  healthRisks: Record<string, HealthRisk>;
  traits: GeneticTraitResults;
}

/**
 * Interface for historical COI chart props
 */
export interface HistoricalCOIChartProps {
  data: {
    generation: number;
    coi: number;
  }[];
}
