
import { Medication } from '@/types/health';
import { MedicationStatusResult, MedicationStatusDetail } from '@/types/medication-status';

// Props for the MedicationsLog component
export interface MedicationsLogProps {
  dogId?: string;
  onRefresh?: () => void;
}

// Props for the DogInfo component
export interface DogInfoProps {
  dogId: string;
  dogName?: string;
  breed?: string;
  photoUrl?: string;
  dogPhoto?: string; // Added for backward compatibility
}

// Basic medication information interface
export interface MedicationInfo {
  id: string;
  name: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  start_date?: string;
  end_date?: string;
  status?: MedicationStatusResult;
  lastAdministered?: string;
  notes?: string;
  nextDue?: string | Date | null;
  message?: string;
}

// Props for LastMedicationInfo component
export interface LastMedicationInfoProps {
  medication: Medication;
  lastAdministeredDate?: string;
  // For backward compatibility:
  name?: string;
  lastAdministered?: string; 
  frequency?: string;
}

// Props for MedicationCard component
export interface MedicationCardProps {
  dogId: string;
  preventativeMeds: Medication[];
  otherMeds: Medication[];
  onSuccess?: () => void;
}

// Props for MedicationFilter component
export interface MedicationFilterProps {
  activeFilter: string;
  onChange: (filter: string) => void;
  counts: {
    all: number;
    preventative: number;
    other: number;
  };
  value?: string; // Added for backward compatibility
}

// Props for MedicationHeader component
export interface MedicationHeaderProps {
  title: string;
  count: number;
  description?: string; // Added for backward compatibility
  isLoading?: boolean; // Added for backward compatibility
}

// Heat intensity type for breeding
export enum HeatIntensityType {
  MILD = 'mild',
  MODERATE = 'moderate',
  STRONG = 'strong'
}

// Heat cycle interface
export interface HeatCycle {
  id: string;
  dog_id: string;
  cycle_number: number;
  start_date: string;
  end_date: string;
  cycle_length: number;
  intensity: HeatIntensityType;
  symptoms: string[];
  notes: string;
  fertility_indicators: any;
  recorded_by: string;
  created_at: string;
  updated_at: string;
}

// Props for HeatCycleDialog
export interface HeatCycleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cycle?: HeatCycle;
  dogId: string;
  cycleNumber?: number;
  onSave: (cycle: any) => Promise<void>;
}

// Props for DatePicker component
export interface DatePickerProps {
  selected: Date;
  onSelect: (date: Date) => void;
  onChange?: (date: Date) => void;
  date?: Date;
  placeholder?: string;
  className?: string;
  mode?: string;
}

// Care status interfaces
export interface DogCareStatus {
  id: string;
  name: string;
  dog_id: string;
  dog_name?: string; // For compatibility
  status: string;
  last_updated: string;
  flags?: string[]; // For compatibility
}
