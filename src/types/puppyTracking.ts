
// Add this file to define types for puppy tracking

export type WeightUnit = 'oz' | 'g' | 'lbs' | 'kg';

export interface WeightRecord {
  id: string;
  puppy_id?: string;
  dog_id?: string;
  date: string;
  weight: number;
  weight_unit: WeightUnit;
  notes?: string;
  created_at: string;
  percent_change?: number;
  birth_date?: string; // Added for components that need it
}

export interface WeightData {
  age: number;
  weight: number;
  unit: string;
  id?: string; // Add id to fix issues in usePuppyBreedAverages
}

export interface PuppyWithAge extends Record<string, any> {
  id: string;
  name: string;
  gender?: string;
  color?: string;
  birth_date?: string;
  litter_id?: string;
  ageInDays: number;
  photo_url?: string;
}

export interface SocializationCategory {
  id: string;
  name: string;
  description?: string;
  examples?: string[];
  color?: string; // Added for SocializationProgressChart
}

export interface SocializationReaction {
  id: string;
  name: string;
  description?: string;
  color?: 'green' | 'blue' | 'amber' | 'red' | 'purple' | 'gray';
}

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category_id: string;
  experience: string;
  experience_date: string;
  reaction?: string;
  notes?: string;
  created_at: string;
}

export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccination_date: string;
  due_date?: string;
  administered_by?: string;
  notes?: string;
  lot_number?: string;
  created_at: string;
  is_completed?: boolean; // Added to fix VaccinationSchedule errors
}

export interface VaccinationScheduleItem {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  due_date: string;
  notes?: string;
  created_at: string;
  is_completed?: boolean; // Added to fix errors in usePuppyVaccinations
}

export const DEFAULT_AGE_GROUPS = [
  { name: '0-2 weeks', min: 0, max: 14 },
  { name: '2-4 weeks', min: 15, max: 28 },
  { name: '4-6 weeks', min: 29, max: 42 },
  { name: '6-8 weeks', min: 43, max: 56 },
  { name: '8-12 weeks', min: 57, max: 84 },
  { name: '3-6 months', min: 85, max: 180 },
  { name: '6-12 months', min: 181, max: 365 },
  { name: '1+ years', min: 366, max: 9999 }
];

// Adding PuppyAgeGroupData interface
export interface PuppyAgeGroupData {
  id: string;
  name: string;
  startDay: number;
  endDay: number;
  description: string;
  color?: string;
  milestones?: string;
  careChecks?: string[];
}

// Adding PuppyManagementStats interface
export interface PuppyManagementStats {
  totalPuppies: number;
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  maleCount: number;
  femaleCount: number;
  averageWeight: number;
  puppiesByColor: Record<string, number>;
  puppiesByAge: Record<string, number>;
  activeLitters: number;
  upcomingVaccinations: number;
  recentWeightChecks: number;
}

// Adding PuppyMilestone interface
export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  title: string;
  description?: string;
  expected_age_days?: number;
  actual_age_days?: number;
  completion_date?: string;
  category: 'physical' | 'health' | 'behavioral';
}

// Adding SocializationProgress interface
export interface SocializationProgress {
  category: SocializationCategory;
  count: number;
  percentage: number;
}
