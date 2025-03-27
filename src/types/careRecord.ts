
import { DailyCarelog, DogFlag } from '@/types/dailyCare';

/**
 * Unified care record types to support all care categories consistently
 */

export type CareCategory = 
  | 'pottybreaks' 
  | 'feeding' 
  | 'medications' 
  | 'grooming' 
  | 'training' 
  | 'wellness' 
  | 'exercise' 
  | 'observation';

export interface CareRecord extends DailyCarelog {
  // Add extended fields for the unified care record model
  status?: 'completed' | 'scheduled' | 'missed';
  assigned_to?: string;
  completed_by?: string;
  scheduled_time?: string;
  outcome?: string;
  follow_up_needed?: boolean;
  follow_up_notes?: string;
  follow_up_date?: string;
  attachments?: string[];
}

export interface CareRecordFormData {
  dog_id: string;
  category: CareCategory;
  task_name: string;
  timestamp: Date;
  notes?: string;
  flags?: DogFlag[];
  status?: 'completed' | 'scheduled' | 'missed';
  assigned_to?: string;
  scheduled_time?: string;
  follow_up_needed?: boolean;
  follow_up_notes?: string;
  follow_up_date?: Date;
}

export interface CareRecordFilters {
  categories?: CareCategory[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: ('completed' | 'scheduled' | 'missed')[];
  staffMember?: string;
  searchText?: string;
}

export interface CareRecordStats {
  totalRecords: number;
  byCategory: Record<CareCategory, number>;
  byStatus?: Record<string, number>;
  completionRate?: number;
}

/**
 * Specialized types for different care categories
 */

export interface FeedingRecord extends CareRecord {
  food_type?: string;
  amount_offered?: string;
  amount_consumed?: string;
  meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  refused?: boolean;
}

export interface MedicationRecord extends CareRecord {
  medication_name?: string;
  dosage?: string;
  frequency?: string;
  route?: string;
  next_due_date?: string;
  prescription_id?: string;
}

export interface GroomingRecord extends CareRecord {
  grooming_type?: string;
  areas_treated?: string[];
  products_used?: string[];
}

export interface TrainingRecord extends CareRecord {
  training_type?: string;
  commands_practiced?: string[];
  duration?: number;
  progress_notes?: string;
}

export interface ExerciseRecord extends CareRecord {
  exercise_type?: string;
  duration?: number;
  intensity?: 'low' | 'medium' | 'high';
  distance?: number;
}

export interface ObservationRecord extends CareRecord {
  observation_type?: 'behavior' | 'health' | 'accident' | 'other';
  severity?: 'info' | 'concern' | 'urgent';
}
