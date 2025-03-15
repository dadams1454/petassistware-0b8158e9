
interface DailyCarelog {
  id: string;
  dog_id: string;
  created_by: string;
  category: string;
  task_name: string;
  timestamp: string;
  notes: string | null;
  created_at: string;
}

interface CareTaskPreset {
  id: string;
  category: string;
  task_name: string;
  is_default: boolean;
  breeder_id: string | null;
  created_at: string;
}

interface CareLogFormData {
  category: string;
  task_name: string;
  timestamp: Date;
  notes?: string;
  dog_id: string;
}
