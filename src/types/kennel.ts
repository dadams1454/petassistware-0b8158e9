
export interface KennelUnit {
  id: string;
  name: string;
  unit_type: string;
  location: string | null;
  capacity: number;
  size: string | null;
  features: string[] | null;
  notes: string | null;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  created_at: string;
}

export interface KennelAssignment {
  id: string;
  kennel_unit_id: string;
  dog_id: string;
  start_date: string;
  end_date: string | null;
  notes: string | null;
  created_at: string;
  created_by: string | null;
  dog?: {
    name: string;
    breed: string;
    gender: string;
  };
  kennel_unit?: {
    name: string;
    unit_type: string;
    location: string;
  };
}

export interface KennelCleaning {
  id: string;
  kennel_unit_id: string;
  cleaned_by: string;
  cleaning_date: string;
  cleaning_type: string;
  products_used: string[] | null;
  notes: string | null;
  created_at: string;
  kennel_unit?: {
    name: string;
  };
}

export interface KennelMaintenance {
  id: string;
  kennel_unit_id: string;
  maintenance_type: string;
  description: string;
  performed_by: string;
  maintenance_date: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'deferred';
  cost: number | null;
  notes: string | null;
  created_at: string;
  kennel_unit?: {
    name: string;
  };
}

export interface KennelCleaningSchedule {
  id: string;
  kennel_unit_id: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  day_of_week: number[] | null;
  time_of_day: string | null;
  assigned_to: string | null;
  created_at: string;
  kennel_unit?: {
    name: string;
  };
}

export type KennelUnitStatus = 'available' | 'occupied' | 'maintenance' | 'cleaning';
export type CleaningType = 'daily' | 'deep' | 'sanitize';
export type MaintenanceType = 'repair' | 'inspection' | 'upgrade';
export type CleaningFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly';
