
export type HealthRecordType = 'examination' | 'vaccination' | 'medication' | 'surgery' | 'dental' | 'allergy' | 'test';

export type WeightUnit = 'g' | 'kg' | 'lbs' | 'oz';

export interface HealthRecord {
  id: string;
  dog_id: string;
  title: string;
  record_type: HealthRecordType;
  visit_date: string;
  next_due_date?: string;
  veterinarian?: string;
  clinic_name?: string;
  description?: string;
  document_url?: string;
  medication_name?: string;
  medication_dosage?: string;
  administration_route?: string;
  instructions?: string;
  duration?: number;
  created_at: string;
  updated_at?: string;
  status?: 'active' | 'completed' | 'cancelled';
  [key: string]: any; // Allow for additional dynamic properties
}

export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
}

export interface HealthTab {
  general: {
    lastExamDate: string | null;
    nextExamDate: string | null;
    weight: number;
    weightUnit: WeightUnit;
    allergies: string[];
    chronicConditions: string[];
  };
  vaccinations: {
    current: boolean;
    lastDate: string | null;
    nextDate: string | null;
    list: HealthRecord[];
  };
  medications: HealthRecord[];
  surgeries: HealthRecord[];
  examinations: HealthRecord[];
}

export interface HealthRecordCreateInput {
  dog_id: string;
  title: string;
  record_type: HealthRecordType;
  visit_date: string;
  next_due_date?: string;
  veterinarian?: string;
  clinic_name?: string;
  description?: string;
  medication_name?: string;
  medication_dosage?: string;
  administration_route?: string;
}
