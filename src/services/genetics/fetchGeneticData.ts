
import { supabase } from '@/integrations/supabase/client';
import { DogGenotype } from '@/types/genetics';
import { batchImportGeneticTests } from './batchGeneticTests';

export async function fetchDogGeneticData(dogId: string) {
  try {
    // Fetch the dog's genetic test data
    const { data: geneticTests, error: geneticError } = await supabase
      .from('dog_genetic_tests')
      .select('*')
      .eq('dog_id', dogId);
    
    if (geneticError) throw geneticError;
    
    // Fetch the dog's basic information
    const { data: dogData, error: dogError } = await supabase
      .from('dogs')
      .select('*')
      .eq('id', dogId)
      .single();
    
    if (dogError) throw dogError;
    
    // Fetch COI data if available
    const { data: coiData, error: coiError } = await supabase
      .from('dog_genetic_calculations')
      .select('*')
      .eq('dog_id', dogId)
      .eq('calculation_type', 'COI')
      .order('calculation_date', { ascending: false })
      .limit(1);
    
    if (coiError) console.warn('Error fetching COI data:', coiError);
    
    // Return the combined data
    return {
      dog: dogData,
      geneticTests: geneticTests || [],
      coiData: coiData?.[0] || null
    };
  } catch (error) {
    console.error('Error fetching genetic data:', error);
    throw error;
  }
}

export async function fetchBreedGeneticStatistics(breed: string) {
  try {
    // Fetch breed-specific genetic statistics
    const { data, error } = await supabase
      .from('breed_genetic_statistics')
      .select('*')
      .eq('breed', breed.toLowerCase());
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching breed genetic statistics:', error);
    return [];
  }
}

// Function to calculate COI (Coefficient of Inbreeding)
export async function calculateCOI(dogId: string, generations: number = 5) {
  try {
    // This would normally be a complex calculation using pedigree data
    // For now, return a mock COI value between 1-15%
    const mockCOI = Math.random() * 14 + 1;
    
    // Store the calculated COI
    const { data, error } = await supabase
      .from('dog_genetic_calculations')
      .insert({
        dog_id: dogId,
        calculation_type: 'COI',
        value: mockCOI,
        calculation_date: new Date().toISOString()
      });
    
    if (error) throw error;
    
    return mockCOI;
  } catch (error) {
    console.error('Error calculating COI:', error);
    throw error;
  }
}

// Export the batchImportGeneticTests function
export { batchImportGeneticTests };
