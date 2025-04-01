
import { supabase } from '@/integrations/supabase/client';

export interface GeneticImportResult {
  success: boolean;
  provider: string;
  testsImported: number;
  errors?: string[];
}

export async function batchImportGeneticTests(dogId: string, tests: any[]): Promise<GeneticImportResult> {
  try {
    if (!dogId) {
      return {
        success: false,
        provider: 'unknown',
        testsImported: 0,
        errors: ['Missing dog ID']
      };
    }

    if (!tests || tests.length === 0) {
      return {
        success: false,
        provider: 'unknown',
        testsImported: 0,
        errors: ['No tests provided']
      };
    }
    
    // Map tests to have dog_id
    const testsWithDogId = tests.map(test => ({
      ...test,
      dog_id: dogId
    }));
    
    // Insert tests in the database
    const { data, error } = await supabase
      .from('dog_genetic_tests')
      .insert(testsWithDogId);
      
    if (error) {
      console.error('Error importing genetic tests:', error);
      return {
        success: false,
        provider: 'manual',
        testsImported: 0,
        errors: [error.message]
      };
    }
    
    // Create audit log entry
    await supabase.from('genetic_audit_logs').insert({
      dog_id: dogId,
      action: 'batch_import',
      details: {
        count: tests.length,
        tests: tests.map(t => t.test_type || t.test_name)
      }
    });
    
    return {
      success: true,
      provider: 'manual',
      testsImported: tests.length
    };
    
  } catch (error: any) {
    console.error('Error in batch import:', error);
    return {
      success: false,
      provider: 'manual',
      testsImported: 0,
      errors: [error.message || 'Unknown error during import']
    };
  }
}

export async function importEmbarkData(dogId: string, file: File | null): Promise<GeneticImportResult> {
  // This would normally parse the Embark-specific format
  // For now, we'll return a placeholder success result
  return {
    success: true,
    provider: 'Embark',
    testsImported: 12, // Placeholder value
  };
}

export async function importWisdomPanelData(dogId: string, file: File | null): Promise<GeneticImportResult> {
  // This would normally parse the Wisdom Panel-specific format
  // For now, we'll return a placeholder success result
  return {
    success: true,
    provider: 'Wisdom Panel',
    testsImported: 8, // Placeholder value
  };
}
