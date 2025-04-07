
// Import WeightUnit from common
import { WeightUnit } from '@/types/weight-units';
import type { Json } from '../integrations/supabase/types';
import type { Dog } from '@/types/dog';
import { HeatIntensityType, HeatIntensityValues, HeatCycle, HeatStage } from './heat-cycles';

// Re-export heat cycle types
export type { HeatIntensityType, HeatCycle, HeatStage };
export { HeatIntensityValues };

// Heat intensity enum for backward compatibility
export enum HeatIntensity {
  LIGHT = 'light',
  MODERATE = 'moderate',
  HEAVY = 'heavy',
  MILD = 'mild',
  MEDIUM = 'medium',
  LOW = 'low',
  HIGH = 'high',
  PEAK = 'peak',
  STRONG = 'strong',
  UNKNOWN = 'unknown'
}

// Reproductive status enum
export enum ReproductiveStatus {
  InHeat = 'in_heat',
  IN_HEAT = 'in_heat', // For backward compatibility
  PreHeat = 'pre_heat',
  Pregnant = 'pregnant',
  PREGNANT = 'pregnant', // For backward compatibility
  Whelping = 'whelping',
  Nursing = 'nursing',
  Available = 'available',
  Resting = 'resting',
  TooYoung = 'too_young',
  TooOld = 'too_old',
  Spayed = 'spayed',
  Recovery = 'recovery',
  Intact = 'intact',
  NotInHeat = 'not_in_heat',
  Altered = 'altered',
  Neutered = 'neutered'
}

// Breeding record interface
export interface BreedingRecord {
  id: string;
  dam_id?: string;
  dog_id?: string;
  sire_id: string;
  breeding_date: string;
  tie_date?: string;
  method?: string;
  breeding_method?: string;
  success?: boolean;
  is_successful?: boolean;
  notes?: string;
  created_at: string;
  created_by?: string;
  heat_cycle_id?: string;
  estimated_due_date?: string;
  dam?: Dog;
  sire?: Dog;
}

// Pregnancy record interface
export interface PregnancyRecord {
  id: string;
  dog_id: string;
  breeding_record_id?: string;
  confirmation_date?: string;
  due_date?: string;
  status: 'pending' | 'confirmed' | 'lost' | 'delivered' | 'completed';
  notes?: string;
  created_at: string;
  created_by?: string;
  estimated_whelp_date?: string;
  actual_whelp_date?: string;
  puppies_born?: number;
  puppies_alive?: number;
  outcome?: string;
}

// Reproductive milestone interface
export interface ReproductiveMilestone {
  id: string;
  dog_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_at: string;
  created_by?: string;
  date?: string; // For backward compatibility with some components
}

// Reproductive cycle data interface
export interface ReproductiveCycleData {
  dog: Dog;
  heatCycles: HeatCycle[];
  breedingRecords: BreedingRecord[];
  pregnancyRecords: PregnancyRecord[];
  milestones: ReproductiveMilestone[];
  lastHeatCycle?: HeatCycle | null;
  currentHeatCycle?: HeatCycle | null;
  currentHeatStage?: HeatStage | null;
  currentStage?: HeatStage | null; // For backward compatibility
  currentPregnancy?: PregnancyRecord | null;
  isInHeat: boolean;
  isPregnant: boolean;
  nextHeatDate?: string | null;
  daysUntilNextHeat?: number | null;
  daysSinceLastHeat?: number | null;
  averageCycleLength?: number | null;
  heatStages: HeatStage[];
  currentStatus: ReproductiveStatus;
  status?: ReproductiveStatus;
  dueDate?: string | null;
  daysUntilDue?: number | null;
  gestationDays?: number | null;
  pregnancyConfirmed: boolean;
  pregnancyLost: boolean;
  estimatedDueDate?: string | null;
  fertilityWindow?: { start: string; end: string } | null;
}

// Breeding checklist item interface
export interface BreedingChecklistItem {
  id: string;
  task: string;
  title: string;
  description: string;
  completed: boolean;
  category: string;
  priority: string;
}

// Breeding preparation form data interface
export interface BreedingPrepFormData {
  dog_id: string;
  sire_id: string;
  dam_id?: string;
  damId?: string;
  sireId?: string;
  tie_date: string;
  estimated_due_date: string;
  breeding_method: string;
  notes: string;
  plannedDate?: string;
  plannedTieDate?: string;
}

// Helper function to normalize breeding records
export function normalizeBreedingRecord(record: any): BreedingRecord {
  return {
    id: record.id,
    dog_id: record.dog_id,
    dam_id: record.dam_id,
    sire_id: record.sire_id,
    breeding_date: record.breeding_date,
    tie_date: record.tie_date,
    method: record.method,
    breeding_method: record.method, // For compatibility
    success: record.success,
    is_successful: record.success, // For compatibility
    notes: record.notes,
    created_at: record.created_at,
    created_by: record.created_by,
    sire: record.sire,
    dam: record.dam
  };
}

// Export the Dog type correctly
export type { Dog };
