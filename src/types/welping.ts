
import { Json } from '../integrations/supabase/types';

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
  observation_type: string;
  observation_time: string;
  description: string;
  puppy_id?: string;
  action_taken?: string;
  created_at?: string;
}

export interface PostpartumCare {
  id: string;
  puppy_id: string;
  care_type: string;
  care_time: string;
  notes: string;
  performed_by?: string;
  created_at?: string;
}

// For consistent error handling with whelping logs
export interface WelpingLogEntry extends WelpingLog {
  puppy_name?: string;
  event_description?: string;
}
