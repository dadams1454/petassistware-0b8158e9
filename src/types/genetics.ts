
// Types for genetics-related data

export interface DogGenotype {
  id?: string;
  dog_id: string;
  created_at?: string;
  updated_at?: string;
  breed?: string;
  baseColor?: string;
  brownDilution?: string;
  dilution?: string;
  name?: string;
  healthMarkers?: Record<string, HealthMarker>;
  inbreedingCoefficient?: number;
  geneticDiversity?: number;
  traits?: Record<string, string>;
  colorProbabilities?: ColorProbability[];
  colorGenetics?: any;
  agouti?: string;
}

export interface HealthMarker {
  status: GeneticHealthStatus;
  testDate?: string;
  lab?: string;
  certificateUrl?: string;
  notes?: string;
  source?: string;
}

export type GeneticHealthStatus = 'clear' | 'carrier' | 'at_risk' | 'at risk' | 'not tested' | 'unknown';

export interface ColorProbability {
  color: string;
  probability: number;
  genotype?: string;
  hex?: string;
}

export interface HealthSummary {
  clearCount: number;
  carrierCount: number;
  atRiskCount: number;
  totalTests: number;
  healthScore: number;
  topRisks: HealthRisk[];
}

export interface HealthRisk {
  condition: string;
  status: GeneticHealthStatus;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface HealthWarning {
  condition: string;
  status: GeneticHealthStatus;
  severity: 'low' | 'medium' | 'high';
  testDate?: string;
  notes?: string;
  risk?: string;
  description?: string;
  affectedPercentage?: number;
  riskLevel?: string;
}

export interface GeneticImportResult {
  success: boolean;
  dogId: string;
  importedTests: any[];
  provider: string;
  testsImported: number;
  count: number;
  errors: string[];
}

export interface CompactGenotypeViewProps {
  genotype: DogGenotype;
  showHealth?: boolean;
  showColor?: boolean;
  showTitle?: boolean;
  showBreed?: boolean;
  showColorTraits?: boolean;
  showHealthTests?: boolean;
}

export interface ManualTestEntry {
  name: string;
  provider: string;
  date: string;
  result: GeneticHealthStatus;
  condition: string;
  notes?: string;
  test_type?: string;
  test_date?: string;
}

export interface ColorMatrixProps {
  sire: DogGenotype;
  dam: DogGenotype;
}

export interface TestResult {
  condition: string;
  result: GeneticHealthStatus;
  date?: string;
}

export interface HistoricalCOIChartProps {
  data: {
    generation: number;
    coi: number;
  }[];
}
