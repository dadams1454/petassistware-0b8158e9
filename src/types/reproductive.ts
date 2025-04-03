
// Heat cycle intensity levels
export enum HeatIntensity {
  Mild = 'mild',
  Moderate = 'moderate',
  Strong = 'strong',
  Unknown = 'unknown'
}

// Heat cycle interface aligned with Supabase schema
export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string | null;
  cycle_number?: number;
  cycle_length?: number;
  intensity: HeatIntensity;
  symptoms?: string[];
  fertility_indicators?: any;
  notes?: string;
  recorded_by?: string;
  created_at?: string;
  updated_at?: string;
}

// Reproductive status types
export enum ReproductiveStatus {
  InHeat = 'in_heat',
  NotInHeat = 'not_in_heat',
  Pregnant = 'pregnant',
  Nursing = 'nursing',
  Resting = 'resting',
  Intact = 'intact'
}

// Heat stage information
export interface HeatStage {
  name: string;
  description: string;
  day: number;
  fertility: 'low' | 'moderate' | 'peak' | 'none';
  color?: string;
}

// Export legacy status constants for backward compatibility 
export const IN_HEAT = ReproductiveStatus.InHeat;
export const NOT_IN_HEAT = ReproductiveStatus.NotInHeat;
export const PREGNANT = ReproductiveStatus.Pregnant;
export const NURSING = ReproductiveStatus.Nursing;
export const RESTING = ReproductiveStatus.Resting;

// Helper to normalize breeding record data from various sources
export const normalizeBreedingRecord = (data: any): BreedingRecord => {
  return {
    id: data.id,
    dog_id: data.dog_id || data.dam_id,
    sire_id: data.sire_id,
    breeding_date: data.breeding_date || data.date,
    method: data.method || data.breeding_method,
    success: data.success || data.is_successful,
    notes: data.notes,
    created_by: data.created_by,
    created_at: data.created_at
  };
};

// Breeding record interface
export interface BreedingRecord {
  id: string;
  dog_id: string;
  sire_id?: string;
  breeding_date: string;
  method?: string;
  success?: boolean;
  notes?: string;
  created_by?: string;
  created_at?: string;
}

// Pregnancy record interface
export interface PregnancyRecord {
  id: string;
  dog_id: string;
  breeding_record_id?: string;
  confirmation_date?: string;
  due_date?: string;
  status: string;
  notes?: string;
  created_by?: string;
  created_at?: string;
}

// Reproductive milestone interface
export interface ReproductiveMilestone {
  id: string;
  dog_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_by?: string;
  created_at?: string;
}
