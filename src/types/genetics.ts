
// Dog Genotype Types
export interface DogGenotype {
  dog_id: string;
  name?: string;
  breed?: string;
  baseColor: string;
  brownDilution: string;
  dilution: string;
  agouti?: string;
  healthMarkers?: Record<string, HealthMarker>;
  healthResults?: HealthResult[];
  colorProbabilities?: ColorProbability[];
}

export interface HealthMarker {
  name?: string;
  status: GeneticHealthStatus;
  testDate?: string;
  lab?: string;
  probability?: number;
}

export interface HealthResult {
  condition: string;
  result: string;
  tested_date: string;
  lab: string;
  notes?: string;
}

export type GeneticHealthStatus = 'clear' | 'carrier' | 'at_risk' | 'affected' | 'at risk' | 'unknown';

export interface ColorProbability {
  color: string;
  probability: number;
  hex?: string;
}

// Import Result Types
export interface GeneticImportResult {
  success: boolean;
  dogId: string;
  provider?: string;
  testsImported: number;
  errors?: string[];
}

// Health Risk Types
export interface HealthRisk {
  condition: string;
  status: GeneticHealthStatus;
  probability: number;
  severity: 'high' | 'medium' | 'low';
}

export interface HealthWarning {
  condition: string;
  message: string;
  actionRequired: boolean;
  severity: 'high' | 'medium' | 'low';
}

export interface HealthSummary {
  atRiskCount: number;
  carrierCount: number;
  clearCount: number;
  unknownCount: number;
  totalTests: number;
}

// Component Props Types
export interface CompactGenotypeViewProps {
  genotype: DogGenotype;
  title?: string;
  showBreed?: boolean;
  showColorTraits?: boolean;
  showHealthTests?: boolean;
  showTitle?: boolean;
  showHealth?: boolean;
  showColor?: boolean;
}

export interface HistoricalCOIChartProps {
  dogId: string;
  generations?: number[];
}
