
export interface HealthRecord {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  record_type: HealthRecordTypeEnum;
  title: string;
  description?: string;
  visit_date: string;
  next_due_date?: string;
  vet_name?: string;
  document_url?: string;
  notes?: string;
  created_at?: string;
}

export enum HealthRecordTypeEnum {
  VACCINATION = 'vaccination',
  EXAMINATION = 'examination',
  MEDICATION = 'medication',
  SURGERY = 'surgery',
  TEST = 'test',
  OTHER = 'other'
}

export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg';

export interface WeightRecord {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at?: string;
}

export interface HealthMarker {
  status: 'clear' | 'carrier' | 'at_risk';
  description: string;
}

export interface HealthProfile {
  markers: Record<string, HealthMarker>;
  vaccinations: VaccinationRecord[];
  weights: WeightRecord[];
  conditions: HealthCondition[];
}

export interface VaccinationRecord {
  id: string;
  name: string;
  date: string;
  next_due?: string;
  notes?: string;
}

export interface HealthCondition {
  id: string;
  name: string;
  diagnosed_date: string;
  status: 'active' | 'managed' | 'resolved';
  notes?: string;
}
