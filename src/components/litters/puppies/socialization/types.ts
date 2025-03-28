
export interface SocializationRecord {
  id: string;
  puppy_id: string;
  category: SocializationCategory;
  experience: string;
  experience_date: string | Date;
  reaction?: string | null;
  notes?: string | null;
  created_at: string;
}

export type SocializationCategory = 
  | 'people'
  | 'animals'
  | 'environments'
  | 'sounds'
  | 'surfaces'
  | 'objects'
  | 'handling'
  | 'other';

export interface SocializationCategoryOption {
  value: SocializationCategory;
  label: string;
  description: string;
  examples: string[];
}

export interface SocializationReactionOption {
  value: string;
  label: string;
  description: string;
}

export interface SocializationTrackerProps {
  puppyId: string;
  onExperienceAdded?: () => void;
}
