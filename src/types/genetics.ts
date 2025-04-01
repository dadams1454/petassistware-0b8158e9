
export interface DogGenotype {
  dogId: string;
  baseColor?: string;
  brownDilution?: string;
  dilution?: string;
  healthMarkers?: Record<string, unknown>;
  healthResults: any[];
  breed?: string;
  updated_at?: string; // Added to fix useDogGenetics
}

// Add any other necessary genetics types
export interface BreedHealthConcern {
  breed: string;
  condition: string;
  risk_level: string;
  description?: string; // Added to fix useDogGenetics error
}
