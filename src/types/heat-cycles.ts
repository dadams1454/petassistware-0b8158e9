
// Heat intensity definitions
export type HeatIntensityType = 'none' | 'light' | 'moderate' | 'heavy' | 'mild' | 'strong' | 'very_strong';

export const HeatIntensity = {
  NONE: 'none',
  LIGHT: 'light',
  MODERATE: 'moderate',
  HEAVY: 'heavy',
  MILD: 'mild',
  STRONG: 'strong',
  VERY_STRONG: 'very_strong'
} as const;

export const HeatIntensityValues: HeatIntensityType[] = [
  HeatIntensity.NONE,
  HeatIntensity.LIGHT,
  HeatIntensity.MODERATE,
  HeatIntensity.HEAVY,
  HeatIntensity.MILD,
  HeatIntensity.STRONG, 
  HeatIntensity.VERY_STRONG
];

export function mapHeatIntensityToType(value: string): HeatIntensityType {
  const normalized = value.toLowerCase();
  if (HeatIntensityValues.includes(normalized as HeatIntensityType)) {
    return normalized as HeatIntensityType;
  }
  return HeatIntensity.NONE;
}

export function stringToHeatIntensityType(value: string): HeatIntensityType {
  const normalized = value.toLowerCase();
  if (HeatIntensityValues.includes(normalized as HeatIntensityType)) {
    return normalized as HeatIntensityType;
  }
  return HeatIntensity.NONE;
}

export function mapHeatIntensityTypeToDisplay(type: HeatIntensityType): string {
  switch (type) {
    case HeatIntensity.NONE:
      return 'None';
    case HeatIntensity.LIGHT:
      return 'Light';
    case HeatIntensity.MODERATE:
      return 'Moderate';
    case HeatIntensity.HEAVY:
      return 'Heavy';
    case HeatIntensity.MILD:
      return 'Mild';
    case HeatIntensity.STRONG:
      return 'Strong';
    case HeatIntensity.VERY_STRONG:
      return 'Very Strong';
    default:
      return 'Unknown';
  }
}

// Heat cycle and stage definitions
export interface HeatCycle {
  id: string;
  dog_id: string;
  cycle_number: number;
  start_date: string;
  end_date?: string;
  cycle_length?: number;
  intensity: HeatIntensityType;
  symptoms: string[];
  fertility_indicators?: Record<string, any> | any; // Making this more flexible
  notes?: string;
  recorded_by?: string;
  created_at: string;
  updated_at?: string;
}

export interface HeatStage {
  id: string;
  heat_cycle_id: string;
  stage_name: 'proestrus' | 'estrus' | 'diestrus' | 'anestrus';
  start_date: string;
  end_date?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}
