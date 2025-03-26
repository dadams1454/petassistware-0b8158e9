
import { DailyCarelog, CareTaskPreset, CareLogFormData, DogCareStatus } from '@/types/dailyCare';

export interface DailyCareContextType {
  loading: boolean;
  dogStatuses: DogCareStatus[];
  fetchDogCareLogs: (dogId: string) => Promise<DailyCarelog[]>;
  fetchCareTaskPresets: () => Promise<CareTaskPreset[]>;
  fetchAllDogsWithCareStatus: (date?: Date, forceRefresh?: boolean) => Promise<DogCareStatus[]>;
  addCareLog: (data: CareLogFormData) => Promise<DailyCarelog | null>;
  deleteCareLog: (id: string) => Promise<boolean>;
  addCareTaskPreset: (data: Partial<CareTaskPreset>) => Promise<CareTaskPreset | null>;
  deleteCareTaskPreset: (id: string) => Promise<boolean>;
}
