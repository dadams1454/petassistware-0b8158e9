
import { DogCareStatus } from '@/types/dailyCare';

export interface CareLog {
  dog_id: string;
  category: string;
  task_name: string;
  timestamp: string;
}

export interface CareLogsContextValue {
  careLogs: CareLog[];
  fetchCareLogs: (forceRefresh?: boolean) => Promise<CareLog[]>;
  isLoading: boolean;
  hasCareLogged: (dogId: string, timeSlot: string, category: string) => boolean;
  currentDate: Date;
}
