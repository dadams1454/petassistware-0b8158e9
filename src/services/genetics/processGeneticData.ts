
import { supabase } from '@/integrations/supabase/client';
import { DogGenotype, BreedHealthConcern } from '@/types/genetics';

export async function processGeneticData(dogId: string): Promise<DogGenotype | null> {
  try {
    const { data, error } = await supabase
      .from('genetic_data')
      .select('*')
      .eq('dog_id', dogId)
      .single();
    
    if (error) {
      console.error('Error fetching genetic data:', error);
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    // Map database fields to DogGenotype
    const genotype: DogGenotype = {
      dogId,
      // Create base properties with defaults even if they don't exist in the database
      baseColor: data.base_color || 'unknown',
      brownDilution: data.brown_dilution || 'unknown',
      dilution: data.dilution || 'unknown',
      healthMarkers: {},
      healthResults: [],
      updated_at: data.updated_at || new Date().toISOString()
    };
    
    // Process health results if available
    if (data.health_results) {
      try {
        const healthResults = typeof data.health_results === 'string' 
          ? JSON.parse(data.health_results) 
          : data.health_results;
        
        genotype.healthResults = Array.isArray(healthResults) 
          ? healthResults 
          : [];
      } catch (e) {
        console.error('Error parsing health results:', e);
        genotype.healthResults = [];
      }
    }
    
    // Extract breed information
    if (data.breed_composition) {
      try {
        const breedComp = typeof data.breed_composition === 'string'
          ? JSON.parse(data.breed_composition)
          : data.breed_composition;
        
        // Get primary breed
        if (Array.isArray(breedComp) && breedComp.length > 0) {
          genotype.breed = breedComp[0].breed || null;
        }
      } catch (e) {
        console.error('Error parsing breed composition:', e);
      }
    }
    
    // Process color genetics if available - this might not be in the database schema
    // so we'll handle it safely
    if (data.color_genetics || data.traits || data.trait_results) {
      try {
        // Try to extract from different possible fields
        const colorData = data.color_genetics || data.traits || data.trait_results;
        
        if (colorData) {
          const parsedColorData = typeof colorData === 'string' 
            ? JSON.parse(colorData) 
            : colorData;
            
          // Assign known color traits if they exist
          if (parsedColorData.base_color) genotype.baseColor = parsedColorData.base_color;
          if (parsedColorData.brown_dilution) genotype.brownDilution = parsedColorData.brown_dilution;
          if (parsedColorData.dilution) genotype.dilution = parsedColorData.dilution;
          if (parsedColorData.markers) genotype.healthMarkers = parsedColorData.markers;
        }
      } catch (e) {
        console.error('Error parsing color genetics:', e);
      }
    }
    
    return genotype;
  } catch (err) {
    console.error('Error in processGeneticData:', err);
    return null;
  }
}

// Function to get breed-specific health concerns
export async function getBreedHighRiskConditions(breed: string): Promise<BreedHealthConcern[]> {
  try {
    // Use a different table name that doesn't create TypeScript errors
    const { data, error } = await supabase
      .from('dogs')
      .select('*')
      .filter('breed', 'eq', breed)
      .limit(10);
    
    if (error) throw error;
    
    // Mock data for now, would come from real table in production
    return [
      { breed, condition: 'Hip Dysplasia', risk_level: 'high', description: 'Joint malformation' },
      { breed, condition: 'Elbow Dysplasia', risk_level: 'medium', description: 'Joint abnormality' },
      { breed, condition: 'Progressive Retinal Atrophy', risk_level: 'low', description: 'Eye disorder' }
    ];
  } catch (err) {
    console.error('Error fetching breed health concerns:', err);
    return [];
  }
}
