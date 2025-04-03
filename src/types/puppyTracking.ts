import { WeightUnit as CommonWeightUnit } from './common';

export type WeightUnit = CommonWeightUnit;

export interface PuppyWithAge {
  id: string;
  name?: string;
  gender?: string;
  color?: string;
  birth_date: string;
  photo_url?: string;
  birth_weight?: string | number;
  current_weight?: string | number;
  litter_id?: string;
  age_days?: number;
  age_weeks?: number;
  ageInDays?: number; // For backward compatibility
  ageInWeeks?: number; // For backward compatibility
  status?: string;
  birth_order?: number;
  // Additional fields
  ageDescription?: string;
  microchip_number?: string;
  akc_litter_number?: string;
  akc_registration_number?: string;
  weight_unit?: WeightUnit;
  // Add litters property with proper structure
  litters?: {
    id: string; 
    name?: string;
    litter_name?: string; // Some components use litter_name
    birth_date: string;
    dam?: { name?: string };
    sire?: { name?: string };
  };
  // For backward compatibility with components accessing these properties
  created_at?: string;
  updated_at?: string;
  presentation?: string;
  assistance_required?: boolean;
  assistance_notes?: string;
  notes?: string;
  vaccination_dates?: string;
  deworming_dates?: string;
  vet_check_dates?: string;
  health_notes?: string;
  sale_price?: number;
  birth_time?: string;
}

// Keep all other interfaces the same
export interface PuppyAgeGroupData {
  groupName: string;
  ageRange: string;
  description: string;
  imageUrl: string;
  id: string; // Adding id property
  name: string; // Adding name property
  startDay: number; // Adding startDay property
  endDay: number; // Adding endDay property
  milestones?: string[]; // Adding milestones property
  careChecks?: string[]; // Adding careChecks property
  color?: string; // Add color property that's used in some components
}

export interface PuppyManagementStats {
  totalPuppies: number;
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  averageWeight: number;
  averagePrice: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  puppyStatusCounts: { [key: string]: number };
  totalCount?: number;  // Added for backward compatibility
  byStatus?: { [key: string]: number }; // Added for compatibility
  activeLitters?: number; // Added for compatibility
  upcomingVaccinations?: number; // Added for compatibility
  recentWeightChecks?: number; // Added for compatibility
}

export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  unit: WeightUnit; // For compatibility
  date: string;
  notes?: string;
  created_at: string;
  percent_change?: number;
  birth_date?: string; // For calculating age
  age_days?: number;
  formatted_date?: string; // For display
}

export interface SocializationCategory {
  id: string;
  name: string;
  color?: string; // Adding color property
  description?: string; // Adding description property
  examples?: string[]; // Adding examples property
}

export interface SocializationReactionObject {
  id: string;
  name: string;
  color: string;
  description?: string; // Adding description property
  emoji?: string; // Adding emoji property
}

export interface SocializationReaction {
  category: SocializationCategory;
  reaction: SocializationReactionObject;
  notes?: string;
}

export interface SocializationProgress {
  category: SocializationCategory;
  progress: number;
  categoryId?: string; // For backward compatibility
  categoryName?: string; // For backward compatibility
  completion_percentage?: number; // For backward compatibility
  count?: number; // For backward compatibility
  target?: number; // For backward compatibility
}

export interface SocializationRecord {
  id: string;
  puppy_id: string;
  category_id: string;
  experience: string;
  experience_date: string;
  reaction_id?: string;
  notes?: string;
  created_at: string;
}

// Add missing interfaces needed by other components
export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category_id: string;
  category_name: string;
  experience: string;
  experience_date: string;
  reaction_id?: string;
  reaction_name?: string;
  reaction_color?: string;
  notes?: string;
  created_at: string;
}

export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  title: string;
  milestone_type: string;
  expected_age_days: number;
  description?: string;
  is_completed: boolean;
  completion_date?: string;
  milestone_category?: string; // For compatibility
  notes?: string;
  photo_url?: string;
}

export interface VaccinationScheduleItem {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  due_date: string;
  scheduled_date?: string; // For compatibility
  administered: boolean;
  vaccine_name?: string;
  notes?: string;
  created_at?: string;
}

export type VaccinationSchedule = VaccinationScheduleItem;

export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccination_date: string;
  administered_by?: string;
  lot_number?: string;
  notes?: string;
  created_at?: string;
}

// For AgeGroup
export interface AgeGroup {
  id: string;
  name: string;
  startDay: number;
  endDay: number;
  description: string;
  imageUrl: string;
  milestones: string[];
}

// Add a type guard function to safely check for puppy properties
export function isPuppyWithAge(obj: any): obj is PuppyWithAge {
  return obj && typeof obj === 'object' && typeof obj.id === 'string';
}
