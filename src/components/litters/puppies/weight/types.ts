
export interface WeightRecord {
  id: string;
  puppy_id: string;
  date: string | Date;
  weight: number;
  weight_unit: 'oz' | 'g' | 'lbs' | 'kg';
  percent_change?: number | null;
  notes?: string | null;
  created_at: string;
}

export interface WeightChartData {
  date: string;
  weight: number;
  percentChange?: number;
}

export interface WeightUnitOption {
  label: string;
  value: 'oz' | 'g' | 'lbs' | 'kg';
  conversion: {
    oz: number;
    g: number;
    lbs: number;
    kg: number;
  };
}

export interface WeightTrackerProps {
  puppyId: string;
  initialData?: WeightRecord[];
  onAddSuccess?: () => void;
}
