
import { supabase } from '@/integrations/supabase/client';

/**
 * Batch import genetic tests for a dog
 */
export async function batchImportGeneticTests(dogId: string, tests: any[]) {
  try {
    // Check if tests is an array and not empty
    if (!Array.isArray(tests) || tests.length === 0) {
      throw new Error('No tests provided for import');
    }
    
    // Format the tests with the dog_id
    const formattedTests = tests.map(test => ({
      ...test,
      dog_id: dogId,
      created_at: new Date().toISOString()
    }));
    
    // Insert into dog_genetic_tests table
    const { data, error } = await supabase
      .from('dog_genetic_tests')
      .insert(formattedTests)
      .select();
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error importing genetic tests:', error);
    return { success: false, error };
  }
}

export default batchImportGeneticTests;
