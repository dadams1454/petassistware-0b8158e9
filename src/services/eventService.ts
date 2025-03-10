
import { supabase } from '@/integrations/supabase/client';
import { Event, NewEvent } from '@/pages/Calendar';

// Helper function to validate event status
const validateEventStatus = (status: string): 'upcoming' | 'planned' | 'completed' | 'cancelled' => {
  const validStatuses = ['upcoming', 'planned', 'completed', 'cancelled'];
  return validStatuses.includes(status) 
    ? status as 'upcoming' | 'planned' | 'completed' | 'cancelled' 
    : 'planned'; // Default to 'planned' if invalid status
};

// Function to fetch all events
export const fetchEvents = async (): Promise<Event[]> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });
    
    if (error) throw error;
    
    // Convert database events to application events with validated status
    const events: Event[] = (data || []).map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      status: validateEventStatus(event.status),
      event_type: event.event_type,
      is_recurring: event.is_recurring || false,
      recurrence_pattern: event.recurrence_pattern || 'none',
      recurrence_end_date: event.recurrence_end_date || null
    }));
    
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

// Function to create a new event
export const createEvent = async (eventData: NewEvent): Promise<Event> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .insert([
        {
          title: eventData.title,
          description: eventData.description,
          event_date: eventData.event_date,
          status: eventData.status,
          event_type: eventData.event_type,
          is_recurring: eventData.is_recurring || false,
          recurrence_pattern: eventData.recurrence_pattern || 'none',
          recurrence_end_date: eventData.recurrence_end_date || null,
          breeder_id: (await supabase.auth.getUser()).data.user?.id
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) {
      throw new Error('Failed to create event');
    }
    
    // Convert database event to application event with validated status
    const event: Event = {
      id: data.id,
      title: data.title,
      description: data.description,
      event_date: data.event_date,
      status: validateEventStatus(data.status),
      event_type: data.event_type,
      is_recurring: data.is_recurring || false,
      recurrence_pattern: data.recurrence_pattern || 'none',
      recurrence_end_date: data.recurrence_end_date || null
    };
    
    return event;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// Function to update an existing event
export const updateEvent = async (eventData: Event): Promise<Event> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .update({
        title: eventData.title,
        description: eventData.description,
        event_date: eventData.event_date,
        status: eventData.status,
        event_type: eventData.event_type,
        is_recurring: eventData.is_recurring || false,
        recurrence_pattern: eventData.recurrence_pattern || 'none',
        recurrence_end_date: eventData.recurrence_end_date || null
      })
      .eq('id', eventData.id)
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) {
      throw new Error('Failed to update event');
    }
    
    // Convert database event to application event with validated status
    const event: Event = {
      id: data.id,
      title: data.title,
      description: data.description,
      event_date: data.event_date,
      status: validateEventStatus(data.status),
      event_type: data.event_type,
      is_recurring: data.is_recurring || false,
      recurrence_pattern: data.recurrence_pattern || 'none',
      recurrence_end_date: data.recurrence_end_date || null
    };
    
    return event;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

// Function to delete an event
export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};
