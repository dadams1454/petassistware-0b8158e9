
export interface WelpingLog {
  id: string;
  litter_id: string;
  event_type: string;
  timestamp: string;
  puppy_id?: string;
  notes?: string;
  puppy_details?: any;
  created_at: string;
}

export interface WelpingObservation {
  id: string;
  welping_record_id: string;
  observation_time: string;
  observation_type: string;
  description: string;
  puppy_id?: string;
  action_taken?: string;
  created_at: string;
}

export interface PostpartumCare {
  id: string;
  litter_id?: string;
  puppy_id?: string;
  date: string;
  dam_temperature?: number;
  dam_appetite?: string;
  dam_hydration?: string;
  dam_discharge?: string;
  dam_milk_production?: string;
  dam_behavior?: string;
  puppies_nursing?: boolean;
  all_puppies_nursing?: boolean;
  puppy_weights_recorded?: boolean;
  weight_concerns?: string;
  notes?: string;
  created_at: string;
  created_by?: string;
  care_type?: string;
  care_time?: string;
  performed_by?: string;
}
