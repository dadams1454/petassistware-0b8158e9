
import { WeightUnit, WeightRecord } from '@/types/puppyTracking';

export interface WeightFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  defaultUnit: WeightUnit;
  isSubmitting: boolean;
}

export interface WeightChartViewProps {
  weightRecords: WeightRecord[];
  displayUnit: WeightUnit;
}

export interface WeightTableViewProps {
  weightRecords: WeightRecord[];
  onDelete: (id: string) => void;
  displayUnit: WeightUnit;
}

export interface WeightTrackerProps {
  puppyId: string;
  onAddSuccess?: () => void;
}

// Use export type for re-exporting types to avoid isolatedModules error
export type { WeightRecord };
