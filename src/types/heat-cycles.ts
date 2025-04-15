
/**
 * Heat cycle related types
 */

/**
 * Heat intensity type - string literal
 */
export type HeatIntensityType = 'none' | 'mild' | 'moderate' | 'strong' | 'very_strong';

/**
 * Heat intensity enum for easy reference
 */
export enum HeatIntensity {
  NONE = 'none',
  MILD = 'mild',
  MODERATE = 'moderate',
  STRONG = 'strong',
  VERY_STRONG = 'very_strong'
}

/**
 * Heat intensity values array
 */
export const HeatIntensityValues: HeatIntensityType[] = [
  'none',
  'mild',
  'moderate',
  'strong',
  'very_strong'
];

/**
 * Heat stage type
 */
export interface HeatStage {
  id: string;
  name: string;
  description: string;
  duration: {
    min: number;
    max: number;
    unit: string;
  };
  signs: string[];
  color: string;
}

/**
 * Heat cycle record
 */
export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string;
  cycle_number: number;
  cycle_length?: number;
  intensity: HeatIntensityType;
  notes?: string;
  symptoms?: string[];
  fertility_indicators?: any;
  recorded_by?: string;
  created_at: string;
  updated_at?: string;
}

/**
 * Map string to heat intensity type
 */
export function stringToHeatIntensityType(value: string): HeatIntensityType {
  const normalized = value.toLowerCase().trim();
  
  if (HeatIntensityValues.includes(normalized as HeatIntensityType)) {
    return normalized as HeatIntensityType;
  }
  
  if (normalized === 'high' || normalized === 'heavy' || normalized === 'very_strong') {
    return 'strong';
  }
  
  if (normalized === 'medium') {
    return 'moderate';
  }
  
  if (normalized === 'low' || normalized === 'light') {
    return 'mild';
  }
  
  return 'none';
}

/**
 * Map heat intensity to type
 */
export function mapHeatIntensityToType(intensity: string | null | undefined): HeatIntensityType {
  if (!intensity) return 'none';
  return stringToHeatIntensityType(intensity);
}

/**
 * Map heat intensity type to display name
 */
export function mapHeatIntensityTypeToDisplay(type: HeatIntensityType): string {
  const displayMap: Record<HeatIntensityType, string> = {
    'none': 'None',
    'mild': 'Mild',
    'moderate': 'Moderate',
    'strong': 'Strong',
    'very_strong': 'Very Strong'
  };
  
  return displayMap[type] || 'Unknown';
}
