
export interface DogGenotype {
  dogId: string;
  baseColor?: string;
  brownDilution?: string;
  dilution?: string;
  healthMarkers?: Record<string, HealthMarker>;
  healthResults: any[];
  breed?: string;
  updated_at?: string;
  agouti?: string;
}

// Add missing interfaces for the Genetics components
export interface CompactGenotypeViewProps {
  genotype: DogGenotype;
  showBreed?: boolean;
  dogData?: DogGenotype;
  showColorTraits?: boolean;
  showHealthTests?: boolean;
}

export interface GeneticHealthStatus {
  status: 'clear' | 'carrier' | 'at_risk' | 'unknown';
  condition: string;
  description?: string;
  severity?: 'low' | 'medium' | 'high';
}

export interface HealthWarning {
  condition: string;
  risk: string;
  description: string;
  action: string;
  riskLevel?: string;
  affectedPercentage?: number;
}

export interface TestResult {
  id: string;
  name: string;
  result: string;
  date: string;
  provider: string;
}

export interface GeneticImportResult {
  success: boolean;
  dogId: string;
  importedTests: TestResult[];
  errors?: string[];
  provider?: string;
  testsImported?: number;
}

export interface ColorProbability {
  color: string;
  probability: number;
  hex: string;
  percentage?: number;
  name?: string;
  value?: number;
}

export interface HealthMarker {
  name: string;
  result: string;
  status: 'clear' | 'carrier' | 'at_risk' | 'unknown';
  testDate?: string;
}

export interface HistoricalCOIChartProps {
  dogId: string;
  generations?: number[];
}

export interface MultiTraitMatrixProps {
  sireDogId?: string;
  damDogId?: string;
  dogId?: string;
  dogGenetics?: DogGenotype;
}

export interface ManualTestEntry {
  id?: string;
  result?: string;
  name?: string;
  date?: string;
  testType?: string;
  testDate?: string;
  labName?: string;
  importSource?: string;
}

// Add any other necessary genetics types
export interface BreedHealthConcern {
  breed: string;
  condition: string;
  risk_level: string;
  description?: string;
}
