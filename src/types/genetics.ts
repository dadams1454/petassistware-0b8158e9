
export type GeneticHealthStatus = 'clear' | 'carrier' | 'affected' | 'unknown';

export interface GeneticHealthMarker {
  status: GeneticHealthStatus;
  genotype: string;
  testDate?: string;
  labName?: string;
  certificateUrl?: string;
}

export interface GeneticTest {
  testId: string;
  testType: string;
  testDate: string;
  result: string;
  labName: string;
  certificateUrl?: string;
  verified?: boolean;
}

export interface DogGenotype {
  dogId: string;
  updatedAt: string;
  baseColor: string;
  brownDilution: string;
  dilution: string;
  agouti: string;
  patterns: string[];
  healthMarkers: Record<string, GeneticHealthMarker>;
  testResults: GeneticTest[];
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

export interface MultiTraitMatrixProps {
  dogId: string;
  dogData?: DogGenotype;
  dogGenetics?: DogGenotype;
}

export interface HealthMarkersPanelProps {
  dogData?: DogGenotype;
  geneticData?: DogGenotype;
}

export interface CompactGenotypeViewProps {
  dogData?: DogGenotype;
  geneticData?: DogGenotype;
  showColorTraits?: boolean;
  showHealthTests?: boolean;
}

export interface GeneticReportGeneratorProps {
  dogId: string;
  dogName?: string;
  dogGenetics?: DogGenotype;
}

export interface InteractivePedigreeProps {
  dogId: string;
  currentDog?: any;
  generations?: number;
}

export interface HistoricalCOIChartProps {
  dogId: string;
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
  compatibleTests: string[];
  incompatibleTests: string[];
  traitPredictions?: any;
}

export interface ColorProbability {
  color: string;
  percentage: number;
}
