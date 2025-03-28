
export interface WeightRecord {
  id?: string;
  puppy_id?: string;
  date: string | Date;
  weight: number;
  weight_unit: 'oz' | 'g' | 'lbs' | 'kg';
  percent_change?: number | null;
  notes?: string | null;
  created_at?: string;
}

// Adding other types from the existing puppyTracking.ts
export interface PuppyWithAge {
  ageInDays: number;
  litters?: {
    id: string;
    name?: string;
    birth_date: string;
  };
}

export interface PuppyAgeGroupData {
  id: string;
  name: string;
  startDay: number;
  endDay: number;
  description: string;
  milestones: string;
  careChecks?: string[];
}

export interface PuppyCareLog {
  id: string;
  puppy_id: string;
  timestamp: string | Date;
  care_type: string;
  notes?: string;
  created_by: string;
  created_at: string;
}

export interface PuppyManagementStats {
  totalPuppies: number;
  activeLitters: number;
  upcomingVaccinations: number;
  recentWeightChecks: number;
}
