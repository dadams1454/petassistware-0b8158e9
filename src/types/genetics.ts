
// Define the base types for genetics
export interface DogGenotype {
  id?: string;
  dog_id?: string;
  dogId?: string; // Alias for compatability
  created_at?: string;
  updated_at?: string;
  breed?: string;
  // Health markers data
  healthMarkers?: Record<string, {
    status: string;
    testDate?: string;
    source?: string;
  }>;
  // Trait data
  traits?: Record<string, {
    value: string;
    description?: string;
  }>;
  // Physical characteristics
  colorGenetics?: {
    base_color?: string;
    brown_dilution?: string;
    dilution?: string;
    patterns?: string[];
  };
  // Direct color properties for backward compatibility
  baseColor?: string;
  brownDilution?: string;
  dilution?: string;
  agouti?: string;
  // Breed composition
  breedComposition?: Record<string, number>;
  // Additional fields
  healthResults?: any[];
}

export interface GeneticImportResult {
  success: boolean;
  dogId: string;
  dog_id?: string; // For backward compatibility
  importedTests: any[];
  provider: string;
  testsImported: number;
  count: number;
  errors: string[];
}

export interface TestResult {
  id?: string;
  dog_id: string;
  test_type: string;
  result: string;
  test_date: string;
  lab_name: string;
  certificate_url?: string;
}

export interface ManualTestEntry {
  test_type: string;
  result: string;
  test_date?: string;
  date?: string; // For compatibility
  lab_name?: string;
  certificate_url?: string;
  provider?: string;
  dog_id?: string;
  notes?: string;
  name?: string; // For form compatibility
  importSource?: string;
}

// Interface for health warnings from genetic testing
export interface HealthWarning {
  condition: string;
  risk: string;
  description: string;
  action: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  affectedPercentage?: number;
}

// Interface for color probabilities
export interface ColorProbability {
  color: string;
  probability: number;
  colorCode?: string;
}

// Interface for health marker status
export type GeneticHealthStatus = 'clear' | 'carrier' | 'affected' | 'unknown';

// Interface for health marker
export interface HealthMarker {
  status: GeneticHealthStatus;
  testDate?: string;
  source?: string;
}

// Interface for compact genotype view props
export interface CompactGenotypeViewProps {
  genotype: DogGenotype;
  showBreed?: boolean;
  showColorTraits?: boolean;
  showHealthTests?: boolean;
}

// Interface for historical COI chart props
export interface HistoricalCOIChartProps {
  dogId: string;
  generations?: number;
}

// Interface for multi-trait matrix props
export interface MultiTraitMatrixProps {
  dogId: string;
  dogGenetics?: DogGenotype;
}

// Add any other genetic-related types here
