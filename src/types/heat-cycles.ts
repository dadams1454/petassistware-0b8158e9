
// Heat intensity definitions
export type HeatIntensityType = 'none' | 'light' | 'moderate' | 'heavy';

export const HeatIntensity = {
  NONE: 'none',
  LIGHT: 'light',
  MODERATE: 'moderate',
  HEAVY: 'heavy'
} as const;

export const HeatIntensityValues: HeatIntensityType[] = [
  HeatIntensity.NONE,
  HeatIntensity.LIGHT,
  HeatIntensity.MODERATE,
  HeatIntensity.HEAVY
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
    default:
      return 'Unknown';
  }
}

// Heat cycle and stage definitions
export interface HeatCycle {
  id: string;
  dog_id: string;
  cycle_number: number;
  start_date: string | Date;
  end_date?: string | Date;
  cycle_length?: number;
  intensity: HeatIntensityType;
  symptoms: string[];
  fertility_indicators?: Record<string, any>;
  notes?: string;
  recorded_by?: string;
  created_at: string | Date;
  updated_at?: string | Date;
}

export interface HeatStage {
  id: string;
  heat_cycle_id: string;
  stage_name: 'proestrus' | 'estrus' | 'diestrus' | 'anestrus';
  start_date: string | Date;
  end_date?: string | Date;
  notes?: string;
  created_at: string | Date;
  updated_at?: string | Date;
}
