
export type { PuppyWithAge, Puppy } from '@/types/puppy';

export type PuppyAgeGroup = 
  | 'newborn'
  | 'twoWeek'
  | 'fourWeek'
  | 'sixWeek'
  | 'eightWeek'
  | 'tenWeek'
  | 'twelveWeek'
  | 'older';

export interface PuppyAgeGroupInfo {
  id: PuppyAgeGroup;
  name: string;
  description: string;
  ageRange: string;
  minDays: number;
  maxDays: number;
  color: string;
}

export interface PuppyAgeGroupData {
  newborn: PuppyWithAge[];
  twoWeek: PuppyWithAge[];
  fourWeek: PuppyWithAge[];
  sixWeek: PuppyWithAge[];
  eightWeek: PuppyWithAge[];
  tenWeek: PuppyWithAge[];
  twelveWeek: PuppyWithAge[];
  older: PuppyWithAge[];
  all: PuppyWithAge[];
  total: number;
}

export interface PuppyManagementStats {
  puppies: PuppyWithAge[];
  ageGroups: PuppyAgeGroupInfo[];
  puppiesByAgeGroup: Record<string, PuppyWithAge[]>;
  byAgeGroup: PuppyAgeGroupData;
  totalPuppies: number;
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  maleCount: number;
  femaleCount: number;
  puppiesByStatus: Record<string, PuppyWithAge[]>;
  byGender: {
    male: number;
    female: number;
    unknown: number;
  };
  byStatus: {
    available: number;
    reserved: number;
    sold: number;
    unavailable: number;
  };
  activeCount: number;
  reservedCount: number;
  availableCount: number;
  soldCount: number;
  currentWeek: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<any>;
}
