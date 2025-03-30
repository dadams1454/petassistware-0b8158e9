
export interface WeightRecord {
  id: string;
  puppy_id: string;
  weight: number;
  date: string;
  weight_unit: string;
  notes?: string;
  created_at: string;
}

export interface WeightChartData {
  date: string;
  weight: number;
}

export interface WeightTrackerProps {
  puppyId: string;
  onWeightAdded?: () => void;
}

export interface WeightFormData {
  weight: string;
  date: Date;
  weight_unit: string;
  notes?: string;
}
