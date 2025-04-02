
import { WeightUnit, WeightRecord } from '@/types/health';

export interface WeightFormProps {
  onSubmit: (data: {
    weight: number;
    weight_unit: WeightUnit;
    date: string;
    notes?: string;
    birth_date?: string;
  }) => Promise<boolean>;
  onCancel: () => void;
  defaultUnit: WeightUnit;
  isSubmitting?: boolean;
  puppyId?: string;
  birthDate?: string;
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
  birthDate?: string;
}

// Use export type for re-exporting types to avoid isolatedModules error
export type { WeightRecord };
