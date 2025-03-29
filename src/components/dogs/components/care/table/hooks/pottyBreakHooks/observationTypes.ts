
export interface ObservationRecord {
  id: string;
  dog_id: string;
  created_at: string;
  observation: string;
  observation_type: string;
  created_by: string;
  expires_at: string;
  timeSlot?: string;
  category?: string;
}

export interface ObservationMap {
  [dogId: string]: ObservationRecord[];
}

export interface ObservationDetails {
  text: string;
  type: string;
  timeSlot?: string;
  category?: string;
}
