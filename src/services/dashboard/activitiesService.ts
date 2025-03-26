
import { supabase } from '@/integrations/supabase/client';
import { RecentActivity } from './types';
import { getMockActivities } from './mockData';

/**
 * Fetches recent activities for the dashboard
 */
export const fetchRecentActivities = async (): Promise<RecentActivity[]> => {
  try {
    console.log('Fetching recent activities...');
    const { data, error } = await supabase
      .from('activities')
      .select('id, activity_type, title, description, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (error) {
      console.error('Error fetching recent activities:', error);
      return getMockActivities();
    }
    
    if (data && data.length > 0) {
      return data.map(activity => ({
        id: activity.id,
        type: activity.activity_type,
        title: activity.title,
        description: activity.description || '',
        createdAt: activity.created_at
      }));
    } else {
      console.log('No activities found, returning mock data');
      return getMockActivities();
    }
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return getMockActivities();
  }
};
