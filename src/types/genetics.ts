
// Define type for genetic health marker
export interface GeneticHealthMarker {
  status: 'clear' | 'carrier' | 'affected';
  genotype: string;
  testDate?: string;
  labName?: string;
  certificateUrl?: string;
}

// Define type for dog genetic data
export interface DogGenotype {
  // Basic info
  dogId: string;
  updatedAt: string;
  
  // Color genes
  baseColor: string; // E/e (black/red)
  brownDilution: string; // B/b (brown dilution)
  dilution: string; // D/d (dilution)
  agouti: string; // A/a (agouti)
  patterns: string[]; // Special patterns (landseer, etc)
  
  // Health markers
  healthMarkers: {
    [key: string]: GeneticHealthMarker;
  };
  
  // Test metadata
  testResults: {
    testId: string;
    testType: string;
    testDate: string;
    result: string;
    labName: string;
    certificateUrl?: string;
  }[];
}

export interface HealthWarning {
  condition: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedPercentage?: number;
}

export interface ColorProbability {
  name: string;
  probability: number;
  color: string;
}

export interface PairingAnalysis {
  coi: number; // Coefficient of Inbreeding
  healthWarnings: HealthWarning[];
  compatibleTests: string[];
  incompatibleTests: string[];
  traitPredictions: {
    color: Record<string, number>; // Color name -> percentage
    size: {
      males: string;
      females: string;
    };
    coat: string;
  };
  commonAncestors?: {
    dogId: string;
    name: string;
    relationship: string;
  }[];
}
