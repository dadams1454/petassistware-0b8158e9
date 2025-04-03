
import { UseFormReturn } from 'react-hook-form';
import { Litter, Dog } from '@/types';

export interface LitterFormData {
  id?: string;
  litter_name: string;
  dam_id: string;
  sire_id?: string;
  birth_date: Date | string;
  expected_go_home_date?: Date | string;
  akc_litter_number?: string;
  akc_registration_number?: string;
  akc_registration_date?: Date | string;
  akc_verified?: boolean;
  status: 'active' | 'completed' | 'planned' | 'archived';
  male_count?: number;
  female_count?: number;
  breeding_notes?: string;
  notes?: string;
}

export interface UseLitterFormProps {
  initialData?: Partial<Litter>;
  onSuccess: () => void;
}

export interface UseLitterFormReturnType {
  form: UseFormReturn<LitterFormData>;
  isSubmitting: boolean;
  damDetails: Dog | null;
  previousDamId: string | null;
  setPreviousDamId: (id: string | null) => void;
  isInitialLoad: boolean;
  setIsInitialLoad: (value: boolean) => void;
  maleCount: number | undefined;
  femaleCount: number | undefined;
  currentDamId: string;
  handleSubmit: (data: LitterFormData) => Promise<void>;
}

export interface UseDamInfoUpdaterProps {
  form: UseFormReturn<LitterFormData>;
  damDetails: Dog | null;
  isInitialLoad: boolean;
  setIsInitialLoad: (value: boolean) => void;
  initialData?: Partial<Litter>;
  currentDamId: string;
  previousDamId: string | null;
  setPreviousDamId: (id: string | null) => void;
}

export interface UsePuppyCounterProps {
  form: UseFormReturn<LitterFormData>;
  maleCount: number | undefined;
  femaleCount: number | undefined;
}
