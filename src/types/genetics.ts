
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
  name?: string; // Added name property
}

// Add missing interfaces for the Genetics components
export interface CompactGenotypeViewProps {
  genotype: DogGenotype;
  showBreed?: boolean;
  dogData?: DogGenotype;
  showColorTraits?: boolean;
  showHealthTests?: boolean;
}

export type GeneticHealthStatus = 'clear' | 'carrier' | 'at_risk' | 'affected' | 'unknown';

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
  testType?: string;
}

export interface GeneticImportResult {
  success: boolean;
  dogId: string;
  importedTests: TestResult[];
  errors?: string[];
  provider?: string;
  testsImported?: number;
  count?: number;
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
  status: 'clear' | 'carrier' | 'at_risk' | 'affected' | 'unknown';
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
  provider?: string; // Added missing property
}

// Add any other necessary genetics types
export interface BreedHealthConcern {
  breed: string;
  condition: string;
  risk_level: string;
  description?: string;
}

export interface WeightData {
  weight: number;
  age: number;
  date: string;
  weight_unit?: string;
  unit?: string;
  id?: string;
  dog_id?: string; // Added to match database schema
}

export interface PuppyMilestone {
  id?: string;
  puppy_id: string;
  milestone_type: string;
  completed: boolean;
  completion_date?: string;
  milestone_date?: string;
  notes?: string;
  created_at?: string;
  category?: string;
  title?: string;
  description?: string;
  expected_age_days?: number;
}

export interface SocializationCategory {
  id: string;
  name: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
  age_range: { min: number; max: number };
  color?: string;
  examples?: string[];
}

export interface SocializationProgress {
  category: string;
  categoryId?: string;
  categoryName?: string;
  completed: number;
  total: number;
  completionPercentage: number;
  target: number;
  count?: number;
}

export interface SocializationReaction {
  id?: string;
  name?: string;
  color?: string;
  description?: string;
}

export type SocializationReactionType = string | SocializationReaction;

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category: string;
  category_id?: string;
  experience: string;
  reaction: string;
  experience_date: string;
  notes?: string;
  created_at: string;
}

export interface VaccinationScheduleItem {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccination_date?: string;
  due_date: string;
  completed?: boolean;
  is_completed?: boolean;
  notes?: string;
  created_at: string;
}

export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccination_date: string;
  due_date: string; // Changed from optional to required to match VaccinationScheduleItem
  is_completed?: boolean;
  completed?: boolean;
  notes?: string;
  administered_by?: string;
  lot_number?: string;
  created_at?: string;
}

export type WeightUnit = 'lbs' | 'kg' | 'g' | 'oz' | string;
