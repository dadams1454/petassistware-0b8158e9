
export interface DogGenotype {
  id: string;
  name: string;
  color: {
    genotype: string;
    phenotype: string;
  };
  healthMarkers: Record<string, HealthMarker>;
  healthResults: Array<GeneticTestResult>;
  // Added properties that were missing and causing type errors
  baseColor: string;
  brownDilution: string;
  dilution: string;
  agouti: string;
  patterns?: string[];
  updatedAt?: string;
  testResults?: Array<TestResult>;
}

export interface HealthMarker {
  status: 'clear' | 'carrier' | 'affected' | 'unknown';
  genotype: string;
  testDate?: string;
  labName?: string;
  certificateUrl?: string;
}

export interface TestResult {
  testId: string;
  testType: string;
  testDate: string;
  result: string;
  labName: string;
  certificateUrl?: string;
  verified?: boolean;
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
}

// Add missing interfaces
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
}

export interface GeneticHealthStatus {
  condition: string;
  status: 'clear' | 'carrier' | 'affected' | 'unknown';
  riskLevel?: 'high' | 'medium' | 'low';
  description?: string;
}

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
