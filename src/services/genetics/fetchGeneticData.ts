
import { supabase } from '@/integrations/supabase/client';
import { getMockGeneticData } from './mockGeneticData';

/**
 * Helper function to fetch dog genetic data from the API
 * This is a placeholder for the actual API call
 */
export async function fetchDogGeneticData(dogId: string): Promise<any> {
  try {
    // Attempt to fetch actual genetic data from Supabase
    // This is now commented out since we don't have the table yet
    // In a real implementation, we would uncomment this
    /*
    const { data: actualData, error: actualError } = await supabase
      .from('dog_genetic_tests')
      .select('*')
      .eq('dog_id', dogId);
    
    if (actualError) throw actualError;
    
    if (actualData && actualData.length > 0) {
      return {
        dogId: dogId,
        tests: actualData
      };
    }
    */
    
    // If no real data, use mock data
    return getMockGeneticData(dogId);
  } catch (error) {
    console.error("Error fetching data:", error);
    // Fallback to mock data
    return getMockGeneticData(dogId);
  }
}
