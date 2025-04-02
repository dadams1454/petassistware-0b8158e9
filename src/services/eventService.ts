
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
  created_at: string;
  updated_at: string;
  tenant_id: string;
  dog_id?: string;
  customer_id?: string;
  litter_id?: string;
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
    
    return data as Event[];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

// For backward compatibility with existing code
export const fetchEvents = getEvents;

export const createEvent = async (event: NewEvent): Promise<Event> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as Event;
  } catch (error) {
    console.error('Error creating event:', error);
    throw new Error('Failed to create event');
  }
};

export const updateEvent = async (id: string, updates: Partial<Event>): Promise<Event> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as Event;
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
