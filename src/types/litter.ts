
import { Dog } from './dog';
// Re-export Dog so it's available to components that import from this file
export type { Dog };

// Simple dog interface for minimal dog info (used in litter management)
export interface SimpleDog {
  id: string;
  name: string;
  breed?: string;
  gender?: string;
  color?: string;
  registration_number?: string;
}

// Litter interface
export interface Litter {
  id: string;
  litter_name: string;
  dam_id: string;
  sire_id?: string;
  birth_date: string;
  whelp_date?: string;
  puppy_count?: number;
  status: 'active' | 'completed' | 'planned' | 'archived';
  notes?: string;
  created_at?: string;
  male_count?: number;
  female_count?: number;
  breeding_notes?: string;
  akc_litter_number?: string;
  akc_registration_number?: string;
  akc_registration_date?: string;
  akc_verified?: boolean;
  expected_go_home_date?: string;
  name?: string; // For compatibility
  // Additional properties needed for proper typing
  dam?: Dog;
  sire?: Dog;
  puppies?: Puppy[];
  archived?: boolean;
  breeder_id?: string;
}

// Extended litter interface with Dogs
export interface LitterWithDogs extends Litter {
  dam: Dog;
  sire?: Dog;
  puppies?: Puppy[];
}

// Puppy interface
export interface Puppy {
  id: string;
  name: string;
  litter_id?: string;
  birth_date: string;
  birth_weight?: string;
  birth_order?: number;
  gender: 'Male' | 'Female';
  color?: string;
  status: 'Available' | 'Reserved' | 'Sold' | 'Unavailable';
  microchip_number?: string;
  akc_registration_number?: string;
  akc_litter_number?: string;
  notes?: string;
  photo_url?: string;
  created_at?: string;
  birth_time?: string;
  assistance_required?: boolean;
  assistance_notes?: string;
  eyes_open_date?: string;
  ears_open_date?: string;
  first_walk_date?: string;
  fully_mobile_date?: string;
  current_weight?: string;
  sale_price?: number;
  reservation_date?: string;
  deworming_dates?: string;
  vaccination_dates?: string;
  vet_check_dates?: string;
  presentation?: string;
}

// Puppy with calculated age
export interface PuppyWithAge extends Puppy {
  age: number;
  ageInDays: number;
  ageInWeeks: number;
  developmentalStage: string;
  weightHistory?: any[];
  litter?: Litter;
  currentWeight?: number;
  age_days?: number; // For backward compatibility
  age_weeks?: number; // For backward compatibility
}

// Whelping record interface
export interface WhelpingRecord {
  id: string;
  litter_id: string;
  birth_date: string;
  start_time: string;
  end_time?: string;
  total_puppies: number;
  males: number;
  females: number;
  attended_by?: string;
  complications?: boolean;
  complication_notes?: string;
  notes?: string;
  status: 'in-progress' | 'completed';
  created_at?: string;
}

// Whelping log entry interface
export interface WhelpingLogEntry {
  id: string;
  litter_id: string;
  puppy_id?: string;
  event_type: string;
  timestamp: string;
  notes?: string;
  puppy_details?: any;
  created_at: string;
}

// Whelping observation interface
export interface WhelpingObservation {
  id: string;
  welping_record_id: string;
  puppy_id?: string;
  observation_type: string;
  observation_time: string;
  description: string;
  action_taken?: string;
  created_at?: string;
}

// Puppy tracking milestone
export interface PuppyMilestone {
  id?: string;
  puppy_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_at?: string;
  title?: string;
  is_completed?: boolean;
}
