
import { ReactNode } from 'react';

export interface CareCategory {
  id: string;
  name: string;
  icon: ReactNode;
}

export interface TimeSlot {
  id: string;
  label: string;
  time: string;
}

export interface CareObservation {
  id: string;
  dogId: string;
  timeSlot: string;
  category: string;
  observationType: string;
  notes?: string;
  timestamp: Date;
}
