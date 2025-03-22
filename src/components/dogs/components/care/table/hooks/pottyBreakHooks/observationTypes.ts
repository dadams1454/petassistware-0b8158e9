
export type ObservationType = {
  id: string;
  dog_id: string;
  created_at: string;
  observation: string;
  observation_type: 'accident' | 'heat' | 'behavior' | 'feeding' | 'other';
  created_by: string;
  expires_at: string;
  timeSlot?: string; // Add time slot to track when the observation occurred
  category?: string;  // Add category to differentiate feeding observations
}

export type ObservationsMap = Record<string, ObservationType[]>;
