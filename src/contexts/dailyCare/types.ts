
import { DailyCarelog, CareLogFormData, CareTaskPreset, DogCareStatus } from '@/types/dailyCare';

export interface DailyCareContextType {
  loading: boolean;
  fetchDogCareLogs: (dogId: string) => Promise<DailyCarelog[]>;
  fetchCareTaskPresets: () => Promise<CareTaskPreset[]>;
  fetchAllDogsWithCareStatus: (date?: Date) => Promise<DogCareStatus[]>;
  dogStatuses?: DogCareStatus[]; // Add dogStatuses to expose it directly
  addCareLog: (data: CareLogFormData) => Promise<DailyCarelog | null>;
  deleteCareLog: (id: string) => Promise<boolean>;
  addCareTaskPreset: (data: CareTaskPreset) => Promise<CareTaskPreset | null>;
  deleteCareTaskPreset: (id: string) => Promise<boolean>;
}
