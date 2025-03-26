
import { DogCareStatus, DailyCarelog, MedicationLogFormData } from '@/types/dailyCare';
import { MedicationFrequency } from '@/utils/medicationUtils';

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
