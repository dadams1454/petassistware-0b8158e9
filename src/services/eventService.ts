
import { supabase } from '@/integrations/supabase/client';
import { Event, NewEvent } from '@/types/events';

// Get all events
export const getEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true });
    
  if (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
  
  return data as Event[];
};

// Get a single event by ID
export const getEventById = async (id: string): Promise<Event | null> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching event:', error);
    throw error;
  }
  
  return data as Event;
};

// Create a new event
export const createEvent = async (event: NewEvent): Promise<Event> => {
  const { data, error } = await supabase
    .from('events')
    .insert(event)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating event:', error);
    throw error;
  }
  
  return data as Event;
};

// Update an existing event
export const updateEvent = async (id: string, event: Partial<Event>): Promise<Event> => {
  const { data, error } = await supabase
    .from('events')
    .update(event)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating event:', error);
    throw error;
  }
  
  return data as Event;
};

// Delete an event
export const deleteEvent = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};
