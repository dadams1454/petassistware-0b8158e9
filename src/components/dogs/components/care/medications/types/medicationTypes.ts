
import { Medication } from '@/types/health';

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
}

// Props for LastMedicationInfo component
export interface LastMedicationInfoProps {
  medication: Medication;
  lastAdministeredDate?: string;
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
}

// Props for MedicationHeader component
export interface MedicationHeaderProps {
  title: string;
  count: number;
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
  setOpen: (open: boolean) => void;
  onOpenChange: (open: boolean) => void;
  cycle: HeatCycle;
  onSave: (cycle: HeatCycle) => Promise<void>;
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
