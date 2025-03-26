
import { DogCareStatus, DailyCarelog, MedicationLogFormData } from '@/types/dailyCare';
import { MedicationFrequency, MedicationStatus } from '@/utils/medicationUtils';

export interface MedicationInfo {
  name: string;
  lastAdministered: string | null;
  frequency: MedicationFrequency;
}

export interface MedicationsLogProps {
  dogs: DogCareStatus[];
  onRefresh: () => void;
}

export interface ProcessedMedicationLogs {
  [dogId: string]: {
    preventative: MedicationInfo[];
    other: MedicationInfo[];
  };
}

export interface MedicationStatusDisplayProps {
  status: MedicationStatus | 'incomplete';
  statusColor: string;
  label?: string;
}

export interface MedicationsTabProps {
  dogStatuses: DogCareStatus[] | null;
  onRefreshDogs: () => void;
}

export interface MedicationFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export interface MedicationHeaderProps {
  title: string;
  description: string;
}
