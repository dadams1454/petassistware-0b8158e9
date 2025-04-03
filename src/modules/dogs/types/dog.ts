
export enum DogGender {
  Male = 'male',
  Female = 'female'
}

export enum DogStatus {
  Active = 'active',
  Inactive = 'inactive',
  Deceased = 'deceased',
  Sold = 'sold',
  Rehomed = 'rehomed'
}

export interface DogProfile {
  id: string;
  name: string;
  breed: string;
  color?: string;
  gender?: string;
  birthdate?: string;
  photo_url?: string;
  weight?: number;
  weight_unit?: string; // Added for compatibility
  is_pregnant?: boolean;
  last_heat_date?: string;
  tie_date?: string;
  vaccination_type?: string;
  vaccination_notes?: string;
  last_vaccination_date?: string;
  requires_special_handling?: boolean;
  pedigree?: boolean;
  litter_number?: number;
  owner_id?: string;
  notes?: string;
  microchip_number?: string;
  registration_number?: string;
  registration_organization?: string;
  microchip_location?: string;
  reproductive_status?: string;
  status?: DogStatus; // Added for compatibility
  potty_alert_threshold?: number;
  max_time_between_breaks?: number;
}

export interface WeightRecord {
  id: string;
  dog_id: string;
  weight: number;
  weight_unit: string;
  unit?: string; // Added for compatibility
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
}

export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: string;
  title?: string;
  visit_date: string;
  vet_name: string;
  description?: string;
  document_url?: string;
  record_notes?: string;
  created_at: string;
}

export interface GrowthStats {
  percentChange: number;
  averageGrowthRate: number;
  weightGoal: number | null;
  onTrack: boolean | null;
  totalGrowth?: number | null;
  currentWeight?: number;
  weightUnit?: string;
  averageGrowth?: number;
  growthRate?: number;
  lastWeekGrowth?: number;
  projectedWeight?: number;
}
