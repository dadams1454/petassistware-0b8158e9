
import { Puppy as PuppyBase } from '@/types/litter';

export type Puppy = PuppyBase;

export interface Litter {
  id: string;
  litter_name?: string;
  dam_id: string;
  sire_id?: string;
  birth_date: string;
  expected_go_home_date?: string;
  status?: 'active' | 'completed' | 'planned' | 'archived';
  male_count?: number;
  female_count?: number;
  puppy_count?: number;
  akc_litter_number?: string;
  akc_registration_number?: string;
  akc_registration_date?: string;
  akc_verified?: boolean;
  notes?: string;
  breeding_notes?: string;
  created_at?: string;
  dam?: Dog;
  sire?: Dog;
  puppies?: Puppy[];
  archived?: boolean;
  name?: string;
}

export interface Dog {
  id: string;
  name: string;
  breed?: string;
  color?: string;
  gender?: 'Male' | 'Female';
  photo_url?: string;
  birthdate?: Date | string;
  registration_number?: string;
}

export interface WelpingRecord {
  id: string;
  litter_id: string;
  recording_date: string;
  start_time?: string;
  end_time?: string;
  duration_minutes?: number;
  total_puppies_born: number;
  live_puppies_born: number;
  stillborn_puppies: number;
  dam_condition: string;
  complications?: string;
  assistance_required: boolean;
  assistance_details?: string;
  notes?: string;
  created_at: string;
  created_by?: string;
  birth_date?: string;
  total_puppies?: number;
  males?: number;
  females?: number;
  attended_by?: string;
  complication_notes?: string;
  status?: string;
}

export interface WelpingObservation {
  id: string;
  welping_id: string;
  observation_time: string;
  puppy_number?: number;
  puppy_id?: string;
  presentation?: string;
  coloration?: string;
  activity_level?: string;
  weight?: number;
  weight_unit?: string;
  notes?: string;
  created_at: string;
  created_by?: string;
  observation_type?: string;
  description?: string;
  action_taken?: string;
}

export interface PostpartumCare {
  id: string;
  litter_id?: string;
  puppy_id?: string;
  date: string;
  dam_temperature?: number;
  dam_appetite?: string;
  dam_hydration?: string;
  dam_discharge?: string;
  dam_milk_production?: string;
  dam_behavior?: string;
  puppies_nursing?: boolean;
  all_puppies_nursing?: boolean;
  puppy_weights_recorded?: boolean;
  weight_concerns?: string;
  notes?: string;
  created_at: string;
  created_by?: string;
  care_type?: string;
  care_time?: string;
  performed_by?: string;
}

export interface WelpingStepperProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onLitterCreated: (litterId: string) => void;
}
