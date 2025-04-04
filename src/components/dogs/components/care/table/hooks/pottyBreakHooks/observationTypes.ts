
export type ObservationType = 
  | 'accident' 
  | 'heat' 
  | 'behavior' 
  | 'other' 
  | 'health'
  | 'activity'
  | 'medication'
  | 'feeding'
  | 'weight'
  | 'milestone';

export interface ObservationRecord {
  id: string;
  dog_id: string;
  observation: string;
  observation_type: ObservationType;
  created_at: string;
  created_by?: string;
  timeSlot: string;
  category: string;
  expires_at?: string; // Added for compatibility
}

export interface ObservationDetails {
  text: string;
  type: ObservationType;
  timeSlot: string;
  category: string;
}

export interface ObservationMap {
  [dogId: string]: ObservationRecord[];
}
