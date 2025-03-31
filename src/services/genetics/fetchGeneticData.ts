
import { supabase } from '@/integrations/supabase/client';
import { DogGenotype } from '@/types/genetics';

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
    
    // Return the combined data
    return {
      dog: dogData,
      geneticTests: geneticTests || []
    };
  } catch (error) {
    console.error('Error fetching genetic data:', error);
    throw error;
  }
}
