
import { supabase } from '@/integrations/supabase/client';
import { UpcomingEvent } from './types';
import { getMockEvents } from './mockData';

/**
 * Fetches upcoming events for the dashboard
 */
export const fetchUpcomingEvents = async (): Promise<UpcomingEvent[]> => {
  try {
    console.log('Fetching upcoming events...');
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('events')
      .select('id, title, description, event_date, status')
      .gte('event_date', today)
      .order('event_date', { ascending: true })
      .limit(5);
      
    if (error) {
      console.error('Error fetching upcoming events:', error);
      return getMockEvents();
    }
    
    if (data && data.length > 0) {
      return data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description || '',
        date: event.event_date,
        status: event.status
      }));
    } else {
      console.log('No events found, returning mock data');
      return getMockEvents();
    }
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return getMockEvents();
  }
};
