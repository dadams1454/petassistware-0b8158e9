
/**
 * Heat cycle related types
 */
import { Json } from '../integrations/supabase/types';

// Define the HeatIntensityType as a union type
export type HeatIntensityType = 
  | 'none'
  | 'light' 
  | 'moderate' 
  | 'heavy' 
  | 'mild' 
  | 'medium' 
  | 'low' 
  | 'high' 
  | 'peak' 
  | 'strong' 
  | 'very_strong'
  | 'unknown';

// Heat intensity enum - kept for backward compatibility
export enum HeatIntensity {
  NONE = 'none',
  LIGHT = 'light',
  MODERATE = 'moderate',
  STRONG = 'strong',
  VERY_STRONG = 'very_strong',
  MILD = 'mild',     // Added for backward compatibility
  MEDIUM = 'medium', // Added for backward compatibility
  LOW = 'low',       // Added for backward compatibility
  HIGH = 'high',     // Added for backward compatibility
  PEAK = 'peak',     // Added for backward compatibility
  HEAVY = 'heavy',   // Added for backward compatibility
  UNKNOWN = 'unknown' // Added for backward compatibility
}

// Heat intensity values array - for dropdowns and selects
export const HeatIntensityValues: HeatIntensityType[] = [
  'none',
  'light', 
  'moderate', 
  'heavy', 
  'mild', 
  'medium', 
  'low', 
  'high', 
  'peak', 
  'strong',
  'very_strong',
  'unknown'
];

// Function to normalize heat intensity values
export function normalizeHeatIntensity(intensity: string | HeatIntensityType): HeatIntensityType {
  if (!intensity) return 'unknown';
  
  const intensityLower = intensity.toLowerCase() as HeatIntensityType;
  if (HeatIntensityValues.includes(intensityLower)) {
    return intensityLower;
  }
  
  return 'unknown';
}

// Heat cycle interface
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
  fertility_indicators?: Json;
  created_at: string;
  updated_at?: string;
  recorded_by?: string;
}

// Heat stage interface
export interface HeatStage {
  id: string;
  name: string;
  description: string;
  day: number;
  fertility: string;
  fertilityLevel: number;
  color: string;
  length: number;
  startDay?: number; // For compatibility
  endDay?: number; // For compatibility
  displayName?: string; // For compatibility
  minDays?: number; // For compatibility
  maxDays?: number; // For compatibility
  unit?: string; // For compatibility
  minAge?: number; // For compatibility
  maxAge?: number; // For compatibility
}
