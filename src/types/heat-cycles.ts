
/**
 * Heat cycle related types
 */
import { Json } from '../integrations/supabase/types';
import { HeatIntensityType, HeatIntensity } from './health-enums';

// Re-export heat intensity types
export { HeatIntensityType, HeatIntensity };

// Heat intensity values array - for dropdowns and selects
export const HeatIntensityValues: HeatIntensityType[] = [
  'light', 
  'moderate', 
  'heavy', 
  'mild', 
  'medium', 
  'low', 
  'high', 
  'peak', 
  'strong', 
  'unknown'
];

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
}
