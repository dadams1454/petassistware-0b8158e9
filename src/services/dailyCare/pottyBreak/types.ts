
export interface PottyBreakCreate {
  dogs: string[];
  notes?: string;
}

export interface PottyBreakSession {
  id: string;
  session_time: string;
  notes?: string;
  created_at: string;
  created_by?: string | null;
  dogs?: any[];
}

export interface PottyBreak {
  id: string;
  date: string;
  time: string;
  notes?: string;
  created_at: string;
  potty_break_dogs?: any[];
}

export interface PottyBreakDog {
  id: string;
  dog_id: string;
  session_id: string;
  created_at: string;
}
