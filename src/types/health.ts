
// Health record types
export enum HealthRecordTypeEnum {
  EXAMINATION = 'examination',
  VACCINATION = 'vaccination',
  MEDICATION = 'medication',
  SURGERY = 'surgery',
  LABORATORY = 'laboratory',
  PREVENTIVE = 'preventative'
}

// Medication status enum
export enum MedicationStatusEnum {
  ACTIVE = 'active',
  SCHEDULED = 'scheduled',
  OVERDUE = 'overdue',
  NOT_STARTED = 'not_started',
  COMPLETED = 'completed',
  MISSED = 'missed',
  UNKNOWN = 'unknown'
}

// Appetite level enum
export enum AppetiteLevelEnum {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  NONE = 'none'
}

// Energy level enum
export enum EnergyLevelEnum {
  HYPERACTIVE = 'hyperactive',
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
  LETHARGIC = 'lethargic'
}

// Stool consistency enum
export enum StoolConsistencyEnum {
  NORMAL = 'normal',
  LOOSE = 'loose',
  DIARRHEA = 'diarrhea',
  HARD = 'hard',
  BLOODY = 'bloody',
  MUCUS = 'mucus'
}

// For compatibility with older code
export const AppetiteEnum = AppetiteLevelEnum;
export const EnergyEnum = EnergyLevelEnum;

// Health record interface
export interface HealthRecord {
  id: string;
  dog_id: string;
  visit_date: string;
  record_type: HealthRecordTypeEnum;
  title?: string;
  vet_name?: string;
  record_notes?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
  document_url?: string;
  created_at: string;
  next_due_date?: string;
  // For examinations
  examination_type?: string;
  // For vaccinations
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  // For medications
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
  // For surgeries
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
  // For preventative care
  reminder_sent?: boolean;
  performed_by?: string;
  description?: string;
}

// Weight record interfaces
export interface WeightRecord {
  id: string;
  dog_id: string;
  date: string;
  weight: number;
  weight_unit: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  puppy_id?: string;
  age_days?: number;
}

// Medication interfaces
export interface Medication {
  id: string;
  dog_id: string;
  name: string;
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency: string;
  administration_route: string;
  start_date: string;
  end_date?: string;
  last_administered?: string;
  active: boolean;
  is_active?: boolean;
  notes?: string;
  created_at: string;
}

export interface MedicationStatusResult {
  status: MedicationStatusEnum;
  isActive: boolean;
  isOverdue: boolean;
  isScheduled: boolean;
  nextDue: Date | null;
  daysUntilDue?: number;
  daysOverdue?: number;
}

// Health indicator interfaces
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite?: string;
  energy?: string;
  stool_consistency?: string;
  abnormal?: boolean;
  notes?: string;
  alert_generated?: boolean;
  created_at: string;
  created_by?: string;
}

export interface HealthAlert {
  id: string;
  dog_id: string;
  indicator_id: string;
  status: string;
  resolved: boolean;
  resolved_at?: string;
  created_at: string;
}

// Growth statistics interface
export interface GrowthStats {
  currentWeight?: number;
  previousWeight?: number;
  percentChange?: number;
  averageGrowthRate: number;
  projectedWeight: number;
  weightGoal: number;
  onTrack: boolean;
}

// Mapping helpers for health records
export const mapToHealthRecord = (data: any): HealthRecord => {
  return {
    id: data.id,
    dog_id: data.dog_id,
    visit_date: data.visit_date || data.date || new Date().toISOString().split('T')[0],
    record_type: data.record_type || HealthRecordTypeEnum.EXAMINATION,
    vet_name: data.vet_name || '',
    record_notes: data.record_notes || data.notes || '',
    findings: data.findings || '',
    recommendations: data.recommendations || '',
    follow_up_date: data.follow_up_date || '',
    document_url: data.document_url || '',
    created_at: data.created_at || new Date().toISOString(),
    // Any other fields from the original data...
    ...data
  };
};

export const mapToWeightRecord = (data: any): WeightRecord => {
  return {
    id: data.id || '',
    dog_id: data.dog_id || '',
    date: data.date || new Date().toISOString().split('T')[0],
    weight: data.weight || 0,
    weight_unit: data.weight_unit || data.unit || 'lb',
    notes: data.notes || '',
    percent_change: data.percent_change || 0,
    created_at: data.created_at || new Date().toISOString(),
    puppy_id: data.puppy_id || null,
    age_days: data.age_days || null
  };
};

// Helper to convert string to health record type
export const stringToHealthRecordType = (type: string): HealthRecordTypeEnum => {
  type = type.toLowerCase();
  switch (type) {
    case 'examination':
      return HealthRecordTypeEnum.EXAMINATION;
    case 'vaccination':
      return HealthRecordTypeEnum.VACCINATION;
    case 'medication':
      return HealthRecordTypeEnum.MEDICATION;
    case 'surgery':
      return HealthRecordTypeEnum.SURGERY;
    case 'laboratory':
      return HealthRecordTypeEnum.LABORATORY;
    case 'preventative':
      return HealthRecordTypeEnum.PREVENTIVE;
    default:
      return HealthRecordTypeEnum.EXAMINATION;
  }
};

// Health certificate
export interface HealthCertificate {
  id: string;
  puppy_id: string;
  certificate_type: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  file_url?: string;
  notes?: string;
  created_at: string;
}

// Medication administration
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  dog_id: string;
  administered_at: string;
  administered_by: string;
  notes?: string;
  created_at: string;
}
