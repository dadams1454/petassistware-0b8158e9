
// Define event types for the calendar
export type Event = {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  event_type: EventType;
  status: 'planned' | 'completed' | 'cancelled';
  is_recurring: boolean;
  recurrence_pattern?: string;
  recurrence_end_date?: string;
  breeder_id: string;
  created_at?: string;
  tenant_id?: string;
  start_date?: string; // For compatibility with calendar systems
  end_date?: string; // For compatibility with calendar systems
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

export interface CalendarEvent extends Event {
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: string;
}
