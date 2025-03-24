
import { supabase } from '@/integrations/supabase/client';

export interface DashboardData {
  totalDogs: number;
  activeDogs: number;
  totalLitters: number;
  activeLitters: number;
  totalPuppies: number;
  availablePuppies: number;
  totalCustomers: number;
  // Add any other dashboard metrics here
}

export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    // Fetch count of all dogs
    const { count: totalDogs, error: dogsError } = await supabase
      .from('dogs')
      .select('*', { count: 'exact', head: true });

    // Fetch count of active dogs
    const { count: activeDogs, error: activeDogsError } = await supabase
      .from('dogs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Fetch count of all litters
    const { count: totalLitters, error: littersError } = await supabase
      .from('litters')
      .select('*', { count: 'exact', head: true });

    // Fetch count of active litters
    const { count: activeLitters, error: activeLittersError } = await supabase
      .from('litters')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Fetch count of all puppies
    const { count: totalPuppies, error: puppiesError } = await supabase
      .from('puppies')
      .select('*', { count: 'exact', head: true });

    // Fetch count of available puppies
    const { count: availablePuppies, error: availablePuppiesError } = await supabase
      .from('puppies')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Available');

    // Fetch count of all customers
    const { count: totalCustomers, error: customersError } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true });

    // Handle any errors
    if (dogsError || activeDogsError || littersError || activeLittersError || 
        puppiesError || availablePuppiesError || customersError) {
      console.error("Error fetching dashboard data:", { 
        dogsError, activeDogsError, littersError, activeLittersError,
        puppiesError, availablePuppiesError, customersError 
      });
    }

    return {
      totalDogs: totalDogs || 0,
      activeDogs: activeDogs || 0,
      totalLitters: totalLitters || 0,
      activeLitters: activeLitters || 0,
      totalPuppies: totalPuppies || 0,
      availablePuppies: availablePuppies || 0,
      totalCustomers: totalCustomers || 0,
    };
  } catch (error) {
    console.error("Error in fetchDashboardData:", error);
    // Return default values in case of error
    return {
      totalDogs: 0,
      activeDogs: 0,
      totalLitters: 0,
      activeLitters: 0,
      totalPuppies: 0,
      availablePuppies: 0,
      totalCustomers: 0,
    };
  }
};
