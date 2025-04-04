
import { PuppyFormValues } from '@/hooks/usePuppyForm';
import { UseFormReturn } from 'react-hook-form';
import { SocializationReactionType } from '@/types/puppyTracking';

export interface Puppy {
  id: string;
  name: string | null;
  gender: string | null;
  color: string | null;
  birth_date?: string;
  litter_id: string;
  microchip_number?: string | null;
  photo_url?: string | null;
  current_weight?: string | null;
  weight_unit?: string | null;
  status: 'Available' | 'Reserved' | 'Sold' | 'Unavailable' | string;
  birth_order?: number | null;
  birth_weight?: string | null;
  birth_time?: string | null;
  presentation?: string | null;
  assistance_required?: boolean | null;
  assistance_notes?: string | null;
  sale_price?: number | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PuppyFormProps {
  litterId: string;
  initialData?: Puppy | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export interface EditPuppyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  litterId: string;
  puppy: Puppy | null;
  onSuccess: () => void;
}

export interface BasicInfoTabProps {
  form: UseFormReturn<PuppyFormValues>;
  litterId?: string;
}

export interface WeightsTabProps {
  form: UseFormReturn<PuppyFormValues>;
}

export interface HealthTabProps {
  form: UseFormReturn<PuppyFormValues>;
}

export interface AKCRegistrationTabProps {
  form: UseFormReturn<PuppyFormValues>;
}

export interface NewOwnerTabProps {
  form: UseFormReturn<PuppyFormValues>;
}

// Socialization types
export type SocializationCategory = {
  id: string;
  name: string;
  color?: string;
  description?: string;
  examples?: string[];
};

export interface SocializationRecord {
  id: string;
  puppy_id: string;
  category: SocializationCategory;
  experience: string;
  experience_date: string;
  reaction?: SocializationReactionType;
  notes?: string;
  created_at: string;
}

export interface SocializationCategoryOption {
  id: string;
  name: string;
  value: string;
  label: string;
  color?: string;
  examples?: string[];
}

export interface SocializationReactionOption {
  id: string;
  name: string;
  value: SocializationReactionType;
  label: string;
  color: string;
}

export interface SocializationTrackerProps {
  puppyId: string;
  onExperienceAdded?: () => void;
}
