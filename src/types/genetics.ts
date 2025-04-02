
export interface DogGenotype {
  id?: string;
  dog_id: string;
  created_at?: string;
  updated_at?: string;
  breed?: string;
  baseColor?: string;
  brownDilution?: string;
  dilution?: string;
  healthMarkers?: Record<string, HealthMarker>;
  healthResults?: HealthResult[];
  breedComposition?: any;
}

export interface HealthMarker {
  id: string;
  name: string;
  status: GeneticHealthStatus;
  description?: string;
  inheritance?: string;
  primary?: boolean;
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
}

export interface ColorProbability {
  color: string;
  probability: number;
  genotype?: string;
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

export interface GeneticImportResult {
  dogId: string;
  importedTests: number;
  count: number;
}

export interface CompactGenotypeViewProps {
  genotype: DogGenotype;
  title?: string;
  showBreed?: boolean;
}
