
import { Puppy } from '@/components/litters/puppies/types';

export interface PuppyWithAge extends Puppy {
  age?: number;
  ageInWeeks?: number;
  ageGroup?: string;
  developmentalStage?: string;
  weightHistory?: PuppyWeightRecord[];
}

export interface PuppyWeightRecord {
  id: string;
  puppy_id: string;
  weight: number;
  weight_unit: string;
  date: string;
  age_days?: number;
  notes?: string;
  created_at: string;
}

export interface PuppyChartData {
  age: number;
  weight: number;
  weightUnit: string;
  date: string;
}

export interface PuppyAgeGroup {
  id: string;
  name: string;
  ageRangeStart: number;
  ageRangeEnd: number;
  description?: string;
  color: string;
}

export interface PuppyAgeGroupData {
  ageGroup: PuppyAgeGroup;
  puppies: PuppyWithAge[];
}

export interface PuppyManagementStats {
  totalPuppies: number;
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  maleCount: number;
  femaleCount: number;
  averageWeight?: number;
  weightUnit?: string;
  youngestAge?: number;
  oldestAge?: number;
  upcomingVaccinations?: number;
}
