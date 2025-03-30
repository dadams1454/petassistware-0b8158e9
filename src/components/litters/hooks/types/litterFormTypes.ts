
import { Litter } from '@/types/litter';

export interface LitterFormData {
  litter_name: string;
  dam_id: string | null;
  sire_id: string | null;
  birth_date: Date | null;
  expected_go_home_date: Date;
  puppy_count: number | null;
  male_count: number | null;
  female_count: number | null;
  notes: string | null;
  documents_url: string | null;
  status?: string;
  // AKC compliance fields
  akc_registration_number: string | null;
  akc_registration_date: Date | null;
  akc_litter_color: string | null;
  akc_verified: boolean | null;
  // Breeding details
  first_mating_date: Date | null;
  last_mating_date: Date | null;
  kennel_name: string | null;
  breeding_notes: string | null;
}

export interface UseLitterFormProps {
  initialData?: Litter;
  onSuccess: () => void;
}

export interface UseLitterFormReturnType {
  form: any;
  isSubmitting: boolean;
  damDetails: any | null;
  previousDamId: string | null;
  setPreviousDamId: (id: string | null) => void;
  isInitialLoad: boolean;
  setIsInitialLoad: (value: boolean) => void;
  maleCount: number | null;
  femaleCount: number | null;
  currentDamId: string | null;
  handleSubmit: (data: LitterFormData) => Promise<void>;
}
