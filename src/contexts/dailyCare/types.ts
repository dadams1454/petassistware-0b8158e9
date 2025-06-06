
import { DailyCarelog, CareLogFormData, CareTaskPreset, DogCareStatus } from '@/types/dailyCare';

export interface DailyCareContextType {
  loading: boolean;
  fetchDogCareLogs: (dogId: string) => Promise<DailyCarelog[]>;
  fetchCareTaskPresets: () => Promise<CareTaskPreset[]>;
  fetchAllDogsWithCareStatus: (date?: Date, forceRefresh?: boolean) => Promise<DogCareStatus[]>;
  dogStatuses?: DogCareStatus[]; 
  addCareLog: (data: CareLogFormData) => Promise<DailyCarelog | null>;
  deleteCareLog: (id: string) => Promise<boolean>;
  addCareTaskPreset: (category: string, taskName: string) => Promise<CareTaskPreset | null>;
  deleteCareTaskPreset: (id: string) => Promise<boolean>;
  fetchRecentCareLogsByCategory: (dogId: string, category: string, limit?: number) => Promise<DailyCarelog[]>;
}
