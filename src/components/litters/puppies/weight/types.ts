
import { WeightRecord } from '@/types/puppyTracking';

export interface WeightFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  defaultUnit: 'oz' | 'g' | 'lbs' | 'kg';
  isSubmitting: boolean;
}

export interface WeightChartViewProps {
  weightRecords: WeightRecord[];
  displayUnit: 'oz' | 'g' | 'lbs' | 'kg';
}

export interface WeightTableViewProps {
  weightRecords: WeightRecord[];
  onDelete: (id: string) => void;
  displayUnit: 'oz' | 'g' | 'lbs' | 'kg';
}

export interface WeightTrackerProps {
  puppyId: string;
  onAddSuccess?: () => void;
}
