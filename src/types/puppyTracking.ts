
// Puppy tracking related types

import { WeightUnit } from '@/types/common';

// Puppy with age information
export interface PuppyWithAge {
  id: string;
  name: string;
  birth_date?: string;
  ageInDays?: number;
  ageInWeeks?: number;
  age_days?: number;
  age_weeks?: number;
  age?: number;
  litter_id?: string;
  gender?: string;
  color?: string;
  status?: string;
  photo_url?: string;
  microchip_number?: string;
  birth_weight?: number | string;
  birth_weight_unit?: WeightUnit;
  current_weight?: number | string;
  current_weight_unit?: WeightUnit;
  weight_unit?: WeightUnit;
  sale_price?: number;
  is_sold?: boolean;
  is_available?: boolean;
  is_reserved?: boolean;
  customer_id?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  is_test_data?: boolean;
  birth_order?: number;
  developmentalStage?: string;
}

// Age group data
export interface PuppyAgeGroup {
  id: string;
  name: string;
  description?: string;
  minAge: number;
  maxAge: number;
  unit: 'days' | 'weeks' | 'months';
  startDay?: number;
  endDay?: number;
  milestones?: string;
}

// Mapping of age groups to puppies
export interface PuppyAgeGroupData {
  [ageGroupId: string]: PuppyWithAge[];
}

// Stats for puppy management dashboard
export interface PuppyManagementStats {
  puppies: PuppyWithAge[];
  totalPuppies: number;
  ageGroups: PuppyAgeGroup[];
  puppiesByAgeGroup: PuppyAgeGroupData;
  byAgeGroup: PuppyAgeGroupData;
  
  // Status counts
  activeCount?: number;
  availableCount?: number;
  reservedCount?: number;
  soldCount?: number;
  
  // Original property names (for backward compatibility)
  availablePuppies?: number;
  reservedPuppies?: number;
  soldPuppies?: number;
  
  // Extended statistics
  total?: {
    count: number;
    male: number;
    female: number;
  };
  
  byGender?: {
    male: number;
    female: number;
    unknown: number;
  };
  
  byStatus?: {
    available: number;
    reserved: number;
    sold: number;
    unavailable: number;
    [key: string]: number;
  };
  
  // Current week (for timeline view)
  currentWeek?: number;
  
  // Loading and error states
  isLoading?: boolean;
  error?: any;
}

// Add socialization types that were missing
export type SocializationReactionType = 'positive' | 'neutral' | 'negative' | 'fearful' | 'curious' | 'very_positive' | 'very_fearful' | 'cautious';

export interface SocializationCategory {
  id: string;
  name: string;
  description: string;
  order: number;
  color?: string;
  examples?: string[];
}

export interface SocializationCategoryOption {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  color?: string;
  examples?: string[];
  label?: string;
  value?: string;
}

export interface SocializationReactionOption {
  id: string;
  type: SocializationReactionType;
  name: string;
  description?: string;
  color: string;
  emoji: string;
  value?: string;
  label?: string;
}

export interface SocializationProgress {
  categoryId: string;
  category: string;
  total: number;
  completed: number;
  percentage: number;
  // For backwards compatibility
  completion_percentage?: number;
  count?: number;
  target?: number;
  categoryName?: string;
  id?: string;
}

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  date: string;
  category: string;
  stimulus: string;
  reaction: SocializationReactionType;
  notes?: string;
  created_at: string;
  created_by?: string;
  // For backwards compatibility
  experience?: string;
  experience_date?: string;
  experience_type?: string;
}

export interface PuppyCareLog {
  id: string;
  puppy_id: string;
  date: string;
  care_type: string;
  notes?: string;
  created_at: string;
  created_by?: string;
}

// Weight record type (imported from health.ts to avoid circular references)
export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  unit?: WeightUnit; // For backward compatibility
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  age_days?: number;
  birth_date?: string;
}

// Add vaccination schedule types
export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccine_name: string;
  vaccination_type?: string;
  due_date: string;
  administered: boolean;
  administered_date?: string;
  scheduled_date?: string;
  notes?: string;
  created_at?: string;
}

// For compatibility with older code
export type VaccinationScheduleItem = VaccinationSchedule;

export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccination_date: string;
  lot_number?: string;
  administered_by?: string;
  notes?: string;
  created_at: string;
}

// Add puppy milestone for hooks
export interface PuppyMilestone {
  id?: string;
  puppy_id: string;
  milestone_type: string;
  milestone_date: string;
  title?: string;
  notes?: string;
  created_at?: string;
  is_completed?: boolean;
  category?: string; // Adding for compatibility
  description?: string; // Adding for compatibility
  expected_age_days?: number; // Adding for compatibility
  completion_date?: string; // Adding for compatibility
}

// Define SocializationReaction interface for compatibility
export interface SocializationReaction {
  id: string;
  name: string;
  color: string;
  emoji?: string;
  value: string;
}

// Health certificate
export interface HealthCertificate {
  id: string;
  dog_id: string;
  puppy_id?: string;
  certificate_type: string;
  issue_date: string;
  expiry_date?: string;
  issuing_authority: string;
  issuer?: string; // For backward compatibility
  file_url?: string;
  notes?: string;
  created_at: string;
}

// Medication
export interface Medication {
  id: string;
  dog_id: string;
  puppy_id?: string;
  medication_name: string;
  dosage: number;
  dosage_unit: string;
  frequency: string;
  administration_route: string;
  start_date: string;
  end_date?: string;
  is_active?: boolean;
  last_administered?: string;
  notes?: string;
  created_at: string;
}

// Medication administration
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  administered_date: string;
  administered_at?: string; // For backward compatibility
  administered_by: string;
  notes?: string;
  created_at: string;
}

// AgeGroup type for compatibility
export type AgeGroup = PuppyAgeGroup;
