
import { supabase } from '@/integrations/supabase/client';

export interface Event {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  all_day: boolean;
  event_type: string;
  status: 'pending' | 'completed' | 'cancelled';
  recurring: boolean;
  recurrence_pattern?: string;
  recurrence_end_date?: string;
  created_at: string;
  updated_at: string;
  tenant_id: string;
  dog_id?: string;
  customer_id?: string;
  litter_id?: string;
  breeder_id: string;
  event_date: string;
  is_recurring: boolean;
}

export interface NewEvent {
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  all_day: boolean;
  event_type: string;
  status: 'pending' | 'completed' | 'cancelled';
  recurring: boolean;
  recurrence_pattern?: string;
  recurrence_end_date?: string;
  event_date: string;
  is_recurring: boolean;
  breeder_id: string;
  dog_id?: string;
  customer_id?: string;
  litter_id?: string;
}

export const EVENT_TYPES = [
  { value: 'appointment', label: 'Appointment' },
  { value: 'vaccination', label: 'Vaccination' },
  { value: 'medication', label: 'Medication' },
  { value: 'grooming', label: 'Grooming' },
  { value: 'training', label: 'Training' },
  { value: 'breeding', label: 'Breeding' },
  { value: 'whelping', label: 'Whelping' },
  { value: 'customer', label: 'Customer Visit' },
  { value: 'other', label: 'Other' }
];

// Function to convert database event to full Event type
const mapToEvent = (dbEvent: any): Event => {
  return {
    id: dbEvent.id,
    title: dbEvent.title,
    description: dbEvent.description,
    start_date: dbEvent.start_date || dbEvent.event_date, // Handle both formats
    end_date: dbEvent.end_date,
    all_day: dbEvent.all_day || false,
    event_type: dbEvent.event_type,
    status: dbEvent.status,
    recurring: dbEvent.recurring || dbEvent.is_recurring || false,
    recurrence_pattern: dbEvent.recurrence_pattern,
    recurrence_end_date: dbEvent.recurrence_end_date,
    created_at: dbEvent.created_at,
    updated_at: dbEvent.updated_at || dbEvent.created_at,
    tenant_id: dbEvent.tenant_id || '',
    dog_id: dbEvent.dog_id,
    customer_id: dbEvent.customer_id,
    litter_id: dbEvent.litter_id,
    breeder_id: dbEvent.breeder_id,
    event_date: dbEvent.event_date || dbEvent.start_date,
    is_recurring: dbEvent.is_recurring || dbEvent.recurring || false
  };
};

// Function to prepare a NewEvent for database insertion
const prepareEventForDB = (event: NewEvent): any => {
  return {
    title: event.title,
    description: event.description,
    event_date: event.event_date || event.start_date,
    start_date: event.start_date,
    end_date: event.end_date,
    all_day: event.all_day,
    event_type: event.event_type,
    status: event.status,
    recurring: event.recurring,
    is_recurring: event.is_recurring || event.recurring,
    recurrence_pattern: event.recurrence_pattern,
    recurrence_end_date: event.recurrence_end_date,
    breeder_id: event.breeder_id,
    dog_id: event.dog_id,
    customer_id: event.customer_id,
    litter_id: event.litter_id
  };
};

// Function to get events (replaces fetchEvents to match what components are importing)
export const getEvents = async (filters?: {
  dogId?: string;
  customerId?: string;
  litterId?: string;
  fromDate?: string;
  toDate?: string;
  eventType?: string;
  status?: string;
}): Promise<Event[]> => {
  try {
    let query = supabase.from('events').select('*');
    
    // Apply filters if provided
    if (filters) {
      if (filters.dogId) query = query.eq('dog_id', filters.dogId);
      if (filters.customerId) query = query.eq('customer_id', filters.customerId);
      if (filters.litterId) query = query.eq('litter_id', filters.litterId);
      if (filters.fromDate) query = query.gte('start_date', filters.fromDate);
      if (filters.toDate) query = query.lte('start_date', filters.toDate);
      if (filters.eventType) query = query.eq('event_type', filters.eventType);
      if (filters.status) query = query.eq('status', filters.status);
    }
    
    // Order by start date
    query = query.order('start_date', { ascending: true });
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    // Map database results to Event type
    return (data || []).map(event => mapToEvent(event));
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

// For backward compatibility with existing code
export const fetchEvents = getEvents;

export const createEvent = async (event: NewEvent): Promise<Event> => {
  try {
    // Prepare event data for insertion
    const eventData = prepareEventForDB(event);
    
    const { data, error } = await supabase
      .from('events')
      .insert(eventData)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return mapToEvent(data);
  } catch (error) {
    console.error('Error creating event:', error);
    throw new Error('Failed to create event');
  }
};

export const updateEvent = async (id: string, updates: Partial<Event>): Promise<Event> => {
  try {
    // Prepare event data for update
    const updateData = prepareEventForDB(updates as NewEvent);
    
    const { data, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return mapToEvent(data);
  } catch (error) {
    console.error('Error updating event:', error);
    throw new Error('Failed to update event');
  }
};

export const deleteEvent = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    throw new Error('Failed to delete event');
  }
};
