
/**
 * Heat intensity types
 */
export type HeatIntensityType = 'none' | 'mild' | 'moderate' | 'strong' | 'very_strong';

/**
 * Heat intensity enum for display purposes
 */
export enum HeatIntensity {
  NONE = "None",
  MILD = "Mild",
  MODERATE = "Moderate",
  STRONG = "Strong",
  VERY_STRONG = "Very Strong"
}

/**
 * Heat intensity values for form options
 */
export const HeatIntensityValues: readonly HeatIntensityType[] = ['none', 'mild', 'moderate', 'strong', 'very_strong'] as const;

/**
 * Convert HeatIntensity to HeatIntensityType
 */
export const mapHeatIntensityToType = (intensity: HeatIntensity): HeatIntensityType => {
  switch (intensity) {
    case HeatIntensity.NONE:
      return 'none';
    case HeatIntensity.MILD:
      return 'mild';
    case HeatIntensity.MODERATE:
      return 'moderate';
    case HeatIntensity.STRONG:
      return 'strong';
    case HeatIntensity.VERY_STRONG:
      return 'very_strong';
    default:
      return 'none';
  }
};

/**
 * Convert HeatIntensityType to HeatIntensity
 */
export const mapHeatIntensityTypeToDisplay = (type: HeatIntensityType): HeatIntensity => {
  switch (type) {
    case 'none':
      return HeatIntensity.NONE;
    case 'mild':
      return HeatIntensity.MILD;
    case 'moderate':
      return HeatIntensity.MODERATE;
    case 'strong':
      return HeatIntensity.STRONG;
    case 'very_strong':
      return HeatIntensity.VERY_STRONG;
    default:
      return HeatIntensity.NONE;
  }
};

/**
 * Heat cycle interface
 */
export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string;
  intensity: HeatIntensityType;
  symptoms?: string[];
  notes?: string;
  cycle_number?: number;
  cycle_length?: number;
  fertility_indicators?: any;
  created_at: string;
  updated_at?: string;
  recorded_by?: string;
}

/**
 * Heat stage interface
 */
export interface HeatStage {
  name: string;
  description: string;
  days: number[];
  signs: string[];
  recommendations: string[];
}
