import { supabase } from '@/integrations/supabase/client';
import { DogGenotype, GeneticImportResult, HealthResult, HealthMarker } from '@/types/genetics';
import { BreedComposition, ColorGenetics, GeneticTraitResults } from '@/types/common';
import { Json } from '@/types/supabase';

export const getDogGenetics = async (dogId: string): Promise<DogGenotype | null> => {
  try {
    const { data, error } = await supabase
      .from('genetic_data')
      .select('*')
      .eq('dog_id', dogId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw error;
    }

    if (!data) return null;

    // Transform database data to DogGenotype format with proper type safety
    const breedComposition = data.breed_composition as BreedComposition || {};
    const traitResults = data.trait_results as GeneticTraitResults || {};
    const colorGenetics = traitResults?.color || {};
    const healthResults = data.health_results as Record<string, HealthMarker> || {};

    return {
      dog_id: data.dog_id,
      id: data.id,
      name: data.name || 'Unknown',
      breed: breedComposition?.primary || 'Mixed Breed',
      baseColor: colorGenetics?.base || 'Unknown',
      brownDilution: colorGenetics?.brown_dilution || 'Unknown',
      dilution: colorGenetics?.dilution || 'Unknown',
      agouti: colorGenetics?.agouti || 'Unknown',
      healthMarkers: healthResults,
      updated_at: data.updated_at,
      colorGenetics: colorGenetics || {},
      traits: traitResults || {}
    };
  } catch (error) {
    console.error('Error fetching dog genetics:', error);
    return null;
  }
};

export const saveGeneticTest = async (data: any): Promise<{ id: string }> => {
  try {
    const { data: result, error } = await supabase
      .from('dog_genetic_tests')
      .insert(data)
      .select('id')
      .single();

    if (error) throw error;
    return { id: result.id };
  } catch (error) {
    console.error('Error saving genetic test:', error);
    throw new Error('Failed to save genetic test');
  }
};

export const importGeneticData = async (
  dogId: string,
  importData: any,
  provider: string
): Promise<GeneticImportResult> => {
  try {
    // Insert a record in genetic_data
    const { data, error } = await supabase
      .from('genetic_data')
      .insert({
        dog_id: dogId,
        import_source: provider,
        raw_data: importData,
        breed_composition: extractBreedComposition(importData, provider),
        health_results: extractHealthResults(importData, provider),
        trait_results: extractTraitResults(importData, provider)
      })
      .select()
      .single();

    if (error) throw error;

    // Log the import in audit log
    await supabase
      .from('genetic_audit_logs')
      .insert({
        dog_id: dogId,
        action: 'IMPORT',
        details: {
          provider,
          timestamp: new Date().toISOString()
        }
      });

    const healthResults = data?.health_results as Record<string, any> || {};
    const healthResultsCount = Object.keys(healthResults).length;

    return {
      success: true,
      dogId,
      provider,
      testsImported: healthResultsCount,
      importedTests: healthResultsCount
    };
  } catch (error) {
    console.error('Error importing genetic data:', error);
    return {
      success: false,
      dogId,
      provider,
      testsImported: 0,
      errors: [(error as Error).message]
    };
  }
};

export const getHealthResults = async (dogId: string): Promise<HealthResult[]> => {
  try {
    const { data: geneticData, error } = await supabase
      .from('genetic_data')
      .select('health_results')
      .eq('dog_id', dogId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return []; // Not found
      }
      throw error;
    }

    const healthResults = geneticData?.health_results as Record<string, any> || {};
    
    // Convert the health_results object to an array of HealthResult objects
    const results: HealthResult[] = [];
    Object.entries(healthResults).forEach(([condition, data]) => {
      if (typeof data === 'object' && data !== null) {
        const healthData = data as Record<string, any>;
        results.push({
          condition,
          result: healthData.status || 'Unknown',
          tested_date: healthData.test_date || new Date().toISOString(),
          lab: healthData.lab || 'Unknown'
        });
      }
    });

    return results;
  } catch (error) {
    console.error('Error fetching health results:', error);
    return [];
  }
};

// Helper function to process Embark data
export const processEmbarkData = (data: any, dogId: string): GeneticImportResult => {
  try {
    // Validate the data format
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid Embark data format');
    }

    // Extract the relevant information
    const healthResults = extractHealthResultsFromEmbark(data);
    const traitResults = extractTraitResultsFromEmbark(data);
    const breedComposition = extractBreedCompositionFromEmbark(data);

    return {
      success: true,
      dogId,
      provider: 'Embark',
      testsImported: Object.keys(healthResults).length
    };
  } catch (error) {
    console.error('Error processing Embark data:', error);
    return {
      success: false,
      dogId,
      provider: 'Embark',
      testsImported: 0,
      errors: [(error as Error).message]
    };
  }
};

// Helper function to process Wisdom Panel data
export const processWisdomPanelData = (data: any, dogId: string): GeneticImportResult => {
  try {
    // Implementation similar to Embark, but for Wisdom Panel format
    return {
      success: true,
      dogId,
      provider: 'Wisdom Panel',
      testsImported: 0
    };
  } catch (error) {
    console.error('Error processing Wisdom Panel data:', error);
    return {
      success: false,
      dogId,
      provider: 'Wisdom Panel',
      testsImported: 0,
      errors: [(error as Error).message]
    };
  }
};

// Helper function to process Optigen data
export const processOptigenData = (data: any, dogId: string): GeneticImportResult => {
  try {
    // Implementation for Optigen format
    return {
      success: true,
      dogId,
      provider: 'Optigen',
      testsImported: 0
    };
  } catch (error) {
    console.error('Error processing Optigen data:', error);
    return {
      success: false,
      dogId,
      provider: 'Optigen',
      testsImported: 0,
      errors: [(error as Error).message]
    };
  }
};

// Helper function to process PawPrint data
export const processPawPrintData = (data: any, dogId: string): GeneticImportResult => {
  try {
    // Implementation for PawPrint format
    return {
      success: true,
      dogId,
      provider: 'PawPrint',
      testsImported: 0
    };
  } catch (error) {
    console.error('Error processing PawPrint data:', error);
    return {
      success: false,
      dogId,
      provider: 'PawPrint',
      testsImported: 0,
      errors: [(error as Error).message]
    };
  }
};

// Helper functions for extracting data from different genetic test providers
function extractHealthResultsFromEmbark(data: any): Record<string, any> {
  const healthResults: Record<string, any> = {};
  
  // Mock implementation for demonstration
  if (data.health_results) {
    Object.entries(data.health_results).forEach(([key, value]) => {
      healthResults[key] = {
        status: value,
        test_date: new Date().toISOString(),
        lab: 'Embark'
      };
    });
  }
  
  return healthResults;
}

function extractTraitResultsFromEmbark(data: any): Record<string, any> {
  // Mock implementation
  return data.traits || {};
}

function extractBreedCompositionFromEmbark(data: any): Record<string, any> {
  // Mock implementation
  return data.breed_composition || { primary: 'Unknown' };
}

// Generic extraction functions that determine which provider-specific function to use
function extractHealthResults(data: any, provider: string): Record<string, any> {
  switch (provider.toLowerCase()) {
    case 'embark':
      return extractHealthResultsFromEmbark(data);
    // Add cases for other providers
    default:
      return {};
  }
}

function extractTraitResults(data: any, provider: string): Record<string, any> {
  switch (provider.toLowerCase()) {
    case 'embark':
      return extractTraitResultsFromEmbark(data);
    // Add cases for other providers
    default:
      return {};
  }
}

function extractBreedComposition(data: any, provider: string): Record<string, any> {
  switch (provider.toLowerCase()) {
    case 'embark':
      return extractBreedCompositionFromEmbark(data);
    // Add cases for other providers
    default:
      return { primary: 'Unknown' };
  }
}
