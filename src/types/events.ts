
// Define event types for the calendar
export type Event = {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  event_type: string;
  status: 'planned' | 'completed' | 'cancelled';
  is_recurring: boolean;
  recurrence_pattern?: string;
  recurrence_end_date?: string;
  breeder_id: string;
  created_at?: string;
};

export type NewEvent = Omit<Event, 'id' | 'created_at'>;

export const EVENT_TYPES = [
  'vaccination',
  'examination',
  'breeding',
  'heat_cycle',
  'grooming',
  'socialization',
  'training',
  'appointment',
  'other'
] as const;

export type EventType = typeof EVENT_TYPES[number];

export interface EventListProps {
  onEditEvent?: (event: Event) => void;
  onDeleteEvent?: (eventId: string) => void;
  onViewEvent?: (event: Event) => void;
}
