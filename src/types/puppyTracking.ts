
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
}

export interface VaccinationScheduleItem {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  due_date: string;
  notes?: string;
  created_at: string;
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
