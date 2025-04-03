
import { WeightUnit } from '@/types/puppyTracking';

export interface WeightTrackerProps {
  puppyId: string;
  birthDate?: string;
  onAddSuccess?: () => void;
  isAddingWeight?: boolean;
  onCancelAdd?: () => void;
  onWeightAdded?: () => void;
}

export interface WeightRecord {
  id: string;
  puppy_id?: string;
  dog_id: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
}

export interface WeightChartViewProps {
  puppyId: string;
  birthDate?: string;
  displayUnit?: WeightUnit;
}

export interface WeightTableViewProps {
  puppyId: string;
  displayUnit?: WeightUnit;
  onWeightAdded?: () => void;
}
