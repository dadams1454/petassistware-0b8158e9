
export interface DogGenotype {
  id: string;
  name: string;
  color: {
    genotype: string;
    phenotype: string;
  };
  healthMarkers: Record<string, unknown>;
  healthResults: Array<GeneticTestResult>;
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
