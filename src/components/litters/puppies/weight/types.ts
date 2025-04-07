
import { WeightUnit } from '@/types/weight-units';
import { WeightRecord } from '@/types/weight';

export interface WeightTrackerProps {
  puppyId: string;
  birthDate?: string;
  onAddSuccess?: () => void;
  isAddingWeight?: boolean;
  onCancelAdd?: () => void;
  onWeightAdded?: () => void;
}

export interface WeightChartViewProps {
  puppyId: string;
  birthDate?: string;
  displayUnit?: WeightUnit;
  weightRecords?: WeightRecord[];
}

export interface WeightTableViewProps {
  puppyId: string;
  displayUnit?: WeightUnit;
  weightRecords?: WeightRecord[];
  onDelete?: (id: string) => void;
}
