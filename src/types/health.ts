
export enum HealthRecordTypeEnum {
  VACCINATION = 'VACCINATION',
  EXAMINATION = 'EXAMINATION',
  MEDICATION = 'MEDICATION',
  SURGERY = 'SURGERY',
  OBSERVATION = 'OBSERVATION',
  DEWORMING = 'DEWORMING',
  GROOMING = 'GROOMING',
  DENTAL = 'DENTAL',
  ALLERGY = 'ALLERGY',
  TEST = 'TEST',
  OTHER = 'OTHER'
}

// Aliases for backward compatibility
HealthRecordTypeEnum.Vaccination = HealthRecordTypeEnum.VACCINATION;
HealthRecordTypeEnum.Examination = HealthRecordTypeEnum.EXAMINATION;
HealthRecordTypeEnum.Medication = HealthRecordTypeEnum.MEDICATION;
HealthRecordTypeEnum.Surgery = HealthRecordTypeEnum.SURGERY;
HealthRecordTypeEnum.Observation = HealthRecordTypeEnum.OBSERVATION;
HealthRecordTypeEnum.Deworming = HealthRecordTypeEnum.DEWORMING;
HealthRecordTypeEnum.Grooming = HealthRecordTypeEnum.GROOMING;
HealthRecordTypeEnum.Dental = HealthRecordTypeEnum.DENTAL;
HealthRecordTypeEnum.Allergy = HealthRecordTypeEnum.ALLERGY;
HealthRecordTypeEnum.Test = HealthRecordTypeEnum.TEST;
HealthRecordTypeEnum.Other = HealthRecordTypeEnum.OTHER;

export enum AppetiteLevelEnum {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR',
  NONE = 'NONE'
}

// Aliases for backward compatibility
AppetiteLevelEnum.Excellent = AppetiteLevelEnum.EXCELLENT;
AppetiteLevelEnum.Good = AppetiteLevelEnum.GOOD;
AppetiteLevelEnum.Fair = AppetiteLevelEnum.FAIR;
AppetiteLevelEnum.Poor = AppetiteLevelEnum.POOR;
AppetiteLevelEnum.None = AppetiteLevelEnum.NONE;

export enum EnergyLevelEnum {
  HYPERACTIVE = 'HYPERACTIVE',
  VERY_HIGH = 'VERY_HIGH',
  HIGH = 'HIGH',
  NORMAL = 'NORMAL',
  LOW = 'LOW',
  VERY_LOW = 'VERY_LOW',
  LETHARGIC = 'LETHARGIC'
}

// Aliases for backward compatibility
EnergyLevelEnum.Hyperactive = EnergyLevelEnum.HYPERACTIVE;
EnergyLevelEnum.VeryHigh = EnergyLevelEnum.VERY_HIGH;
EnergyLevelEnum.High = EnergyLevelEnum.HIGH;
EnergyLevelEnum.Normal = EnergyLevelEnum.NORMAL;
EnergyLevelEnum.Low = EnergyLevelEnum.LOW;
EnergyLevelEnum.VeryLow = EnergyLevelEnum.VERY_LOW;
EnergyLevelEnum.Lethargic = EnergyLevelEnum.LETHARGIC;

export enum StoolConsistencyEnum {
  SOLID = 'SOLID',
  SEMI_SOLID = 'SEMI_SOLID',
  NORMAL = 'NORMAL',
  SOFT = 'SOFT',
  LOOSE = 'LOOSE',
  WATERY = 'WATERY',
  BLOODY = 'BLOODY',
  MUCOUSY = 'MUCOUSY',
  HARD = 'HARD'
}

// Aliases for backward compatibility
StoolConsistencyEnum.Normal = StoolConsistencyEnum.NORMAL;
StoolConsistencyEnum.Soft = StoolConsistencyEnum.SOFT;
StoolConsistencyEnum.Loose = StoolConsistencyEnum.LOOSE;
StoolConsistencyEnum.Watery = StoolConsistencyEnum.WATERY;
StoolConsistencyEnum.Hard = StoolConsistencyEnum.HARD;
StoolConsistencyEnum.Mucousy = StoolConsistencyEnum.MUCOUSY;
StoolConsistencyEnum.Bloody = StoolConsistencyEnum.BLOODY;
StoolConsistencyEnum.SemiSolid = StoolConsistencyEnum.SEMI_SOLID;
StoolConsistencyEnum.Solid = StoolConsistencyEnum.SOLID;

export interface HealthRecord {
  id: string;
  dog_id?: string;
  record_type: HealthRecordTypeEnum;
  title?: string;
  visit_date: string;
  vet_name: string;
  vet_clinic?: string;
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  next_due_date?: string;
  follow_up_date?: string;
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  duration?: number;
  duration_unit?: string;
  frequency?: string;
  administration_route?: string;
  start_date?: string;
  end_date?: string;
  prescription_number?: string;
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
  document_url?: string;
  record_notes?: string;
  description?: string;
  reminder_sent?: boolean;
  created_at?: string;
  performed_by?: string;
}

export interface WeightData {
  id: string;
  date: string;
  weight: number;
  unit: string;
  ageInDays?: number;
  notes?: string;
}

export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite?: AppetiteLevelEnum;
  energy?: EnergyLevelEnum;
  stool_consistency?: StoolConsistencyEnum;
  notes?: string;
  abnormal?: boolean;
  alert_generated?: boolean;
  created_at?: string;
  created_by?: string;
}

export interface VaccinationData {
  id: string;
  dog_id: string;
  vaccination_type: string;
  vaccination_date: string;
  notes?: string;
  created_at: string;
}
