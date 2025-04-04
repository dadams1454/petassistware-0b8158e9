
import { MedicationStatusEnum, MedicationStatusResult } from '@/types/health';

export interface MedicationInfo {
  id: string;
  name: string;
  dosage?: string | number;
  dosage_unit?: string;
  frequency: string;
  lastAdministered: string;
  nextDue?: string;
  status?: MedicationStatusEnum | string | MedicationStatusResult;
  notes?: string;
  isPreventative?: boolean;
  startDate?: string;
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
  value?: string;
}

export interface MedicationHeaderProps {
  title: string;
  count: number;
  type: 'preventative' | 'other';
  onAdd?: () => void;
  description?: string;
  isLoading?: boolean;
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
  incompatible_with?: string[];
  dog_weight?: number;
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

export interface MedicationCardProps {
  dogId: string;
  preventativeMeds: MedicationInfo[];
  otherMeds: MedicationInfo[];
  onSuccess: () => void;
}

export interface MedicationFormProps {
  dogId: string;
  onSave: (data: any) => Promise<boolean>;
  onCancel: () => void;
  isEditing?: boolean;
  initialData?: any;
}
