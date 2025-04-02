
export interface DogGenotype {
  id?: string;
  dog_id: string;
  created_at?: string;
  updated_at?: string;
  breed?: string;
  name?: string;
  baseColor: string;
  brownDilution: string;
  dilution: string;
  colorGenetics?: any;
  traits?: any;
  healthMarkers: Record<string, HealthMarker>;
  healthResults?: HealthResult[];
  breedComposition?: any;
  colorProbabilities?: ColorProbability[];
  agouti?: string;
}

export interface HealthMarker {
  id?: string;
  name: string;
  status: GeneticHealthStatus;
  description?: string;
  inheritance?: string;
  primary?: boolean;
  testDate?: string;
  condition?: string;
}

export interface HealthResult {
  condition: string;
  status: GeneticHealthStatus;
  date?: string;
  provider?: string;
}

export interface HealthWarning {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  test?: string;
  action?: string;
  condition: string;
  risk?: string;
  riskLevel: string;
  affectedPercentage?: number;
}

export interface ColorProbability {
  color: string;
  probability: number;
  genotype?: string;
  hex?: string;
}

export type GeneticHealthStatus = 'clear' | 'carrier' | 'at_risk' | 'affected' | 'unknown';

export interface ManualTestEntry {
  test_type: string;
  name: string;
  result: GeneticHealthStatus;
  test_date: string;
  date: string;
  provider: string;
  condition: string;
}

export interface TestResult {
  test_type: string;
  result: GeneticHealthStatus;
  test_date: string;
  provider: string;
  name?: string;
  condition?: string;
  date?: string;
  testId?: string;
}

export interface GeneticImportResult {
  dogId: string;
  importedTests: TestResult[];
  count: number;
  success: boolean;
  errors?: string[];
  provider: string;
  testsImported: number;
}

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
  generations: number[];
}

export interface HealthRisk {
  status: GeneticHealthStatus;
  probability: number;
}

export interface HealthSummary {
  atRiskCount: number;
  carrierCount: number;
  clearCount: number;
  unknownCount: number;
}
