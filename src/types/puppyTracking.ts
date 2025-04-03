
// Weight record types for puppies
export type WeightUnit = 'oz' | 'g' | 'lbs' | 'kg' | 'lb';

export interface PuppyWeight {
  id: string;
  puppy_id: string;
  date: string;
  weight: number;
  weight_unit: WeightUnit;
  notes?: string;
  created_at: string;
  age_days?: number;
}

export interface WeightTrackerProps {
  puppyId: string;
  birthDate?: string;
  onAddSuccess?: () => void;
}

// Type for weight data
export interface WeightData {
  id: string;
  date: string;
  weight: number;
  unit: WeightUnit;
  ageInDays?: number;
  ageInWeeks?: number;
}
