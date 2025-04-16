
import { 
  MedicationStatusEnum, 
  MedicationStatusResult 
} from '@/types/medication-status';
import { 
  Medication,
  MedicationAdministration
} from '@/types/health';

/**
 * Extended medication interface with computed values
 */
export interface MedicationWithStatus extends Medication {
  status: MedicationStatusResult;
  lastAdministered?: string;
  nextDue?: string | Date | null;
  administrations?: MedicationAdministration[];
}

/**
 * Medication form input values
 */
export interface MedicationFormValues {
  id?: string;
  name: string;
  dosage?: number;
  dosage_unit?: string;
  frequency: string;
  route?: string;
  start_date: string | Date;
  end_date?: string | Date;
  next_due?: string | Date;
  instructions?: string;
  is_prescription?: boolean;
  is_preventative?: boolean;
  notes?: string;
  paused?: boolean;
}

/**
 * Props for medication-related components
 */
export interface MedicationListProps {
  dogId: string;
  title?: string;
  showFilters?: boolean;
  onAdministered?: (medication: Medication) => void;
  onSuccess?: () => void;
}

export interface MedicationCardProps {
  medication: Medication | MedicationWithStatus;
  dogId?: string;
  showAdminister?: boolean;
  showActions?: boolean;
  onAdminister?: (medication: Medication) => void;
  onEdit?: (medication: Medication) => void;
  onDelete?: (medicationId: string) => void;
  onSuccess?: () => void;
}

export interface MedicationStatusProps {
  status: MedicationStatusResult;
  showLabel?: boolean;
  className?: string;
}

/**
 * Hook return types and options
 */
export interface UseMedicationsOptions {
  dogId?: string;
  puppyId?: string;
  includeCompleted?: boolean;
  includePreventative?: boolean;
  includeOther?: boolean;
}

export interface UseMedicationsResult {
  medications: MedicationWithStatus[];
  preventativeMeds: MedicationWithStatus[];
  otherMeds: MedicationWithStatus[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  administrations: Record<string, MedicationAdministration[]>;
  administeredCount: number;
  dueCount: number;
  overdueCount: number;
}

/**
 * Medication filter types
 */
export type MedicationFilterType = 'all' | 'preventative' | 'other' | 'due' | 'overdue';

export interface MedicationFilterCounts {
  all: number;
  preventative: number;
  other: number;
  due: number;
  overdue: number;
}

export interface MedicationFilterProps {
  activeFilter: MedicationFilterType;
  onChange: (filter: MedicationFilterType) => void;
  counts: MedicationFilterCounts;
  value?: string;
}

/**
 * Frequency constants
 */
export const MedicationFrequency = {
  DAILY: 'daily',
  ONCE_DAILY: 'once daily',
  TWICE_DAILY: 'twice daily',
  THREE_TIMES_DAILY: 'three times daily',
  EVERY_OTHER_DAY: 'every other day',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  ANNUALLY: 'annually',
  AS_NEEDED: 'as needed'
};
