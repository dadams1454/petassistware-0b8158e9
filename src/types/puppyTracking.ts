
import { Puppy } from '@/types/litter';

export interface PuppyWithAge extends Puppy {
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
  careChecks: string[];
}

export interface PuppyManagementStats {
  totalPuppies: number;
  activeLitters: number;
  upcomingVaccinations: number;
  recentWeightChecks: number;
}

// Add an alias for backward compatibility
export type PuppyStatistics = PuppyManagementStats;
