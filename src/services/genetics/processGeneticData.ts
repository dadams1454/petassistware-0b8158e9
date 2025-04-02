
import { DogGenotype, HealthMarker } from '@/types/genetics';

// Helper to extract color genetics from various data sources
export const extractColorGenetics = (rawData: any): DogGenotype['colorGenetics'] => {
  // Default structure
  const colorGenetics: DogGenotype['colorGenetics'] = {
    base_color: 'Unknown',
    brown_dilution: 'Unknown',
    dilution: 'Unknown',
    patterns: []
  };
  
  // Try to extract from different formats based on the testing company
  try {
    if (!rawData) return colorGenetics;
    
    // If the data already contains extracted color data
    if (rawData.colorGenetics) {
      return {
        ...colorGenetics,
        ...rawData.colorGenetics
      };
    }
    
    // Extract from EmbarkVet format
    if (rawData.traits && rawData.traits.coat_color) {
      const traitData = rawData.traits.coat_color;
      return {
        base_color: traitData.base_color || 'Unknown',
        brown_dilution: traitData.brown_dilution || 'Unknown',
        dilution: traitData.dilution || 'Unknown',
        patterns: traitData.patterns || []
      };
    }
    
    // Extract from WisdomPanel format
    if (rawData.trait_results && rawData.trait_results.coat_colors) {
      const traitData = rawData.trait_results.coat_colors;
      return {
        base_color: traitData.primary_color || 'Unknown',
        brown_dilution: traitData.modifiers?.brown || 'Unknown',
        dilution: traitData.modifiers?.dilution || 'Unknown',
        patterns: traitData.patterns || []
      };
    }
    
    // Return default if no matching format found
    return colorGenetics;
  } catch (error) {
    console.error('Error extracting color genetics:', error);
    return colorGenetics;
  }
};

// Helper to extract health test results
export const extractHealthMarkers = (rawData: any): DogGenotype['healthMarkers'] => {
  const healthMarkers: DogGenotype['healthMarkers'] = {};
  
  try {
    if (!rawData) return healthMarkers;
    
    // If data already contains extracted health markers
    if (rawData.healthMarkers) {
      return rawData.healthMarkers;
    }
    
    // Try to extract from different formats
    const healthData = 
      rawData.health_results || 
      rawData.health_traits || 
      rawData.health_markers ||
      {};
    
    // Extract from common format - iterate through all health tests
    Object.entries(healthData).forEach(([condition, data]: [string, any]) => {
      healthMarkers[condition] = {
        name: condition, // Add name field
        status: data.status || data.result || 'unknown',
        testDate: data.test_date || data.date || new Date().toISOString().slice(0, 10),
        source: data.source || data.provider || 'genetic_test'
      };
    });
    
    return healthMarkers;
  } catch (error) {
    console.error('Error extracting health markers:', error);
    return healthMarkers;
  }
};

// Helper to extract trait information
export const extractTraits = (rawData: any): DogGenotype['traits'] => {
  const traits: DogGenotype['traits'] = {};
  
  try {
    if (!rawData) return traits;
    
    // If data already contains traits
    if (rawData.traits) {
      return rawData.traits;
    }
    
    // Extract from trait_results which contains physical traits data
    const traitData = rawData.trait_results || {};
    
    // Filter out coat colors (handled separately) and extract remaining traits
    Object.entries(traitData).forEach(([trait, data]: [string, any]) => {
      if (trait !== 'coat_colors' && trait !== 'color_genetics') {
        traits[trait] = {
          value: data.value || data.result || 'unknown',
          description: data.description || ''
        };
      }
    });
    
    return traits;
  } catch (error) {
    console.error('Error extracting traits:', error);
    return traits;
  }
};

// Process raw genetic data into standardized format
export const processGeneticData = (rawData: any): DogGenotype => {
  try {
    const colorGenetics = extractColorGenetics(rawData);
    const healthMarkers = extractHealthMarkers(rawData);
    const traits = extractTraits(rawData);
    
    const baseColor = colorGenetics?.base_color || 'Unknown';
    const brownDilution = colorGenetics?.brown_dilution || 'Unknown';
    const dilution = colorGenetics?.dilution || 'Unknown';
    
    return {
      id: rawData.id,
      dog_id: rawData.dog_id,
      created_at: rawData.created_at,
      baseColor: baseColor,
      brownDilution: brownDilution,
      dilution: dilution,
      colorGenetics,
      healthMarkers,
      traits,
      // Include other fields as needed
      breedComposition: rawData.breed_composition || {}
    };
  } catch (error) {
    console.error('Error processing genetic data:', error);
    return {
      id: rawData.id,
      dog_id: rawData.dog_id,
      baseColor: 'Unknown',
      brownDilution: 'Unknown',
      dilution: 'Unknown',
      colorGenetics: {
        base_color: 'Unknown',
        brown_dilution: 'Unknown',
        dilution: 'Unknown',
        patterns: []
      },
      healthMarkers: {},
      traits: {},
      breedComposition: {}
    };
  }
};
