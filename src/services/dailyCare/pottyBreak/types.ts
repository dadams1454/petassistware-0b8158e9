
export interface PottyBreakSession {
  id: string;
  session_time: string;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  dogs?: PottyBreakDog[];
}

export interface PottyBreakDog {
  id: string;
  session_id: string;
  dog_id: string;
  created_at: string;
  dog?: {
    name: string;
    photo_url?: string;
    breed?: string;
    color?: string;
  };
}

export interface PottyBreakCreate {
  notes?: string;
  dogs: string[]; // Array of dog IDs
}
