
import { DogCareStatus } from '@/types/dailyCare';
import { MedicationFrequency } from '@/utils/medicationUtils';

export interface MedicationInfo {
  id: string;
  name: string;
  lastAdministered: string;
  frequency: MedicationFrequency;
  notes?: string;
  isPreventative: boolean;
  startDate: string;    // Added this property to support medication status checks
  endDate?: string | null; // Added this property to support medication status checks
}

export interface ProcessedMedicationLogs {
  [dogId: string]: {
    preventative: MedicationInfo[];
    other: MedicationInfo[];
  };
}

export interface MedicationsLogProps {
  dogs: DogCareStatus[];
  onRefresh: () => void;
}
