
import { supabase } from '@/integrations/supabase/client';
import { Event, NewEvent } from '@/pages/Calendar';

// Function to fetch all events
export const fetchEvents = async (): Promise<Event[]> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });
    
    if (error) throw error;
    
    return data || [];
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
          breeder_id: (await supabase.auth.getUser()).data.user?.id
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) {
      throw new Error('Failed to create event');
    }
    
    return data;
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
        event_type: eventData.event_type
      })
      .eq('id', eventData.id)
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) {
      throw new Error('Failed to update event');
    }
    
    return data;
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
