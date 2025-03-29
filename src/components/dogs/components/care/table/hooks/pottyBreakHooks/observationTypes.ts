
export interface ObservationRecord {
  id: string;
  dog_id: string;
  created_at: string;
  observation: string;
  observation_type: 'accident' | 'heat' | 'behavior' | 'other';
  created_by: string;
  expires_at: string;
  timeSlot: string;
  category: string;
}

export type ObservationType = 'accident' | 'heat' | 'behavior' | 'other';
export type ObservationsMap = Record<string, ObservationRecord[]>;
