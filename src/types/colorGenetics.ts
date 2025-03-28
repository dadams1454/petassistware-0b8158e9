
export interface BreedColor {
  id: string;
  breed: string;
  color_name: string;
  is_akc_recognized: boolean;
  color_code: string | null;
  created_at: string;
}

export interface ColorGenetics {
  id: string;
  breed: string;
  color_name: string;
  genotype: string;
  is_dominant: boolean;
  inheritance_pattern: string;
  created_at: string;
}

export interface ColorInheritanceRule {
  id: string;
  breed: string;
  parent1_genotype: string;
  parent2_genotype: string;
  offspring_genotype: string;
  probability: number;
  created_at: string;
}

export interface PuppyColorPrediction {
  color_name: string;
  probability: number;
  is_akc_recognized: boolean;
}
