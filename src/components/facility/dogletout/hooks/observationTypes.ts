
export interface Observation {
  id: string;
  dog_id: string;
  created_at: string;
  observation: string;
  observation_type: string;
  created_by: string;
  expires_at: string;
  timeSlot: string;
  category: string;
}

export interface ObservationsMap {
  [dogId: string]: Observation[];
}
