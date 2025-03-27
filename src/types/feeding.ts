
import { CareRecord } from '@/types/careRecord';

/**
 * Types for the feeding management system
 */

export interface FeedingSchedule {
  id: string;
  dog_id: string;
  food_type: string;
  amount: string;
  unit: 'cups' | 'grams' | 'ounces' | 'tablespoons' | 'teaspoons';
  schedule_time: string[]; // Array of times (HH:MM)
  special_instructions?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeedingRecord extends CareRecord {
  food_type: string;
  amount_offered: string;
  amount_consumed: string;
  refused?: boolean;
  meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  schedule_id?: string;
}

export interface FeedingFormData {
  dog_id: string;
  food_type: string;
  amount_offered: string;
  amount_consumed?: string;
  refused?: boolean;
  meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  notes?: string;
  timestamp: Date;
  schedule_id?: string;
}

export interface FeedingScheduleFormData {
  dog_id: string;
  food_type: string;
  amount: string;
  unit: 'cups' | 'grams' | 'ounces' | 'tablespoons' | 'teaspoons';
  schedule_time: string[]; // Array of times (HH:MM)
  special_instructions?: string;
  active: boolean;
}

export interface FeedingStats {
  totalMeals: number;
  totalAmountConsumed: number;
  averageConsumption: number;
  mealsRefused: number;
  mealsByType: Record<string, number>;
}
