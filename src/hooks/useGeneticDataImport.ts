
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GeneticImportResult, TestResult } from '@/types/genetics';
import { 
  importEmbarkData, 
  importWisdomPanelData, 
  batchImportGeneticTests 
} from '@/services/genetics/batchGeneticTests';

export const useGeneticDataImport = (dogId: string) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<GeneticImportResult | null>(null);

  const importFromCSV = async (csvData: string): Promise<GeneticImportResult> => {
    setIsImporting(true);
    try {
      // Convert CSV string to File object
      const blob = new Blob([csvData], { type: 'text/csv' });
      const file = new File([blob], 'genetic-data.csv', { type: 'text/csv' });
      
      // Mock implementation for now
      const result: GeneticImportResult = {
        success: true,
        dogId: dogId,
        importedTests: [],
        provider: 'CSV Import',
        testsImported: 5,
        count: 5,
        errors: []
      };
      
      setImportResults(result);
      return result;
    } catch (error) {
      console.error('Error importing from CSV:', error);
      const errorResult: GeneticImportResult = {
        success: false,
        dogId: dogId,
        importedTests: [],
        provider: 'CSV Import',
        testsImported: 0,
        count: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
      setImportResults(errorResult);
      return errorResult;
    } finally {
      setIsImporting(false);
    }
  };

  const importManualTests = async (tests: Omit<TestResult, 'testId'>[]): Promise<GeneticImportResult> => {
    setIsImporting(true);
    try {
      // Call the service to process the manual tests
      const result = await batchImportGeneticTests(dogId, tests);
      
      setImportResults(result);
      return result;
    } catch (error) {
      console.error('Error importing manual tests:', error);
      const errorResult: GeneticImportResult = {
        success: false,
        dogId: dogId,
        importedTests: [],
        provider: 'Manual Import',
        testsImported: 0,
        count: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
      setImportResults(errorResult);
      return errorResult;
    } finally {
      setIsImporting(false);
    }
  };

  const importFromEmbark = async (file: File): Promise<GeneticImportResult> => {
    setIsImporting(true);
    try {
      const result = await importEmbarkData(dogId, file);
      setImportResults(result);
      return result;
    } catch (error) {
      console.error('Error importing from Embark:', error);
      const errorResult: GeneticImportResult = {
        success: false,
        dogId: dogId,
        importedTests: [],
        provider: 'Embark',
        testsImported: 0,
        count: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
      setImportResults(errorResult);
      return errorResult;
    } finally {
      setIsImporting(false);
    }
  };

  const importFromWisdomPanel = async (file: File): Promise<GeneticImportResult> => {
    setIsImporting(true);
    try {
      const result = await importWisdomPanelData(dogId, file);
      setImportResults(result);
      return result;
    } catch (error) {
      console.error('Error importing from Wisdom Panel:', error);
      const errorResult: GeneticImportResult = {
        success: false,
        dogId: dogId,
        importedTests: [],
        provider: 'Wisdom Panel',
        testsImported: 0,
        count: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
      setImportResults(errorResult);
      return errorResult;
    } finally {
      setIsImporting(false);
    }
  };

  return {
    isImporting,
    importResults,
    importFromCSV,
    importManualTests,
    importFromEmbark,
    importFromWisdomPanel
  };
};
