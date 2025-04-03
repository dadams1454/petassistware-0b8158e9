
import { MedicationStatus, MedicationStatusResult } from '@/types/health';

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
  medication_name?: string;
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
  status: MedicationStatus | MedicationStatusResult | string;
  lastAdministered?: string;
  frequency?: string;
  dosage?: string;
  route?: string;
  notes?: string;
  onLogAdministration?: () => void;
}

export interface MedicationsLogProps {
  dogId?: string;
  dogs?: DogCareStatus[];
  onRefresh?: () => void;
}

export interface DogInfoProps {
  dogId: string;
  dogName?: string;
  dogPhoto?: string;
  breed?: string;
  showPhoto?: boolean;
}

export interface LastMedicationInfoProps {
  dogId: string;
  medicationName?: string;
  name?: string;
  lastAdministered?: string;
  frequency?: string;
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
  description?: string;
  isLoading?: boolean;
  action?: React.ReactNode;
}

export interface ProcessedMedicationLogs {
  [dogId: string]: {
    preventative: MedicationInfo[];
    other: MedicationInfo[];
  };
}

export interface DogCareStatus {
  dog_id: string;
  dog_name: string;
  dog_photo?: string;
  breed?: string;
  last_medication?: string;
  last_medication_date?: string;
}
