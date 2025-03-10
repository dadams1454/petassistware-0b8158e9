
import { NewEvent } from '@/pages/Calendar';

// Form data structure that uses Date objects internally
export interface EventFormData {
  title: string;
  description: string | null;
  event_date: Date;
  status: 'upcoming' | 'planned' | 'completed' | 'cancelled';
  event_type: string;
  is_recurring: boolean;
  recurrence_pattern: string;
  recurrence_end_date: Date | null;
  associated_dog_id?: string | null; // Optional ID of associated dog
  associated_litter_id?: string | null; // Optional ID of associated litter
}

// Helper function to convert form data to the NewEvent type
export const formatEventData = (data: EventFormData): NewEvent => {
  const formattedData: NewEvent = {
    title: data.title,
    description: data.description,
    event_date: data.event_date.toISOString().split('T')[0],
    status: data.status,
    event_type: data.event_type,
    is_recurring: data.is_recurring,
    recurrence_pattern: data.recurrence_pattern,
    recurrence_end_date: data.recurrence_end_date 
      ? data.recurrence_end_date.toISOString().split('T')[0]
      : null,
    // Only include these fields if they have values
    ...(data.associated_dog_id && { associated_dog_id: data.associated_dog_id }),
    ...(data.associated_litter_id && { associated_litter_id: data.associated_litter_id })
  };
  
  return formattedData;
};

// Breeding-specific event types
export const BREEDING_EVENT_TYPES = [
  'Heat Cycle',
  'Breeding Date',
  'Pregnancy Confirmation',
  'Whelping Due Date',
  'Whelping Day',
  'Puppy Checkup',
  'Vaccination',
  'Deworming',
  'Microchipping',
  'AKC Registration',
  'Puppy Selection',
  'Puppy Go Home Day',
  'Health Testing',
  'Grooming',
  'Show/Competition',
  'Veterinary Appointment',
  'Training Session',
  'Other'
];
