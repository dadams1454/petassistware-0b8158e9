
// Import WeightUnit from common
import { WeightUnit } from '@/types/weight-units';
import type { Json } from '../integrations/supabase/types';
import type { Dog } from '@/types/dog';
import type { HeatIntensityType, HeatCycle, HeatStage } from './heat-cycles';

// Re-export heat cycle types
export type { HeatIntensityType, HeatCycle, HeatStage };
export { HeatIntensity, HeatIntensityValues } from './heat-cycles';

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
  currentStatus?: ReproductiveStatus;
  stats?: {
    averageCycleLength?: number;
    fertileStartDate?: string;
    fertileEndDate?: string;
    lastHeatDate?: string;
    nextHeatDate?: string;
    daysSinceLastHeat?: number;
    daysUntilNextHeat?: number;
    isInHeat?: boolean;
    isFertile?: boolean;
    isPregnant?: boolean;
    pregnancyDays?: number;
    estimatedDueDate?: string;
  };
  heatStages: HeatStage[];
  days: {
    daysSinceLastHeat?: number;
    daysUntilNextHeat?: number;
  };
  pregnant: boolean;
  pregnancyConfirmed: boolean;
  pregnancyLost: boolean;
  gestationDays: number;
}

