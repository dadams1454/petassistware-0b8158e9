
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
      : null
  };
  
  return formattedData;
};
