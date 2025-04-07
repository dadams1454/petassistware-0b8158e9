
import { WeightUnit } from './common';

export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  age_days?: number;
}

export interface WeightStat {
  date: string;
  weight: number;
  weight_unit: WeightUnit;
  change?: number;
  changePercent?: number;
}

export interface GrowthStats {
  percentChange?: number;
  averageGrowthRate?: number;
  projectedWeight?: number;
  weightGoal?: number;
  onTrack?: boolean;
  lastWeightDate?: string;
}

export interface WeightChartProps {
  weightHistory: WeightRecord[];
  dogId?: string;
  puppyId?: string;
  breed?: string;
}

export interface WeightEntryFormProps {
  dogId?: string;
  puppyId?: string;
  onSave: (data: WeightRecord) => void;
  onCancel: () => void;
  initialData?: Partial<WeightRecord>;
}

export interface WeightTrackerProps {
  dogId?: string;
  puppyId?: string;
  birthDate?: string;
  onWeightAdded?: () => void;
}

export interface WeightRecordsTableProps {
  weightRecords: WeightRecord[];
  onDelete: (id: string) => void;
}

export interface WeightEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dogId?: string;
  puppyId?: string;
  onSave: (data: Partial<WeightRecord>) => void;
  onCancel: () => void;
}
