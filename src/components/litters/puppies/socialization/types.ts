
export interface SocializationCategory {
  id: string;
  name: string;
}

export interface SocializationTrackerProps {
  puppyId: string;
  onExperienceAdded?: () => void;
}

export interface SocializationRecord {
  id: string;
  puppy_id: string;
  category: SocializationCategory;
  experience: string;
  experience_date: string;
  reaction?: string;
  notes?: string;
  created_at: string;
}

export const SOCIALIZATION_CATEGORIES = [
  { id: 'people', name: 'People Interactions' },
  { id: 'animals', name: 'Animal Interactions' },
  { id: 'environments', name: 'New Environments' },
  { id: 'sounds', name: 'Sounds & Noises' },
  { id: 'surfaces', name: 'Different Surfaces' },
  { id: 'handling', name: 'Handling & Grooming' },
  { id: 'objects', name: 'Objects & Toys' },
  { id: 'travel', name: 'Travel Experiences' },
];

export const REACTION_OPTIONS = [
  { id: 'very_positive', name: 'Very Positive' },
  { id: 'positive', name: 'Positive' },
  { id: 'neutral', name: 'Neutral' },
  { id: 'cautious', name: 'Cautious' },
  { id: 'fearful', name: 'Fearful' },
  { id: 'very_fearful', name: 'Very Fearful' },
];
