
// If this file doesn't exist, we'll create it
export interface Dog {
  id: string;
  name: string;
  photoUrl?: string;  // Add this field
  gender: 'Male' | 'Female';
  is_pregnant?: boolean;
  last_heat_date?: string;
  tie_date?: string;
  breed?: string;
  color?: string;
  created_at?: string;
}

export interface Breeding {
  id: string;
  dam_id: string;
  sire_id: string;
  date: string;
  notes?: string;
  status: 'Planned' | 'Completed' | 'Failed';
}

export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string;
  notes?: string;
}
