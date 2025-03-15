
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
  dog_id: string;
  category: string;
  task_name: string;
  timestamp: Date;
  notes?: string;
  flags?: DogFlag[];
}

interface DogFlag {
  type: 'in_heat' | 'incompatible' | 'special_attention' | 'other';
  value?: string;
  incompatible_with?: string[];
}

interface DogCareStatus {
  dog_id: string;
  dog_name: string;
  dog_photo?: string;
  breed: string;
  color: string;
  last_care: {
    category: string;
    task_name: string;
    timestamp: string;
  } | null;
  flags: DogFlag[];
}

