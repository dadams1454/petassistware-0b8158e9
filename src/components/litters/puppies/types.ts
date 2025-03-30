
import { SocializationCategory } from '@/components/litters/puppies/types';

export interface PuppyFormProps {
  litterId: string;
  initialData?: Puppy | null;
  onSubmit: () => void;
  onCancel: () => void;
}

export interface Puppy {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  color: string;
  birth_date: string;
  litter_id: string;
  microchip_number?: string;
  current_weight?: string;
  photo_url?: string;
  status: 'Available' | 'Reserved' | 'Sold' | 'Unavailable';
  birth_order?: number;
}

export interface PuppyWithAge extends Puppy {
  age_in_weeks: number;
}

export interface PuppyFormData {
  name: string;
  gender: 'Male' | 'Female';
  color: string;
  birth_date: string;
  current_weight?: string;
  microchip_number?: string;
  birth_order?: number;
  status: 'Available' | 'Reserved' | 'Sold' | 'Unavailable';
}

export interface SocializationCategory {
  id: string;
  name: string;
}

export interface SocializationRecord {
  id: string;
  puppy_id: string;
  category: SocializationCategory;
  experience: string;
  experience_date: string;
  reaction?: string;
  notes?: string;
  created_at: string;
}

export interface SocializationCategoryOption {
  id: string;
  name: string;
  experiences: string[];
}

export interface SocializationReactionOption {
  id: string;
  name: string;
  color: string;
}

export interface WeightChartData {
  date: string;
  weight: number;
}

export interface WeightTrackerProps {
  puppyId: string;
  onWeightAdded?: () => void;
}
