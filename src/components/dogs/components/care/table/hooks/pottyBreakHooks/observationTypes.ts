
// Observation types for the potty breaks and other care activities

// Observation types
export type ObservationType = 'health' | 'behavior' | 'activity' | 'medication' | 'feeding' | 'weight' | 'milestone' | 'other';

// Observation record interface
export interface ObservationRecord {
  id?: string;
  dog_id: string;
  dog_name?: string;
  category: string;
  observation: string;
  observation_type: ObservationType;
  created_at: string;
  created_by?: string;
  timestamp?: string;
  time_slot?: string;
}

// Observation summary interface for displaying grouped observations
export interface ObservationSummary {
  count: number;
  type: ObservationType;
  lastObservation: string;
  timestamp: string;
}

// Grouped observations by dog
export interface GroupedObservations {
  [dogId: string]: ObservationRecord[];
}

// Observation context properties
export interface ObservationContextProps {
  observations: GroupedObservations;
  addObservation: (dogId: string, observation: string, observationType: ObservationType) => Promise<void>;
  getObservations: (dogId: string, category?: string) => ObservationRecord[];
  hasObservation: (dogId: string, category: string, timeSlot?: string) => boolean;
  getObservationSummary: (dogId: string, category: string) => ObservationSummary | null;
  clearObservations: () => void;
}
