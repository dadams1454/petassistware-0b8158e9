
export type GeneticHealthStatus = 'clear' | 'carrier' | 'affected' | 'unknown';

export interface HealthMarker {
  status: GeneticHealthStatus;
  testDate?: string;
  labName?: string;
  resultDetails?: string;
}

export interface DogGenotype {
  baseColor: string;
  brownDilution: string;
  dilution: string;
  healthMarkers: Record<string, HealthMarker>;
  testResults: Array<{
    testType: string;
    testDate: string;
    result: string;
    labName: string;
  }>;
}

export interface GeneticImportResult {
  success: boolean;
  provider: string;
  testsImported: number;
  errors?: string[];
}

export interface GeneticReportGeneratorProps {
  dogId: string;
  dogName?: string;
  dogGenetics?: DogGenotype;
}

export interface HistoricalCOIChartProps {
  dogId: string;
}
