
import { Puppy } from "@/components/litters/puppies/types";

export type PuppyAgeGroup = 
  | 'first24hours' 
  | 'first48hours' 
  | 'first7days'
  | 'week2' 
  | 'week3to4' 
  | 'week5to7'
  | 'week8to10' 
  | 'over10weeks';

export interface PuppyWithAge extends Puppy {
  ageInDays: number;
  ageGroup: PuppyAgeGroup;
}

export interface PuppyAgeGroupData {
  id: PuppyAgeGroup;
  label: string;
  description: string;
  daysRange: {
    min: number;
    max: number | null;
  };
  key: string;
  milestones: string[];
  criticalTasks: string[];
}

export interface PuppyCareTask {
  id: string;
  taskName: string;
  ageGroup: PuppyAgeGroup;
  isRequired: boolean;
  description?: string;
  frequency: 'daily' | 'weekly' | 'once' | 'custom';
  lastCompleted?: Date | null;
}
