
import { supabase } from '@/integrations/supabase/client';
import { DashboardData } from './types';
import { getMockDashboardStats } from './mockData';

/**
 * Fetches dashboard statistics
 */
export const fetchDashboardStats = async (): Promise<DashboardData> => {
  try {
    console.log('Fetching dashboard stats...');
    // Fetch all statistics in parallel
    const [dogStats, litterStats, puppyStats, customerStats] = await Promise.all([
      fetchDogStats(),
      fetchLitterStats(),
      fetchPuppyStats(),
      fetchCustomerStats()
    ]);

    console.log('Stats fetched:', { dogStats, litterStats, puppyStats, customerStats });
    
    return {
      ...dogStats,
      ...litterStats,
      ...puppyStats,
      ...customerStats
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return default values if there's an error
    return getMockDashboardStats();
  }
};

/**
 * Fetches dog statistics
 */
const fetchDogStats = async (): Promise<{ totalDogs: number; activeDogs: number }> => {
  try {
    // Get total dogs count
    const { count: totalDogs, error: dogsError } = await supabase
      .from('dogs')
      .select('*', { count: 'exact', head: true });

    // Get active dogs count (no death_date)
    const { count: activeDogs, error: activeDogsError } = await supabase
      .from('dogs')
      .select('*', { count: 'exact', head: true })
      .is('death_date', null);

    if (dogsError || activeDogsError) {
      console.error('Error fetching dog stats:', dogsError || activeDogsError);
      return { totalDogs: 0, activeDogs: 0 };
    }

    return {
      totalDogs: totalDogs || 0,
      activeDogs: activeDogs || 0
    };
  } catch (error) {
    console.error('Error in fetchDogStats:', error);
    return { totalDogs: 0, activeDogs: 0 };
  }
};

/**
 * Fetches litter statistics
 */
const fetchLitterStats = async (): Promise<{ totalLitters: number; activeLitters: number }> => {
  try {
    // Get total litters count
    const { count: totalLitters, error: littersError } = await supabase
      .from('litters')
      .select('*', { count: 'exact', head: true });

    // Get active litters count
    const { count: activeLitters, error: activeLittersError } = await supabase
      .from('litters')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (littersError || activeLittersError) {
      console.error('Error fetching litter stats:', littersError || activeLittersError);
      return { totalLitters: 0, activeLitters: 0 };
    }

    return {
      totalLitters: totalLitters || 0,
      activeLitters: activeLitters || 0
    };
  } catch (error) {
    console.error('Error in fetchLitterStats:', error);
    return { totalLitters: 0, activeLitters: 0 };
  }
};

/**
 * Fetches puppy statistics
 */
const fetchPuppyStats = async (): Promise<{ totalPuppies: number; availablePuppies: number }> => {
  try {
    // Get total puppies count
    const { count: totalPuppies, error: puppiesError } = await supabase
      .from('puppies')
      .select('*', { count: 'exact', head: true });

    // Get available puppies count
    const { count: availablePuppies, error: availablePuppiesError } = await supabase
      .from('puppies')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Available');

    if (puppiesError || availablePuppiesError) {
      console.error('Error fetching puppy stats:', puppiesError || availablePuppiesError);
      return { totalPuppies: 0, availablePuppies: 0 };
    }

    return {
      totalPuppies: totalPuppies || 0,
      availablePuppies: availablePuppies || 0
    };
  } catch (error) {
    console.error('Error in fetchPuppyStats:', error);
    return { totalPuppies: 0, availablePuppies: 0 };
  }
};

/**
 * Fetches customer statistics
 */
const fetchCustomerStats = async (): Promise<{ totalCustomers: number }> => {
  try {
    // Get total customers count
    const { count: totalCustomers, error: customersError } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true });

    if (customersError) {
      console.error('Error fetching customer stats:', customersError);
      return { totalCustomers: 0 };
    }

    return {
      totalCustomers: totalCustomers || 0
    };
  } catch (error) {
    console.error('Error in fetchCustomerStats:', error);
    return { totalCustomers: 0 };
  }
};
