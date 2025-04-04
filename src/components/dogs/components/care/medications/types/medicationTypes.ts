
import { MedicationStatus } from '@/utils/medicationUtils';

export interface MedicationInfo {
  id: string;
  name: string;
  dosage?: string | number;
  frequency: string;
  lastAdministered: string;
  nextDue?: string;
  status?: string | MedicationStatus;
  notes?: string;
}

export interface ProcessedMedicationLogs {
  [dogId: string]: {
    preventative: MedicationInfo[];
    other: MedicationInfo[];
  }
}

export interface MedicationsLogProps {
  dogId?: string;
  onRefresh?: () => void;
}

export interface MedicationFilterProps {
  activeFilter: string;
  onChange: (filter: string) => void;
  counts?: {
    all: number;
    preventative: number;
    other: number;
  };
}

export interface MedicationHeaderProps {
  title: string;
  count: number;
  type: 'preventative' | 'other';
  onAdd?: () => void;
}

export interface DogCareStatus {
  dog_id: string;
  dog_name: string;
  dog_photo: string;
  breed: string;
  color?: string;
  sex?: string;
  last_care?: {
    category: string;
    task_name: string;
    timestamp: string;
  };
  flags?: string[];
}

export interface DogInfoProps {
  dogId: string;
  dogName: string;
  dogPhoto: string;
  breed: string;
}

export interface LastMedicationInfoProps {
  dogId: string;
  name: string;
  lastAdministered: string;
  frequency: string;
}
