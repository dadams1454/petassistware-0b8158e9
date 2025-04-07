
/**
 * Heat intensity types
 */
export enum HeatIntensityType {
  NONE = "none",
  MILD = "mild",
  MODERATE = "moderate",
  STRONG = "strong",
  VERY_STRONG = "very_strong"
}

/**
 * Heat intensity enum
 */
export enum HeatIntensity {
  NONE = "None",
  MILD = "Mild",
  MODERATE = "Moderate",
  STRONG = "Strong",
  VERY_STRONG = "Very Strong"
}

/**
 * Convert HeatIntensity to HeatIntensityType
 */
export const mapHeatIntensityToType = (intensity: HeatIntensity): HeatIntensityType => {
  switch (intensity) {
    case HeatIntensity.NONE:
      return HeatIntensityType.NONE;
    case HeatIntensity.MILD:
      return HeatIntensityType.MILD;
    case HeatIntensity.MODERATE:
      return HeatIntensityType.MODERATE;
    case HeatIntensity.STRONG:
      return HeatIntensityType.STRONG;
    case HeatIntensity.VERY_STRONG:
      return HeatIntensityType.VERY_STRONG;
    default:
      return HeatIntensityType.NONE;
  }
};

/**
 * Convert HeatIntensityType to HeatIntensity
 */
export const mapHeatIntensityTypeToDisplay = (type: HeatIntensityType): HeatIntensity => {
  switch (type) {
    case HeatIntensityType.NONE:
      return HeatIntensity.NONE;
    case HeatIntensityType.MILD:
      return HeatIntensity.MILD;
    case HeatIntensityType.MODERATE:
      return HeatIntensity.MODERATE;
    case HeatIntensityType.STRONG:
      return HeatIntensity.STRONG;
    case HeatIntensityType.VERY_STRONG:
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
