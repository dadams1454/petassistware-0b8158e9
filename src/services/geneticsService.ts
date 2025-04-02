
import { supabase } from '@/integrations/supabase/client';
import { GeneticImportResult } from '@/types/genetics';

/**
 * Import genetic test results from Embark
 */
export const importEmbarkData = async (dogId: string, file: File | null): Promise<GeneticImportResult> => {
  // This is a mock implementation since we don't have the actual API integration
  console.log(`Importing Embark data for dog ${dogId}`);
  
  // Simulate a successful import
  return {
    success: true,
    provider: 'Embark',
    testsImported: 12,
    dogId
  };
};

/**
 * Import genetic test results from Wisdom Panel
 */
export const importWisdomPanelData = async (dogId: string, file: File | null): Promise<GeneticImportResult> => {
  // This is a mock implementation since we don't have the actual API integration
  console.log(`Importing Wisdom Panel data for dog ${dogId}`);
  
  // Simulate a successful import
  return {
    success: true,
    provider: 'Wisdom Panel',
    testsImported: 8,
    dogId
  };
};

/**
 * Import genetic test results from Optimal Selection
 */
export const importOptimalSelectionData = async (dogId: string, file: File | null): Promise<GeneticImportResult> => {
  // This is a mock implementation since we don't have the actual API integration
  console.log(`Importing Optimal Selection data for dog ${dogId}`);
  
  // Simulate a successful import
  return {
    success: true,
    provider: 'Optimal Selection',
    testsImported: 10,
    dogId
  };
};

/**
 * Fetch genetic tests for a dog
 */
export const fetchGeneticTests = async (dogId: string) => {
  const { data, error } = await supabase
    .from('genetic_tests')
    .select('*')
    .eq('dog_id', dogId)
    .order('test_date', { ascending: false });

  if (error) {
    console.error('Error fetching genetic tests:', error);
    throw error;
  }

  return data || [];
};

/**
 * Save genetic test results
 */
export const saveGeneticTest = async (test: any) => {
  const { data, error } = test.id
    ? await supabase
        .from('genetic_tests')
        .update(test)
        .eq('id', test.id)
        .select()
    : await supabase
        .from('genetic_tests')
        .insert(test)
        .select();

  if (error) {
    console.error('Error saving genetic test:', error);
    throw error;
  }

  return data?.[0] || null;
};

/**
 * Delete genetic test
 */
export const deleteGeneticTest = async (testId: string) => {
  const { error } = await supabase
    .from('genetic_tests')
    .delete()
    .eq('id', testId);

  if (error) {
    console.error('Error deleting genetic test:', error);
    throw error;
  }

  return true;
};
