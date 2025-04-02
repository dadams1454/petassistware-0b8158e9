
// Define the base types for genetics
export interface DogGenotype {
  id?: string;
  dog_id?: string;
  created_at?: string;
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
  // Breed composition
  breedComposition?: Record<string, number>;
}

export interface GeneticImportResult {
  success: boolean;
  dogId: string;
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
  test_date: string;
  lab_name: string;
  certificate_url?: string;
  provider?: string;
  dog_id?: string;
  notes?: string;
}

// Add any other genetic-related types here
