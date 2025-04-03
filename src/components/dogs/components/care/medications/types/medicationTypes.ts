
import { MedicationFrequency, MedicationStatus, MedicationStatusResult } from '@/utils/medicationUtils';

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

export interface MedicationsLogProps {
  dogId: string;
  onRefresh?: () => void;
}

export interface DogInfoProps {
  dogId: string;
  dogName?: string;
  showPhoto?: boolean;
}

export interface LastMedicationInfoProps {
  dogId: string;
  medicationName: string;
  lastAdministered?: string;
}

export interface MedicationFilterProps {
  activeFilter: string;
  onChange: (filter: string) => void;
  counts: {
    all: number;
    preventative: number;
    other: number;
  };
}

export interface MedicationHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export interface ProcessedMedicationLogs {
  [dogId: string]: {
    preventative: MedicationInfo[];
    other: MedicationInfo[];
  };
}
