
export type SocializationReactionType = 
  'very_positive' | 'positive' | 'neutral' | 
  'cautious' | 'fearful' | 'very_fearful' | 'no_reaction' |
  'negative' | 'unknown';

export interface SocializationReaction {
  id: string;
  name: string;
  color: string;
  emoji?: string;
  value: SocializationReactionType;
}

export interface SocializationCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  examples?: string[];
  icon?: string;
}

export interface SocializationCategoryOption {
  id: string;
  name: string;
  description?: string;
  examples?: string[];
  color?: string;
  value?: string;
  label?: string;
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
  puppy_id: string;
  category: string;
  experience: string;
  experience_date: string;
  reaction?: SocializationReactionType;
  notes?: string;
  created_at: string;
}

export interface SocializationProgress {
  category: string;
  categoryName: string;
  total: number;
  completed: number;
  positive: number;
  neutral: number;
  negative: number;
  count?: number;
  target?: number;
  completion_percentage?: number;
}
