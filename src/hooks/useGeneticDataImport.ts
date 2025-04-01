
import { useState } from 'react';
import { toast } from 'sonner';
import { batchImportGeneticTests, importGeneticTestsFromCSV } from '@/services/genetics/batchGeneticTests';
import { TestResult } from '@/types/genetics';

export const useGeneticDataImport = (dogId: string) => {
  const [isImporting, setIsImporting] = useState(false);
  
  // Function to import from CSV
  const importFromCSV = async (csvText: string) => {
    if (!csvText) {
      toast.error('Please provide CSV data');
      return;
    }
    
    setIsImporting(true);
    try {
      const result = await importGeneticTestsFromCSV(dogId, csvText);
      
      if (result.success) {
        toast.success(`Successfully imported ${result.count} genetic tests`);
      } else {
        toast.error(`Failed to import tests: ${result.errors?.join(', ')}`);
      }
      
      return result;
    } catch (error) {
      console.error('Error importing CSV:', error);
      toast.error(`Import failed: ${(error as Error).message}`);
      return { success: false, count: 0, errors: [(error as Error).message] };
    } finally {
      setIsImporting(false);
    }
  };
  
  // Function to import tests manually
  const importManualTests = async (tests: Omit<TestResult, 'testId'>[]) => {
    if (!tests.length) {
      toast.error('No tests provided');
      return;
    }
    
    setIsImporting(true);
    try {
      const result = await batchImportGeneticTests({
        dogId,
        tests,
        source: 'manual'
      });
      
      if (result.success) {
        toast.success(`Successfully added ${result.count} genetic tests`);
      } else {
        toast.error(`Failed to add tests: ${result.errors?.join(', ')}`);
      }
      
      return result;
    } catch (error) {
      console.error('Error adding manual tests:', error);
      toast.error(`Adding tests failed: ${(error as Error).message}`);
      return { success: false, count: 0, errors: [(error as Error).message] };
    } finally {
      setIsImporting(false);
    }
  };
  
  return {
    isImporting,
    importFromCSV,
    importManualTests
  };
};
