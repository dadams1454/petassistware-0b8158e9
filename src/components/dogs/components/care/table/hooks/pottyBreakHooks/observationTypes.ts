
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
  | 'milestone'
  | 'potty'
  | 'exercise'
  | 'training'
  | 'grooming'
  | 'in_heat'
  | 'pregnant'
  | 'special_attention'
  | 'incompatible';

export interface ObservationRecord {
  id: string;
  dog_id: string;
  observation: string;
  observation_type: ObservationType;
  created_at: string;
  created_by?: string;
  timeSlot: string;
  category: string;
  expires_at?: string;
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
