
// Import any necessary dependencies

// Define reproductive statuses
export enum ReproductiveStatus {
  InHeat = 'in_heat',
  Pregnant = 'pregnant',
  Nursing = 'nursing',
  Available = 'available',
  Resting = 'resting'
}

// Heat Intensity as a string union type
export type HeatIntensity = 'mild' | 'moderate' | 'strong' | 'unknown';

// Define heat cycle interface
export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string;
  cycle_number?: number;
  cycle_length?: number;
  intensity?: string;
  symptoms?: string[];
  fertility_indicators?: any;
  notes?: string;
  created_at: string;
  updated_at?: string;
  recorded_by?: string;
}

// Define breeding record interface
export interface BreedingRecord {
  id: string;
  dog_id?: string;
  dam_id?: string;
  sire_id: string;
  breeding_date: string;
  tie_date?: string;
  method?: string;
  breeding_method?: string;
  success?: boolean;
  is_successful?: boolean;
  notes?: string;
  created_at?: string;
  created_by?: string;
  sire?: any;
}

// Define pregnancy record interface
export interface PregnancyRecord {
  id: string;
  dog_id: string;
  breeding_record_id?: string;
  confirmation_date?: string;
  due_date?: string;
  status: string;
  notes?: string;
  created_at: string;
  created_by?: string;
}

// Define reproductive milestone interface
export interface ReproductiveMilestone {
  id: string;
  dog_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_at: string;
  created_by?: string;
}

// Heat stage interface
export interface HeatStage {
  name: string;
  description: string;
  start_day: number;
  end_day: number;
  fertility_level: string;
  color: string;
}

// Define the reproductive cycle data interface
export interface ReproductiveCycleData {
  dog: any;
  heatCycles: HeatCycle[];
  breedingRecords: BreedingRecord[];
  pregnancyRecords: PregnancyRecord[];
  milestones: ReproductiveMilestone[];
  status: string;
  nextHeatDate: string | null;
  daysUntilNextHeat: number | null;
  lastHeatCycle: HeatCycle | null;
  currentHeatCycle: HeatCycle | null;
  isInHeat: boolean;
  isPregnant: boolean;
  currentPregnancy: PregnancyRecord | null;
  lastBreedingRecord: BreedingRecord | null;
  estimatedDueDate: string | null;
  gestationDays: number | null;
  daysIntoCurrentHeat: number | null;
  averageCycleLength: number | null;
  isLactating: boolean;
  isNursing: boolean;
  heatStages: HeatStage[];
  currentHeatStage: HeatStage | null;
  fertilityWindow: { start: Date; end: Date } | null;
}

// Define breeding checklist item interface
export interface BreedingChecklistItem {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  dueDate?: string;
  category?: string;
}

// Define breeding prep form data interface
export interface BreedingPrepFormData {
  dam_id: string;
  sire_id: string;
  planned_date: string;
  notes?: string;
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
    sire: record.sire
  };
}
