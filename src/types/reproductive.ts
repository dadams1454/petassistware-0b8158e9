
export interface Dog {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  breed: string;
  birthdate?: string;
  color?: string;
  photo_url?: string;
  is_pregnant?: boolean;
  last_heat_date?: string;
  tie_date?: string; // Added tie_date to the Dog interface
  registration_number?: string;
  microchip_number?: string;
  weight?: number;
  notes?: string;
  owner_id?: string;
  created_at?: string;
}

export type HeatIntensity = 'light' | 'moderate' | 'heavy';

export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string;
  cycle_number?: number;
  cycle_length?: number;
  intensity: HeatIntensity;
  symptoms?: string[];
  fertility_indicators?: any;
  notes?: string;
  recorded_by?: string;
  created_at: string;
  updated_at?: string;
}

// Define HeatStage for referencing
export interface HeatStage {
  id: string;
  name: string;
  description: string;
  days_range: [number, number];
  is_fertile: boolean;
}

export enum ReproductiveStatus {
  READY = 'READY',
  IN_HEAT = 'IN_HEAT',
  BREEDING = 'BREEDING',
  PREGNANT = 'PREGNANT',
  WHELPING = 'WHELPING',
  NURSING = 'NURSING',
  RECOVERY = 'RECOVERY',
  UNAVAILABLE = 'UNAVAILABLE',
  // Additional statuses for more detailed tracking
  NOT_IN_HEAT = 'NOT_IN_HEAT',
  PRE_HEAT = 'PRE_HEAT'
}

export interface BreedingRecord {
  id: string;
  dam_id: string;
  sire_id: string;
  breeding_date: string;
  tie_date?: string; // Added tie_date to BreedingRecord
  method: string;
  breeding_method?: string; // For backward compatibility
  successful: boolean;
  is_successful?: boolean; // For backward compatibility
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at?: string;
  heat_cycle_id?: string; // Added for reference to heat cycle
  estimated_due_date?: string; // Added for convenience
}

export interface PregnancyRecord {
  id: string;
  dog_id: string;
  breeding_id?: string;
  breeding_record_id?: string; // For backward compatibility
  confirmation_date: string;
  confirmation_method: string;
  due_date: string;
  estimated_whelp_date?: string; // Added for backward compatibility
  puppy_count_estimate?: number;
  notes?: string;
  created_at: string;
  updated_at?: string;
  actual_whelp_date?: string; // Added for tracking actual birth date
  puppies_born?: number; // Added for tracking birth stats
  puppies_alive?: number; // Added for tracking birth stats
  outcome?: string; // Added for tracking pregnancy outcome
}

export interface ReproductiveMilestone {
  id: string;
  dog_id: string;
  milestone_type: string;
  date: string;
  milestone_date?: string; // For backward compatibility
  notes?: string;
  created_at: string;
}

export interface BreedingChecklistItem {
  id: string;
  title: string;
  task?: string; // For backward compatibility
  description?: string;
  completed: boolean;
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface BreedingPrepFormData {
  dam_id: string;
  damId?: string; // For backward compatibility
  sire_id: string;
  sireId?: string; // For backward compatibility
  plannedDate: string;
  plannedTieDate?: string; // For backward compatibility
  method: string;
  notes?: string;
}

export interface ReproductiveCycleData {
  dog: Dog;
  heatCycles: HeatCycle[];
  breedingRecords: BreedingRecord[];
  pregnancyRecords: PregnancyRecord[];
  milestones: ReproductiveMilestone[];
  showHeatCycles: boolean;
  showBreedingRecords: boolean;
  showPregnancyRecords: boolean;
  showMilestones: boolean;
  currentStatus: ReproductiveStatus;
  currentStage: string;
  isInHeat: boolean;
  isPregnant: boolean;
  isBreeding: boolean;
  isPreHeat: boolean;
  estimatedNextHeat?: Date;
  estimatedDueDate?: Date;
  // Additional properties for comprehensive data
  status?: string;
  nextHeatDate?: Date;
  daysUntilNextHeat?: number;
  averageCycleLength?: number;
  currentHeatStage?: HeatStage;
  currentHeatCycle?: HeatCycle;
  fertilityWindow?: { start: Date; end: Date };
  gestationDays?: number;
  fertileDays?: { start: Date; end: Date };
}

// Add WelpingLog interface for references
export interface WelpingLog {
  id: string;
  litter_id: string;
  event_type: string;
  timestamp: string;
  puppy_id?: string;
  puppy_details?: any;
  notes?: string;
  created_at: string;
}

// Add WelpingObservation interface for references
export interface WelpingObservation {
  id: string;
  welping_record_id: string;
  observation_type: string;
  observation_time: string;
  description: string;
  action_taken?: string;
  puppy_id?: string;
  created_at?: string;
}
