
export interface SocializationCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon?: string;
}

export interface SocializationCategoryOption {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
}

export interface SocializationRecord {
  id: string;
  puppy_id: string;
  category: string;
  experience: string;
  experience_date: string;
  reaction?: string;
  notes?: string;
  created_at: string;
}

export interface SocializationExperience {
  id: string;
  category: string;
  experience: string;
  date: string;
  puppy_id: string;
  reaction?: SocializationReaction;
  notes?: string;
}

export interface SocializationProgress {
  categoryId: string;
  categoryName: string;
  completed: number;
  total: number;
  percentage: number;
}

export type SocializationReactionType = 
  | 'positive'
  | 'neutral'
  | 'negative'
  | 'fearful'
  | 'curious'
  | 'excited'
  | 'calm'
  | 'anxious'
  | 'unknown';

export interface SocializationReaction {
  type: SocializationReactionType;
  name: string;
  description?: string;
  emoji?: string;
  color?: string;
}
