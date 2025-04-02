
// Defining the key types needed for puppy tracking functionality

export interface PuppyWithAge {
  id: string;
  name: string;
  gender: string;
  birth_date: string;
  color: string;
  status: string;
  litter_id: string;
  birth_weight?: string;
  microchip_number?: string;
  age_days: number;  // Age in days
  age_weeks: number; // Age in weeks
  created_at: string;
  updated_at: string;
}

export interface PuppyManagementStats {
  totalPuppies: number;
  totalLitters: number;
  activeLitters: number;
  availablePuppies: number;
  reservedPuppies: number;
  puppiesByAgeGroup: PuppyAgeGroupData[];
  recentWeightChecks: number;
  upcomingVaccinations: number;
  weightCompletionRate: number;
  vaccinationCompletionRate: number;
}

export interface PuppyAgeGroupData {
  id: string;
  name: string;
  description: string;
  minAge: number;
  maxAge: number;
  count: number;
  puppies: PuppyWithAge[];
}

export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: string;
  date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  percent_change?: number;
}

export interface SocializationCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  experiences: SocializationExperience[];
}

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category: string;
  experience: string;
  date: string;
  reaction: 'positive' | 'neutral' | 'negative' | 'fearful' | 'excited';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PuppyVaccination {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccination_date: string;
  administered_by?: string;
  lot_number?: string;
  notes?: string;
  created_at: string;
}

export interface PuppyVaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  due_date: string;
  notes?: string;
  created_at: string;
}

export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_at: string;
}
