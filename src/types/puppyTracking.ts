
export interface PuppyWithAge {
  id: string;
  name: string | null;
  gender: string | null;
  color: string | null;
  birth_date?: string;
  litter_id: string;
  microchip_number?: string | null;
  photo_url?: string | null;
  current_weight?: string | null;
  weight_unit?: string | null;
  status: 'Available' | 'Reserved' | 'Sold' | 'Unavailable' | string;
  birth_order?: number | null;
  birth_weight?: string | null;
  birth_time?: string | null;
  presentation?: string | null;
  assistance_required?: boolean | null;
  assistance_notes?: string | null;
  sale_price?: number | null;
  notes?: string | null;
  ageInDays: number; // Required property for age calculation
  age_in_weeks?: number; // Alternative property name
  age_days?: number; // Alternative property name
  age_weeks?: number; // For backward compatibility
  litters?: {
    id: string;
    name?: string;
    birth_date: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface PuppyAgeGroupData {
  id: string;
  name: string;
  description: string;
  startDay: number;
  endDay: number;
  milestones?: string;
  color?: string;
}

export interface PuppyManagementStats {
  puppies: PuppyWithAge[];
  puppiesByAgeGroup: Record<string, PuppyWithAge[]>;
  ageGroups: PuppyAgeGroupData[];
  totalPuppies: number;
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  isLoading: boolean;
  error: any;
}

export type WeightUnit = 'oz' | 'g' | 'lbs' | 'lb' | 'kg';

export interface WeightRecord {
  id: string;
  puppy_id: string;
  weight: number;
  weight_unit: WeightUnit;
  unit?: WeightUnit; // For compatibility with different API responses
  date: string;
  weight_date?: string; // For compatibility with different API responses
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SocializationCategory {
  id: string;
  name: string;
  description: string;
  items: {
    id: string;
    name: string;
    description?: string;
  }[];
}

export interface SocializationReaction {
  id: string;
  puppy_id: string;
  category_id: string;
  item_id: string;
  reaction: 'positive' | 'neutral' | 'negative' | 'not_tested';
  notes?: string;
  date: string;
  created_at: string;
  updated_at?: string;
}

export interface SocializationReactionObject {
  [itemId: string]: {
    reaction: 'positive' | 'neutral' | 'negative' | 'not_tested';
    notes?: string;
    date?: string;
  };
}

export interface SocializationProgress {
  total: number;
  completed: number;
  positive: number;
  neutral: number;
  negative: number;
  percentage: number;
}
