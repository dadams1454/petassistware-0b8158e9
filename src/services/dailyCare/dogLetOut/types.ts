
export interface DogGroup {
  id: string;
  name: string;
  description?: string;
  color?: string;
  dogIds?: string[]; // Adding the missing dogIds property
  dogsCount?: number;
  dogs?: Array<{
    id: string;
    name: string;
    photo_url?: string;
  }>;
  created_at?: string;
}

export interface DogLetOutTimeSlot {
  time: string;
  status: 'completed' | 'pending' | 'missed' | 'upcoming';
  dogIds?: string[];
  observations?: DogObservation[];
}

export interface DogObservation {
  id: string;
  dogId: string;
  type: string;
  timestamp: string;
  notes?: string;
  createdBy?: string;
}

export interface DogWithLetOutStatus {
  id: string;
  name: string;
  photo_url?: string;
  last_let_out?: string;
  status: 'ok' | 'warning' | 'danger';
  timeUntilNextBreak?: number;
  incompatibleWith?: string[];
  groups?: string[];
}
