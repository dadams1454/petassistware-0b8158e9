
import { DogCareStatus } from '@/types/dailyCare';
import { MedicationFrequency, MedicationStatus, MedicationStatusResult } from '@/utils/medicationUtils';

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
  status: MedicationStatus | MedicationStatusResult | 'incomplete';
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
