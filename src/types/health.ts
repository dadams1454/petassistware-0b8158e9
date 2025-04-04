
// Health record types
export enum HealthRecordTypeEnum {
  Examination = 'examination',
  Vaccination = 'vaccination',
  Medication = 'medication',
  Surgery = 'surgery',
  Laboratory = 'laboratory',
  Imaging = 'imaging',
  Dental = 'dental',
  Allergy = 'allergy',
  Emergency = 'emergency',
  Preventive = 'preventive',
  Wellness = 'wellness',
  Consultation = 'consultation',
  Prescription = 'prescription',
  Treatment = 'treatment',
  Therapy = 'therapy',
  Grooming = 'grooming',
  Parasite = 'parasite',
  Injury = 'injury',
  Specialist = 'specialist',
  Hospice = 'hospice',
  Euthanasia = 'euthanasia',
  Nutrition = 'nutrition',
  Reproduction = 'reproduction',
  Behavior = 'behavior',
  Other = 'other'
}

// Health status enums
export enum AppetiteEnum {
  Normal = 'normal',
  Increased = 'increased',
  Decreased = 'decreased',
  None = 'none'
}

export enum EnergyEnum {
  Normal = 'normal',
  High = 'high',
  Low = 'low',
  Lethargic = 'lethargic'
}

export enum StoolConsistencyEnum {
  Normal = 'normal',
  Soft = 'soft',
  Diarrhea = 'diarrhea',
  Hard = 'hard',
  None = 'none'
}

// Weight units
export type WeightUnit = 'lb' | 'kg' | 'g' | 'oz';

// Medication status and frequency enums
export enum MedicationStatus {
  active = 'active',
  upcoming = 'upcoming',
  overdue = 'overdue',
  completed = 'completed'
}

export enum MedicationFrequency {
  DAILY = 'daily',
  TWICE_DAILY = 'twice_daily',
  THREE_TIMES_DAILY = 'three_times_daily',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUALLY = 'annually',
  AS_NEEDED = 'as_needed',
  ONE_TIME = 'one_time'
}

// Status result types
export type MedicationStatusResult = {
  status: MedicationStatus;
  nextDue?: Date | string;
};

// Main health record type
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum;
  title: string;
  date: string;
  visit_date?: string;
  vet_name?: string;
  findings?: string;
  recommendations?: string;
  notes?: string;
  description?: string;
  follow_up_date?: string;
  next_due_date?: string;
  document_url?: string;
  created_at?: string;
  
  // Vaccination specific
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  
  // Medication specific
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  administration_route?: string;
  start_date?: string;
  end_date?: string;
  duration?: number;
  duration_unit?: string;
  prescription_number?: string;
  
  // Surgery specific
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
}

// Weight record
export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: string;
  unit?: WeightUnit;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at?: string;
  age_days?: number;
  birth_date?: string;
}

// Health indicator type
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite?: AppetiteEnum;
  energy_level?: EnergyEnum;
  stool_consistency?: StoolConsistencyEnum;
  water_intake?: string;
  notes?: string;
  created_by?: string;
  created_at?: string;
  abnormal?: boolean;
  alert_generated?: boolean;
}

// Medication
export interface Medication {
  id: string;
  dog_id: string;
  name: string;
  dosage?: number;
  dosage_unit?: string;
  frequency: string;
  administration_route?: string;
  start_date: string;
  end_date?: string;
  active: boolean;
  last_administered?: string;
  notes?: string;
  created_at?: string;
}

// Medication administration
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  administered_date: string;
  administered_by: string;
  dosage?: number;
  dosage_unit?: string;
  notes?: string;
  created_at?: string;
}

// Health certificate
export interface HealthCertificate {
  id: string;
  dog_id: string;
  puppy_id?: string;
  certificate_type: string;
  issue_date: string;
  expiry_date?: string;
  issuing_vet: string;
  certificate_number: string;
  file_url?: string;
  notes?: string;
  created_at?: string;
  created_by?: string;
}

// Utility function to map a database record to a health record
export const mapToHealthRecord = (record: any): HealthRecord => {
  return {
    id: record.id,
    dog_id: record.dog_id,
    record_type: record.record_type as HealthRecordTypeEnum,
    title: record.title || '',
    date: record.date || record.visit_date,
    visit_date: record.visit_date,
    vet_name: record.vet_name || '',
    findings: record.findings,
    recommendations: record.recommendations,
    notes: record.notes || record.record_notes,
    description: record.description,
    follow_up_date: record.follow_up_date,
    next_due_date: record.next_due_date,
    document_url: record.document_url,
    created_at: record.created_at,
    
    // Vaccination specific
    vaccine_name: record.vaccine_name,
    manufacturer: record.manufacturer,
    lot_number: record.lot_number,
    expiration_date: record.expiration_date,
    
    // Medication specific
    medication_name: record.medication_name,
    dosage: record.dosage,
    dosage_unit: record.dosage_unit,
    frequency: record.frequency,
    administration_route: record.administration_route,
    start_date: record.start_date,
    end_date: record.end_date,
    duration: record.duration,
    duration_unit: record.duration_unit,
    prescription_number: record.prescription_number,
    
    // Surgery specific
    procedure_name: record.procedure_name,
    surgeon: record.surgeon,
    anesthesia_used: record.anesthesia_used,
    recovery_notes: record.recovery_notes
  };
};
