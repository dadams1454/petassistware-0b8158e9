
import { ObservationsMap } from './observationTypes';

export interface ObservationsContextValue {
  observations: ObservationsMap;
  addObservation: (
    dogId: string, 
    observationText: string, 
    observationType: 'accident' | 'heat' | 'behavior' | 'feeding' | 'other',
    timeSlot?: string,
    category?: string,
    timestamp?: Date
  ) => Promise<boolean>;
  hasObservation: (dogId: string, timeSlot?: string, activeCategory?: string) => boolean;
  getObservationDetails: (dogId: string, activeCategory?: string) => { 
    text: string; 
    type: string; 
    timeSlot?: string; 
    category?: string 
  } | null;
  fetchObservations: () => Promise<ObservationsMap>;
  isLoading: boolean;
}
