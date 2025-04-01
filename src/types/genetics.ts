
export interface DogGenotype {
  id: string;
  name: string;
  color: {
    genotype: string;
    phenotype: string;
  };
  healthMarkers: Record<string, HealthMarker>;
  healthResults: Array<GeneticTestResult>;
  // Color traits
  baseColor: string;
  brownDilution: string;
  dilution: string;
  agouti: string;
  patterns?: string[];
  updatedAt?: string;
  testResults?: Array<TestResult>;
  // Optional field for referencing the dog
  dogId?: string; 
}

export interface HealthMarker {
  status: 'clear' | 'carrier' | 'affected' | 'unknown';
  genotype: string;
  testDate?: string;
  labName?: string;
  certificateUrl?: string;
  implications?: string;
  breedSpecificRisk?: number; // 0-100 scale for breed-specific risk
}

export interface TestResult {
  testId: string;
  testType: string;
  testDate: string;
  result: string;
  labName: string;
  certificateUrl?: string;
  verified?: boolean;
  rawData?: any;
  importSource?: 'embark' | 'wisdom_panel' | 'optimal_selection' | 'manual' | string;
}

export interface GeneticTestResult {
  condition: string;
  result: 'clear' | 'carrier' | 'affected' | 'unknown';
  date?: string;
  lab?: string;
}

export interface GeneticCompatibility {
  calculationDate: string;
  compatibility: {
    coi: number;
    healthRisks: Array<{
      condition: string;
      risk: string;
      probability: number;
    }>;
    colorProbabilities: Record<string, number>;
  };
}

export interface HealthWarning {
  condition: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  affectedPercentage?: number;
  breedSpecificPrevalence?: number;
}

// Interface definitions that were missing
export interface CompactGenotypeViewProps {
  dogData: DogGenotype | null;
  showColorTraits?: boolean;
  showHealthTests?: boolean;
}

export interface HealthMarkersPanelProps {
  dogData: DogGenotype | null;
}

export interface ColorProbability {
  name: string;
  value: number;
  color: string;
  percentage: number; // Added percentage property
}

// Define GeneticHealthStatus as a string type with allowed values
export type GeneticHealthStatus = 'clear' | 'carrier' | 'affected' | 'unknown';

export interface HistoricalCOIChartProps {
  dogId: string;
  generations?: number;
}

export interface MultiTraitMatrixProps {
  dogId: string;
  dogGenetics?: DogGenotype | null;
}

export interface GeneticReportGeneratorProps {
  dogId: string;
  dogName?: string;
  dogGenetics?: DogGenotype | null;
}

export interface PairingAnalysis {
  coi: number;
  healthWarnings: HealthWarning[];
  compatibleTests: string[];
  incompatibleTests: string[];
  traitPredictions: {
    color: Record<string, number>;
    size: { males: string; females: string };
    coat: string;
  };
}

// New interfaces for genetic data import
export interface GeneticImportConfig {
  provider: 'embark' | 'wisdom_panel' | 'optimal_selection' | 'manual' | string;
  apiKey?: string;
  importMethod: 'api' | 'file' | 'manual';
}

export interface EmbarkTestResult {
  testId: string;
  trait: string;
  result: string;
  genotype?: string;
  category: 'health' | 'color' | 'trait';
  date: string;
}

export interface GeneticImportResult {
  success: boolean;
  dogId: string;
  importDate: string;
  provider: string;
  testsImported: number;
  errors?: string[];
}

export interface GeneticBreedStatistics {
  breed: string;
  condition: string;
  prevalence: number; // Percentage
  citations?: string[];
  lastUpdated: string;
}
