
export enum HealthRecordTypeEnum {
  Vaccination = 'vaccination',
  Examination = 'examination',
  Medication = 'medication',
  Surgery = 'surgery',
  Observation = 'observation',
  Other = 'other'
}

export enum WeightUnitEnum {
  Pounds = 'lbs',
  Kilograms = 'kg',
  Ounces = 'oz',
  Grams = 'g'
}

export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum;
  title: string;
  description?: string;
  date: string; // ISO date format
  performed_by?: string;
  location?: string;
  next_due_date?: string;
  files?: string[];
  created_at: string;
  visit_date?: string;
  tags?: string[];
}

export interface VaccinationRecord extends HealthRecord {
  vaccine_type: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  administered_by?: string;
  route?: string;
  site?: string;
  dose?: string;
  next_dose_due?: string;
}

export interface MedicationRecord extends HealthRecord {
  medication_name: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  start_date?: string;
  end_date?: string;
  prescribed_by?: string;
  pharmacy?: string;
  prescription_number?: string;
  refills_remaining?: number;
}

export interface ExaminationRecord extends HealthRecord {
  exam_type: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
  examiner?: string;
  facility?: string;
}

export interface WeightRecord {
  id: string;
  dog_id: string;
  weight: number;
  unit: WeightUnitEnum;
  date: string;
  notes?: string;
}
