
export interface FeedingRecord {
  id: string;
  dog_id: string;
  food_type: string;
  amount_offered: string;
  amount_consumed: string;
  timestamp: string;
  created_at: string;
  notes?: string;
  staff_id: string;
  schedule_id?: string;
  meal_type: string;
  refused: boolean;
  created_by: string;
  category: string;
  task_name: string;
}

export interface FeedingSchedule {
  id: string;
  dog_id: string;
  food_type: string;
  amount: string;
  unit: string;
  schedule_time: string[];
  special_instructions?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeedingFormData {
  dog_id: string;
  food_type: string;
  amount_offered: string;
  amount_consumed: string;
  timestamp: string | Date;
  notes?: string;
  schedule_id?: string;
  meal_type?: string;
  refused?: boolean;
  staff_id?: string;
}

export interface FeedingScheduleFormData {
  dog_id: string;
  food_type: string;
  amount: string;
  unit: string;
  schedule_time: string[] | string;
  special_instructions?: string;
  active: boolean;
}

export interface FeedingStats {
  totalMeals: number;
  totalAmountConsumed: number;
  refusalRate: number;
  mealBreakdown: {
    [key: string]: number;
  };
  avgAmountOffered: number;
  mealsRefused: number;
}

export interface FeedingHistoryFilters {
  dogId?: string;
  startDate?: Date;
  endDate?: Date;
  foodType?: string;
}
