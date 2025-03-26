
export interface FeedingSchedule {
  id: string;
  dog_id: string;
  food_type: string;
  amount: string;
  unit: 'cups' | 'grams' | 'oz' | 'lbs' | 'kg';
  schedule_time: string[];
  special_instructions?: string;
  created_at: string;
  updated_at: string;
  active: boolean;
}

export interface FeedingRecord {
  id: string;
  schedule_id?: string;
  dog_id: string;
  timestamp: string;
  food_type: string;
  amount_offered: string;
  amount_consumed?: string;
  staff_id: string;
  notes?: string;
  created_at: string;
}

export interface FeedingHistoryFilters {
  dogId?: string;
  startDate?: Date;
  endDate?: Date;
  foodType?: string;
}
