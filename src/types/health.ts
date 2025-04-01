
export enum HealthRecordTypeEnum {
  Vaccination = 'Vaccination',
  Examination = 'Examination',
  Medication = 'Medication',
  Surgery = 'Surgery',
  Observation = 'Observation',
  Deworming = 'Deworming',
  Grooming = 'Grooming',
  Dental = 'Dental',
  Allergy = 'Allergy',
  Test = 'Test',
  Other = 'Other'
}

export enum WeightUnitEnum {
  Pounds = 'lbs',
  Kilograms = 'kg',
  Ounces = 'oz',
  Grams = 'g'
}

export type WeightUnit = 'lbs' | 'kg' | 'oz' | 'g';

export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum;
  title: string;
  description?: string;
  performed_by: string;
  visit_date?: string;
  date?: string;
  next_due_date?: string;
  record_notes?: string;
  document_url?: string;
  vet_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface WeightRecord {
  id: string;
  dog_id: string;
  date: string;
  weight: number;
  unit: WeightUnit;
  weight_unit?: WeightUnit;
  notes?: string;
  created_at: string;
}
