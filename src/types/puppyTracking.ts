
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

// Extending PuppyWithAge to include all the properties needed by our components
export interface PuppyWithAge {
  id: string;
  ageInDays: number;
  name?: string | null;
  gender?: string | null;
  color?: string | null;
  status?: string | null;
  birth_date?: string | null;
  current_weight?: string | number | null;
  photo_url?: string | null;
  litter_id?: string | null;
  microchip_number?: string | null;
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
