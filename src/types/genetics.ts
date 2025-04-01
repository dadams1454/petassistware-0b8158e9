
export interface DogGenotype {
  id?: string;
  name?: string;
  breed?: string;
  baseColor: string;
  brownDilution: string;
  dilution: string;
  agouti?: string;
  healthMarkers: Record<string, HealthMarker>;
  healthResults?: HealthTestResult[];
  testResults?: GeneticTestResult[];
  dogId?: string;
}

export interface HealthMarker {
  status: GeneticHealthStatus;
  testDate?: string;
  genotype?: string;
  labName?: string;
}

export type GeneticHealthStatus = 'clear' | 'carrier' | 'affected' | 'unknown';

export interface HealthTestResult {
  condition: string;
  result: GeneticHealthStatus;
  testDate?: string;
  date?: string;
  labName?: string;
}

export interface ColorProbability {
  name: string;
  value: number;
  color: string;
  percentage: number;
  probability?: number;
}

export interface HealthWarning {
  condition: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedPercentage?: number;
}

export interface PairingAnalysis {
  coi: number;
  healthWarnings: HealthWarning[];
  colorProbabilities: ColorProbability[];
  compatibilityScore: number;
  compatibleTests?: boolean;
}

export interface MultiTraitMatrixProps {
  dogId: string;
  dogGenetics?: DogGenotype;
}

export interface HistoricalCOIChartProps {
  dogId: string;
}

export interface GeneticTestResult {
  testType: string;
  testDate: string;
  result: string;
  labName: string;
  testId?: string;
}

export interface TestResult {
  id?: string;
  testType: string;
  result: string;
  testDate: string;
  labName?: string;
  importSource?: string;
  testId?: string;
}

export interface CompactGenotypeViewProps {
  dogData: DogGenotype;
  showColorTraits?: boolean;
  showHealthTests?: boolean;
}

export interface GeneticImportResult {
  success: boolean;
  provider: string;
  testsImported: number;
  count?: number;
  errors?: string[];
}

export interface GeneticReportGeneratorProps {
  dogId: string;
  dogData?: DogGenotype;
}
