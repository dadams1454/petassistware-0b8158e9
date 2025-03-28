
import { Puppy } from '@/components/litters/puppies/types';

export interface PuppyWithAge extends Puppy {
  ageInDays: number;
  litters?: {
    id: string;
    name: string;
    whelping_date: string;
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
