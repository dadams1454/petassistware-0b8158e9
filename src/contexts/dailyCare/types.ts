
import { DailyCarelog, CareTaskPreset, CareLogFormData, DogCareStatus } from '@/types/dailyCare';

export interface DailyCareContextType {
  fetchDogCareLogs: (dogId: string) => Promise<DailyCarelog[]>;
  fetchCareTaskPresets: () => Promise<CareTaskPreset[]>;
  addCareLog: (data: CareLogFormData) => Promise<DailyCarelog | null>;
  deleteCareLog: (logId: string) => Promise<boolean>;
  addCareTaskPreset: (category: string, taskName: string, isDefault: boolean) => Promise<CareTaskPreset | null>;
  deleteCareTaskPreset: (id: string) => Promise<boolean>;
  fetchAllDogsWithCareStatus: (date?: Date, forceRefresh?: boolean) => Promise<DogCareStatus[]>;
  dogStatuses: DogCareStatus[] | null;
  loading: boolean;
}
