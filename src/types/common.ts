
// Common type definitions for the application
export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg';

// Helper types for genetic data
export interface BreedComposition {
  primary?: string;
  secondary?: string;
  mixed?: boolean;
  breeds?: Array<{breed: string, percentage: number}>;
}

export interface ColorGenetics {
  base?: string;
  dilution?: string;
  brown_dilution?: string;
  agouti?: string;
  mask?: string;
  pattern?: string;
}

export interface GeneticTraitResults {
  color?: ColorGenetics;
  size?: {
    expected_weight?: number;
    height_category?: string;
  };
  coat?: {
    type?: string;
    length?: string;
    shedding?: string;
  };
}
