
import { 
  HealthRecordType, 
  AppetiteLevel, 
  EnergyLevel, 
  StoolConsistency,
  MedicationStatusResult
} from './health-enums';
import { WeightUnit } from './weight-units';

export interface HealthRecord {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  record_type: HealthRecordType;
  description: string;
  date: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at?: string;
  
  // For examination records
  appetite?: AppetiteLevel;
  energy?: EnergyLevel;
  stool_consistency?: StoolConsistency;
  temperature?: number;
  weight?: number;
  weight_unit?: WeightUnit;
  
  // For vaccination records
  vaccine_name?: string;
  vaccine_lot?: string;
  next_due_date?: string;
  
  // For medication records
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  duration?: number;
  duration_unit?: string;
  
  // For surgical records
  procedure_name?: string;
  recovery_time?: number;
  recovery_unit?: string;
  
  // Metadata
  files?: string[];
  tags?: string[];
}

export interface Medication {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  name: string;
  dosage?: number;
  dosage_unit?: string;
  frequency: string;
  start_date?: string;
  end_date?: string;
  instructions?: string;
  is_preventative?: boolean;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface MedicationAdministration {
  id: string;
  medication_id: string;
  administered_at: string;
  administered_by?: string;
  notes?: string;
  dosage_given?: number;
  dosage_unit?: string;
  created_at: string;
}

export interface HealthIndicator {
  id: string;
  name: string;
  value: number | string;
  unit?: string;
  date: string;
  dog_id?: string;
  puppy_id?: string;
  created_at: string;
}
