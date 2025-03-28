
export interface DogLetOutCreate {
  dogs: string[];
  notes?: string;
}

export interface DogLetOutSession {
  id: string;
  session_time: string;
  notes?: string;
  created_at: string;
  created_by?: string | null;
  dogs?: any[];
}

export interface DogLetOut {
  id: string;
  date: string;
  time: string;
  notes?: string;
  created_at: string;
  dog_let_out_dogs?: any[];
}

export interface DogLetOutDog {
  id: string;
  dog_id: string;
  session_id: string;
  created_at: string;
}
