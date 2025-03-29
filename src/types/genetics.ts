
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
}

export interface HealthMarkersPanelProps {
  dogData?: DogGenotype;
}

export interface CompactGenotypeViewProps {
  dogData?: DogGenotype;
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
