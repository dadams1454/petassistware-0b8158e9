
/**
 * Weight module type definitions
 */
import { WeightUnit } from '@/types/weight-units';

/**
 * Interface for weight records
 */
export interface WeightRecord {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  age_days?: number;
  birth_date?: string;
}

/**
 * Options for weight record queries
 */
export interface WeightRecordOptions {
  dogId?: string;
  puppyId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

/**
 * Growth statistics interface
 */
export interface GrowthStats {
  percentChange: number;
  averageGrowthRate?: number;
  projectedWeight?: number;
  weightGoal?: number;
  onTrack?: boolean;
  currentWeight?: {
    value: number;
    unit: WeightUnit;
    date: string;
  };
  totalGrowth?: number;
  lastWeekGrowth?: number;
  growthRate?: number;
}

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

export interface WeightRecordsTableProps {
  weightRecords: WeightRecord[];
  onDelete: (id: string) => void;
}
