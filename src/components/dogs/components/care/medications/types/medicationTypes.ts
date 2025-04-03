
import { MedicationStatus, MedicationStatusResult } from '@/utils/medicationUtils';

export interface MedicationInfo {
  id: string;
  name: string;
  dosage?: number;
  dosage_unit?: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  lastAdministered?: string;
  notes?: string;
  isPreventative: boolean;
}

export interface MedicationLogFormValues {
  medication_id: string;
  administered_at: string;
  administered_by: string;
  notes?: string;
}

export interface MedicationDisplayProps {
  dogId: string;
  medicationName: string;
  status: MedicationStatus | MedicationStatusResult;
  lastAdministered?: string;
  frequency?: string;
  dosage?: string;
  route?: string;
  notes?: string;
  onLogAdministration?: () => void;
}
