// Dog Genotype Types
export interface DogGenotype {
  dog_id: string;
  id?: string; // Adding id field
  name?: string;
  breed?: string;
  baseColor: string;
  brownDilution: string;
  dilution: string;
  agouti?: string;
  healthMarkers?: Record<string, HealthMarker>;
  healthResults?: HealthResult[];
  colorProbabilities?: ColorProbability[];
  colorGenetics?: any; // Adding colorGenetics field
  traits?: any; // Adding traits field
  updated_at?: string; // Adding updated_at field
}

export interface HealthMarker {
  name?: string;
  status: GeneticHealthStatus;
  testDate?: string;
  lab?: string;
  probability?: number;
  source?: string; // Adding source field
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
  importedTests?: number; // Adding importedTests field for compatibility
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
  // Make these optional but keep them for backward compatibility
  message?: string;
  actionRequired?: boolean;
  // Add new fields that are being used in components
  title?: string;
  description?: string;
  action?: string;
  severity: 'high' | 'medium' | 'low' | 'critical'; // Adding 'critical' severity
  riskLevel?: string;
  affectedPercentage?: number;
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

// Adding TestResult for useGeneticDataImport
export interface TestResult {
  id: string;
  name: string;
  result: string;
  date: string;
}
