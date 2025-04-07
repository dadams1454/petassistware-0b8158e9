
import { PuppyWithAge } from './puppy';
import { WeightUnit } from './weight-units';

// Age group definitions
export interface PuppyAgeGroup {
  id: string;
  name: string;
  displayName: string;
  description: string;
  minDays: number;
  maxDays: number;
  unit: 'days' | 'weeks';
  color: string;
  startDay: number;
  endDay: number;
  minAge: number;
  maxAge: number;
  milestones: string; // This is a string, not an array
}

// Enhanced info for age groups
export interface PuppyAgeGroupInfo {
  id: string;
  name: string;
  groupName: string;
  ageRange: string;
  description: string;
  startDay: number;
  endDay: number;
  color: string;
  milestones: string; // This is a string, not an array
  minAge: number;
  maxAge: number;
}

// Puppies organized by age group
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
}

// Complete puppy management statistics
export interface PuppyManagementStats {
  puppies: PuppyWithAge[];
  totalPuppies: number;
  ageGroups: PuppyAgeGroupInfo[];
  puppiesByAgeGroup: Record<string, PuppyWithAge[]>;
  byAgeGroup: PuppyAgeGroupData;
  byStatus: {
    available: number;
    reserved: number;
    sold: number;
    unavailable: number;
  };
  byGender: {
    male: number;
    female: number;
    unknown: number;
  };
  activeCount: number;
  reservedCount: number;
  availableCount: number;
  soldCount: number;
  currentWeek: number;
  
  // Legacy properties
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  isLoading: boolean;
  error: any;
  
  // Extended statistics
  total: {
    count: number;
    male: number;
    female: number;
  };
}
