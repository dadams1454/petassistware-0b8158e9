
import { WeightUnit } from './common';

// Base puppy type with age information
export interface PuppyWithAge {
  id: string;
  name: string | null;
  color: string | null;
  gender: string | null;
  birth_date?: string;
  litter_id: string;
  age_days: number;
  age_in_weeks: number;
  microchip_number?: string | null;
  photo_url?: string | null;
  current_weight?: number | null;
  weight_unit?: string | null;
  status: string;
}

// Age group data for puppy tracking
export interface PuppyAgeGroupData {
  id: string;
  name: string;
  description: string;
  startDay: number;
  endDay: number;
  careChecks: string[];
  puppies?: PuppyWithAge[];
}

// Statistics for puppy management
export interface PuppyManagementStats {
  puppies: PuppyWithAge[];
  totalPuppies: number;
  isLoading: boolean;
  error: null | Error;
  puppiesByAgeGroup: Record<string, PuppyWithAge[]>;
  ageGroups: PuppyAgeGroupData[];
  // Common status counts
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  // Additional breakdown stats
  total: {
    count: number;
    male: number;
    female: number;
  };
  byGender: {
    male: number;
    female: number;
    unknown: number;
  };
  byStatus: Record<string, number>;
  byAgeGroup: Record<string, number>;
}

// Socialization category
export interface SocializationCategory {
  id: string;
  name: string;
}

// Socialization reaction types 
export type SocializationReactionType = 'positive' | 'neutral' | 'negative' | 'fearful';

// Socialization reaction
export interface SocializationReaction {
  id: string;
  name: string;
  type: SocializationReactionType;
}

// For dropdown options
export interface SocializationReactionOption {
  id: string;
  name: string;
}

export interface SocializationCategoryOption {
  id: string;
  name: string;
}

// Socialization experience
export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category: SocializationCategory;
  experience: string;
  experience_date: string;
  reaction?: string;
  notes?: string;
  created_at: string;
}

// Progress tracking for socialization
export interface SocializationProgress {
  total_experiences: number;
  completed_experiences: number;
  by_category: Record<string, number>;
  overall_percentage: number;
}

// Puppy developmental milestones
export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_at: string;
}

// Vaccination schedule item
export interface VaccinationScheduleItem {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  due_date: string;
  notes?: string;
  created_at: string;
}

// Vaccination record
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

// Complete vaccination schedule
export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccine_name: string; 
  vaccination_type: string;
  scheduled_date: string;
  due_date: string;
  administered: boolean;
  notes?: string;
  created_at: string;
}

// Weight record for a puppy
export interface WeightRecord {
  id: string;
  puppy_id: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  created_at: string;
}

// Type for puppy weight record display
export interface PuppyWeightRecord {
  id: string;
  puppy_id: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  age_days?: number;
  percent_change?: number;
  notes?: string;
  created_at: string;
}

// Safe converter between puppy and health weight records
export const convertToPuppyWeightRecord = (record: any): PuppyWeightRecord => {
  if (!record) {
    throw new Error("Cannot convert null or undefined to PuppyWeightRecord");
  }

  return {
    id: record.id || '',
    puppy_id: record.puppy_id || '',
    weight: typeof record.weight === 'number' ? record.weight : Number(record.weight || 0),
    weight_unit: record.weight_unit || record.unit || 'lb',
    date: record.date || new Date().toISOString().split('T')[0],
    age_days: record.age_days ? Number(record.age_days) : undefined,
    percent_change: record.percent_change ? Number(record.percent_change) : undefined,
    notes: record.notes,
    created_at: record.created_at || new Date().toISOString()
  };
};
