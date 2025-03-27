
import { ReactNode } from 'react';

export type CareCategory = 
  | 'potty' 
  | 'feeding' 
  | 'medication' 
  | 'grooming' 
  | 'exercise' 
  | 'wellness' 
  | 'training' 
  | 'notes' 
  | 'facility' 
  | 'puppy';

export interface CareCategoryDefinition {
  id: CareCategory;
  name: string;
  icon: ReactNode;
  description: string;
  color: string;
  frequency?: 'hourly' | 'daily' | 'weekly' | 'as-needed';
  hasNotes?: boolean;
  hasChecklist?: boolean;
}

export interface PuppyAgeGroup {
  id: string;
  name: string;
  ageRange: string;
  description: string;
  color: string;
  careItems: {
    name: string;
    description: string;
    required: boolean;
    frequency: 'hourly' | 'daily' | 'weekly' | 'as-needed';
  }[];
}

export interface CareLogBase {
  id: string;
  dog_id: string;
  timestamp: string;
  category: CareCategory;
  created_by: string;
  notes?: string;
  created_at: string;
}

export interface PottyLog extends CareLogBase {
  category: 'potty';
  potty_type?: 'urine' | 'stool' | 'both';
  stool_quality?: 'normal' | 'soft' | 'diarrhea' | 'hard';
}

export interface FeedingLog extends CareLogBase {
  category: 'feeding';
  food_type: string;
  amount: string;
  unit: string;
  consumed_amount?: string;
}

export interface MedicationLog extends CareLogBase {
  category: 'medication';
  medication_name: string;
  dosage: string;
  route: string;
  frequency: string;
  next_due_date?: string;
}

export interface GroomingLog extends CareLogBase {
  category: 'grooming';
  grooming_type: string;
}

export interface ExerciseLog extends CareLogBase {
  category: 'exercise';
  exercise_type: string;
  duration: number;
  intensity?: 'low' | 'moderate' | 'high';
}

export interface WellnessLog extends CareLogBase {
  category: 'wellness';
  check_type: string;
  findings?: string;
}

export interface TrainingLog extends CareLogBase {
  category: 'training';
  skill: string;
  progress: 'introduced' | 'practicing' | 'mastered';
}

export interface NotesLog extends CareLogBase {
  category: 'notes';
  title: string;
}

export interface FacilityLog extends CareLogBase {
  category: 'facility';
  task: string;
  completed: boolean;
}

export interface PuppyLog extends CareLogBase {
  category: 'puppy';
  age_group: string;
  weight?: string;
  temperature?: string;
  milestone?: string;
}

export type CareLog = 
  | PottyLog
  | FeedingLog
  | MedicationLog
  | GroomingLog
  | ExerciseLog
  | WellnessLog
  | TrainingLog
  | NotesLog
  | FacilityLog
  | PuppyLog;
