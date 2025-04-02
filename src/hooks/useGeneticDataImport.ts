
import { useState } from 'react';
import { GeneticImportResult, TestResult } from '@/types/genetics';
import { 
  processEmbarkData, 
  processWisdomPanelData, 
  processOptigenData, 
  processPawPrintData 
} from '@/services/geneticsService';

export const useGeneticDataImport = (dogId: string) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<GeneticImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const importEmbarkData = async (fileData: string) => {
    setIsImporting(true);
    setError(null);
    
    try {
      // Parse JSON data from Embark
      const parsedData = JSON.parse(fileData);
      
      // Process the data
      const result = processEmbarkData(parsedData, dogId);
      
      setImportResult({
        success: result.success,
        dogId: result.dogId,
        provider: 'Embark',
        testsImported: result.testsImported,
        errors: result.errors
      });
      
      return result.success;
    } catch (error: any) {
      setError(`Failed to import Embark data: ${error.message}`);
      setImportResult({
        success: false,
        dogId,
        provider: 'Embark',
        testsImported: 0,
        errors: [`Failed to import: ${error.message}`]
      });
      return false;
    } finally {
      setIsImporting(false);
    }
  };

  const importWisdomPanelData = async (fileData: string) => {
    setIsImporting(true);
    setError(null);
    
    try {
      // Parse CSV or JSON data from Wisdom Panel
      const processedData = fileData; // In a real implementation, we would parse the data
      
      // Process the data
      const result = processWisdomPanelData(processedData, dogId);
      
      setImportResult({
        success: result.success,
        dogId: result.dogId,
        provider: 'Wisdom Panel',
        testsImported: result.testsImported,
        errors: result.errors
      });
      
      return result.success;
    } catch (error: any) {
      setError(`Failed to import Wisdom Panel data: ${error.message}`);
      setImportResult({
        success: false,
        dogId,
        provider: 'Wisdom Panel',
        testsImported: 0,
        errors: [`Failed to import: ${error.message}`]
      });
      return false;
    } finally {
      setIsImporting(false);
    }
  };

  const importOptigenData = async (fileData: string) => {
    // Similar implementation as above
    return false;
  };

  const importPawPrintData = async (fileData: string) => {
    // Similar implementation as above
    return false;
  };

  const importManualTests = async (tests: TestResult[]) => {
    setIsImporting(true);
    setError(null);
    
    try {
      // In a real implementation, we would save these tests to the database
      
      setImportResult({
        success: true,
        dogId,
        provider: 'Manual Entry',
        testsImported: tests.length,
        errors: []
      });
      
      return true;
    } catch (error: any) {
      setError(`Failed to import manual tests: ${error.message}`);
      setImportResult({
        success: false,
        dogId,
        provider: 'Manual Entry',
        testsImported: 0,
        errors: [`Failed to import: ${error.message}`]
      });
      return false;
    } finally {
      setIsImporting(false);
    }
  };

  return {
    isImporting,
    importResult,
    error,
    importEmbarkData,
    importWisdomPanelData,
    importOptigenData,
    importPawPrintData,
    importManualTests
  };
};
