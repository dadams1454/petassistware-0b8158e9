
import { WeightRecord } from '@/types/weight';
import { WeightUnit } from '@/types/weight-units';

export interface WeightTrackerProps {
  puppyId: string;
  birthDate?: string;
  onAddSuccess?: () => void;
}

export interface WeightEntryFormProps {
  puppyId: string;
  birthDate?: string;
  onSuccess?: (record: WeightRecord) => void;
  onCancel?: () => void;
}

export interface WeightChartViewProps {
  puppyId: string;
  birthDate?: string;
  displayUnit: WeightUnit;
  weightRecords: WeightRecord[];
}

export interface WeightTableViewProps {
  puppyId: string;
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
  dogId: string;
  onSave: (data: Partial<WeightRecord>) => Promise<any>;
  onCancel: () => void;
}

export interface WeightUnitSelectProps {
  value: WeightUnit;
  onChange: (value: WeightUnit) => void;
  disabled?: boolean;
}
