
import { WeightRecord } from '@/types/weight';
import { WeightUnit } from '@/types/weight-units';

/**
 * Common interfaces for weight-related components
 */

export interface WeightTrackerProps {
  puppyId?: string;
  dogId?: string;
  birthDate?: string;
  onAddSuccess?: () => void;
}

export interface WeightEntryFormProps {
  puppyId?: string;
  dogId?: string;
  birthDate?: string;
  onSuccess?: (record: WeightRecord) => void;
  onCancel?: () => void;
}

export interface WeightChartViewProps {
  puppyId?: string;
  dogId?: string;
  birthDate?: string;
  displayUnit: WeightUnit;
  weightRecords: WeightRecord[];
}

export interface WeightTableViewProps {
  puppyId?: string;
  dogId?: string;
  displayUnit: WeightUnit;
  weightRecords: WeightRecord[];
  onDelete: (id: string) => void;
}

export interface WeightEntryValues {
  weight: number;
  unit: WeightUnit;
  date: Date;
  notes?: string;
}

export interface WeightEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dogId?: string;
  puppyId?: string;
  onSave: (data: Partial<WeightRecord>) => Promise<any>;
  onCancel: () => void;
}

export interface WeightUnitSelectProps {
  value: WeightUnit;
  onChange: (value: WeightUnit) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}
