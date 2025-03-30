
import { Puppy } from '@/types/litter';

export interface PuppyFormProps {
  litterId: string;
  initialData?: Puppy | null;
  onSuccess: () => void;
}

export interface SocializationCategory {
  id: string;
  name: string;
}

export interface SocializationTrackerProps {
  puppyId: string;
  onExperienceAdded?: () => void;
}
