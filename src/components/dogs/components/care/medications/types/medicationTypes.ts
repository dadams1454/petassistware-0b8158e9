
import { DogCareStatus } from '@/types/dailyCare';
import { MedicationFrequency, MedicationStatus } from '@/utils/medicationUtils';

// Information about a medication
export interface MedicationInfo {
  name: string;
  lastAdministered?: string;
  frequency: MedicationFrequency;
}

// Processed medication logs grouped by type
export interface ProcessedMedicationLogs {
  [dogId: string]: {
    preventative: MedicationInfo[];
    other: MedicationInfo[];
  };
}

// Props for the medications log component
export interface MedicationsLogProps {
  dogs: DogCareStatus[];
  onRefresh: () => void;
}

// Props for the medications tab component
export interface MedicationsTabProps {
  dogStatuses: DogCareStatus[] | null;
  onRefreshDogs: () => void;
}

// Props for the medication card component
export interface MedicationCardProps {
  dog: DogCareStatus;
  preventativeMeds: MedicationInfo[];
  otherMeds: MedicationInfo[];
  onSuccess: () => void;
}

// Props for the header component
export interface MedicationHeaderProps {
  title: string;
  description: string;
  isLoading?: boolean;
}

// Props for status display component
export interface MedicationStatusDisplayProps {
  status: MedicationStatus | 'incomplete';
  statusColor: string;
  label?: string;
  isLoading?: boolean;
}

// Props for dog info component
export interface DogInfoProps {
  dogName: string;
  dogPhoto: string | null;
  breed: string | null;
}

// Props for last medication info component
export interface LastMedicationInfoProps {
  name: string;
  lastAdministered?: string;
  frequency: MedicationFrequency;
}

// Props for medication filter component
export interface MedicationFilterProps {
  value: string;
  onChange: (value: string) => void;
}
