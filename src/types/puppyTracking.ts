
import { WeightUnit } from './health';

export interface Puppy {
  id: string;
  name?: string;
  litter_id?: string;
  gender?: string;
  color?: string;
  birth_date?: string;
  birth_weight?: string;
  current_weight?: string;
  birth_order?: number;
  microchip_number?: string;
  status?: string;
  photo_url?: string;
  notes?: string;
  created_at?: string;
  
  // Additional fields
  eyes_open_date?: string;
  ears_open_date?: string;
  first_walk_date?: string;
  fully_mobile_date?: string;
  vaccination_dates?: string;
  deworming_dates?: string;
  vet_check_dates?: string;
  
  // AKC Information
  akc_litter_number?: string;
  akc_registration_number?: string;
  
  // Birth assistance info
  assistance_required?: boolean;
  assistance_notes?: string;
  birth_time?: string;
  presentation?: string;
  
  // Reservation info
  reservation_date?: string;
  sale_price?: number;
  
  // Nested objects for relations
  litters?: {
    id: string;
    litter_name?: string;
    birth_date?: string;
  }
}

export interface PuppyWithAge extends Puppy {
  ageInDays: number;
  ageInWeeks: number;
  ageDescription: string;
}

export interface PuppyWeight {
  id: string;
  puppy_id: string;
  date: string;
  weight: number;
  weight_unit: WeightUnit;
  notes?: string;
  created_at?: string;
}

export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_at?: string;
}

export interface MilestoneByCategory {
  category: string;
  milestones: {
    label: string;
    value: string;
    date?: string;
    target_age?: number;
    complete: boolean;
  }[];
}

export interface PuppyManagementStats {
  totalPuppies: number;
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  
  // Age groups information
  ageGroups: string[];
  
  // Puppies array
  puppies: PuppyWithAge[];
  
  // Puppies grouped by age (using string keys for age group names)
  puppiesByAgeGroup: Record<string, PuppyWithAge[]>;
  
  // Count of puppies by age group
  puppiesCountByAgeGroup?: Record<string, number>;
}
