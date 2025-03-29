
import { supabase, customSupabase, GeneticTestRow, GeneticAuditLogRow, GeneticCalculationRow } from '@/integrations/supabase/client';
import { getMockGeneticData } from './mockGeneticData';
import { GeneticCompatibility } from '@/types/genetics';

/**
 * Helper function to fetch dog genetic data from the API
 */
export async function fetchDogGeneticData(dogId: string): Promise<any> {
  try {
    // Attempt to fetch actual genetic data from Supabase
    const { data: actualData, error: actualError } = await customSupabase
      .from<GeneticTestRow>('dog_genetic_tests')
      .eq('dog_id', dogId)
      .select('*');
    
    if (actualError) {
      throw actualError;
    }
    
    if (actualData && actualData.length > 0) {
      // Return actual data if it exists
      return {
        dogId,
        tests: actualData
      };
    }
    
    // Fall back to mock data for development
    return getMockGeneticData(dogId);
  } catch (error) {
    console.error('Error fetching genetic data:', error);
    // Fall back to mock data on error
    return getMockGeneticData(dogId);
  }
}

/**
 * Helper function to batch import genetic tests
 */
export async function batchImportGeneticTests(tests: any[]): Promise<any> {
  try {
    // Process tests to ensure proper structure
    const processedTests = tests.map(test => ({
      ...test,
      created_at: test.created_at || new Date().toISOString()
    }));
    
    // Insert into Supabase
    const { data, error } = await customSupabase
      .from<GeneticTestRow>('dog_genetic_tests')
      .insert(processedTests);
    
    if (error) throw error;
    
    // Log the activity
    await logGeneticActivity(processedTests[0].dog_id, 'batchImport', {
      count: processedTests.length,
      testTypes: processedTests.map(t => t.test_type)
    });
    
    return data;
  } catch (error) {
    console.error('Error batch importing genetic tests:', error);
    throw error;
  }
}

/**
 * Helper function to log genetic activity for auditing
 */
async function logGeneticActivity(dogId: string, action: string, details: any): Promise<void> {
  try {
    const userData = (await supabase.auth.getUser()).data;
    
    await customSupabase
      .from<GeneticAuditLogRow>('genetic_audit_logs')
      .insert({
        dog_id: dogId,
        user_id: userData?.user?.id,
        action,
        details,
        created_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Error logging genetic activity:', error);
  }
}

/**
 * Helper function to fetch genetic compatibility between dogs
 */
export async function fetchGeneticCompatibility(sireId: string, damId: string): Promise<GeneticCompatibility | null> {
  try {
    // First get COI value if it exists
    const { data: calculations, error: calcError } = await customSupabase
      .from<GeneticCalculationRow>('dog_genetic_calculations')
      .eq('dog_id', sireId)
      .select('*');
    
    if (calcError) throw calcError;
    
    // Find COI calculation if it exists
    const coiCalculation = calculations?.find(calc => 
      calc.calculation_type === 'coi' && 
      calc.value !== null
    );
    
    // Return compatibility data
    return {
      calculationDate: new Date().toISOString(),
      compatibility: {
        coi: coiCalculation?.value || 5.2, // Default value if no calculation exists
        healthRisks: [
          {
            condition: 'Degenerative Myelopathy',
            risk: 'Low',
            probability: 0.1
          }
        ],
        colorProbabilities: {
          black: 50,
          brown: 25,
          fawn: 25
        }
      }
    };
  } catch (error) {
    console.error('Error fetching genetic compatibility:', error);
    return null;
  }
}
