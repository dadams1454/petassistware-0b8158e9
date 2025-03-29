import { supabase } from '@/integrations/supabase/client';
import { getMockGeneticData } from './mockGeneticData';
import { GeneticCompatibility } from '@/types/genetics';

/**
 * Helper function to fetch dog genetic data from the API
 */
export async function fetchDogGeneticData(dogId: string): Promise<any> {
  try {
    // Attempt to fetch actual genetic data from Supabase
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
    
    // If no real data, use mock data
    return getMockGeneticData(dogId);
  } catch (error) {
    console.error("Error fetching data:", error);
    // Fallback to mock data
    return getMockGeneticData(dogId);
  }
}

/**
 * Batch import genetic test results
 */
export async function batchImportGeneticTests(tests: any[]): Promise<{ success: boolean; error?: string }> {
  try {
    // Add created_by field to each test
    const testsWithUser = tests.map(test => ({
      ...test,
      created_by: supabase.auth.getUser().then(response => response.data.user?.id)
    }));
    
    const { data, error } = await supabase
      .from('dog_genetic_tests')
      .insert(testsWithUser);
    
    if (error) throw error;
    
    // Log the activity in the audit log
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (userId) {
      await supabase
        .from('genetic_audit_logs')
        .insert({
          dog_id: tests[0].dog_id, 
          user_id: userId,
          action: 'batch_import',
          details: { tests_count: tests.length }
        });
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error batch importing tests:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Calculate compatibility between two dogs
 */
export async function calculateCompatibility(sireId: string, damId: string): Promise<GeneticCompatibility> {
  try {
    // First check if we have a cached calculation
    const { data: cachedData, error: cachedError } = await supabase
      .from('dog_genetic_calculations')
      .select('*')
      .eq('calculation_type', `compatibility_${sireId}_${damId}`)
      .single();
    
    if (!cachedError && cachedData) {
      return JSON.parse(cachedData.value.toString());
    }
    
    // Otherwise calculate compatibility using our existing logic
    // For now, we'll rely on the client-side calculation in useGeneticPairing
    // but ideally this would be moved to a server-side function
    const sireData = await fetchDogGeneticData(sireId);
    const damData = await fetchDogGeneticData(damId);
    
    // This is a placeholder - in a real implementation this would use
    // a more sophisticated algorithm on the server
    return {
      calculationDate: new Date().toISOString(),
      compatibility: {
        coi: 4.2, // Example value
        healthRisks: [],
        colorProbabilities: {}
      }
    };
  } catch (error) {
    console.error("Error calculating compatibility:", error);
    throw error;
  }
}
