
import { useState, useEffect } from 'react';
import { useDogGenetics } from './useDogGenetics';
import { PairingAnalysis, HealthWarning, DogGenotype, HealthMarker } from '@/types/genetics';

interface UseGeneticPairingReturn {
  analysis: PairingAnalysis | null;
  loading: boolean;
  error: Error | null;
  sireGenetics: DogGenotype | null;
  damGenetics: DogGenotype | null;
}

/**
 * Custom hook to analyze genetic compatibility between two dogs
 */
export function useGeneticPairing(sireId: string, damId: string): UseGeneticPairingReturn {
  // Use the useDogGenetics hook to fetch data for both dogs
  const { geneticData: sireGenetics, loading: sireLoading, error: sireError } = useDogGenetics(sireId);
  const { geneticData: damGenetics, loading: damLoading, error: damError } = useDogGenetics(damId);
  
  // State for analysis results
  const [analysis, setAnalysis] = useState<PairingAnalysis | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  // Combine loading states and errors
  const loading = sireLoading || damLoading;
  
  useEffect(() => {
    // Reset analysis when IDs change
    setAnalysis(null);
    setError(null);
    
    // Skip if IDs are not provided or data is still loading
    if (!sireId || !damId || loading) {
      return;
    }
    
    // Handle errors
    if (sireError) {
      setError(sireError);
      return;
    }
    
    if (damError) {
      setError(damError);
      return;
    }
    
    // Skip if data is not available
    if (!sireGenetics || !damGenetics) {
      return;
    }
    
    try {
      // Perform analysis
      const compatibilityAnalysis = analyzeGenetics(sireGenetics, damGenetics);
      setAnalysis(compatibilityAnalysis);
    } catch (err) {
      console.error('Error analyzing genetic compatibility:', err);
      setError(err instanceof Error ? err : new Error('Error analyzing genetics'));
    }
  }, [sireId, damId, sireGenetics, damGenetics, sireError, damError, loading]);
  
  return {
    analysis,
    loading,
    error,
    sireGenetics,
    damGenetics
  };
}

/**
 * Helper function to analyze genetic compatibility between two dogs
 */
function analyzeGenetics(sireGenetics: DogGenotype, damGenetics: DogGenotype): PairingAnalysis {
  // Start with empty results
  const healthWarnings: HealthWarning[] = [];
  const compatibleTests: string[] = [];
  const incompatibleTests: string[] = [];
  
  // Calculate coefficient of inbreeding
  // This is typically a complex calculation based on pedigree data
  // For now, we'll use a placeholder value
  const coi = calculateCOI(sireGenetics, damGenetics);
  
  // Check for health condition carrier status
  for (const [condition, sireMarker] of Object.entries(sireGenetics.healthMarkers)) {
    // Check if both dogs have data for this condition
    if (damGenetics.healthMarkers[condition]) {
      const damMarker = damGenetics.healthMarkers[condition];
      
      // Add to compatible tests list if both are clear
      if (sireMarker.status === 'clear' && damMarker.status === 'clear') {
        compatibleTests.push(condition);
      }
      
      // Check for carrier × carrier scenarios
      if (sireMarker.status === 'carrier' && damMarker.status === 'carrier') {
        healthWarnings.push({
          condition: formatConditionName(condition),
          riskLevel: 'critical',
          description: `Both parents are carriers for ${formatConditionName(condition)}`,
          affectedPercentage: 25
        });
        incompatibleTests.push(condition);
      }
      
      // Check for affected × carrier scenarios
      if ((sireMarker.status === 'affected' && damMarker.status === 'carrier') ||
          (sireMarker.status === 'carrier' && damMarker.status === 'affected')) {
        healthWarnings.push({
          condition: formatConditionName(condition),
          riskLevel: 'high',
          description: `One parent is affected and one is a carrier for ${formatConditionName(condition)}`,
          affectedPercentage: 50
        });
        incompatibleTests.push(condition);
      }
      
      // Check for affected × affected scenarios
      if (sireMarker.status === 'affected' && damMarker.status === 'affected') {
        healthWarnings.push({
          condition: formatConditionName(condition),
          riskLevel: 'critical',
          description: `Both parents are affected with ${formatConditionName(condition)}`,
          affectedPercentage: 100
        });
        incompatibleTests.push(condition);
      }
    }
  }
  
  // Check COI level for warnings
  if (coi > 12.5) {
    healthWarnings.push({
      condition: 'High Inbreeding',
      riskLevel: 'high',
      description: `COI of ${coi.toFixed(1)}% exceeds recommended maximum (12.5%)`
    });
  } else if (coi > 6.25) {
    healthWarnings.push({
      condition: 'Moderate Inbreeding',
      riskLevel: 'medium',
      description: `COI of ${coi.toFixed(1)}% is above ideal level (6.25%)`
    });
  }
  
  // Calculate trait predictions
  const traitPredictions = {
    color: calculateColorProbabilities(sireGenetics, damGenetics),
    size: estimateSize(sireGenetics, damGenetics),
    coat: predictCoatType(sireGenetics, damGenetics)
  };
  
  return {
    coi,
    healthWarnings,
    compatibleTests,
    incompatibleTests,
    traitPredictions
  };
}

/**
 * Calculate the coefficient of inbreeding (COI)
 * This is a placeholder for a more complex pedigree analysis
 */
function calculateCOI(sireGenetics: DogGenotype, damGenetics: DogGenotype): number {
  // In a real implementation, this would analyze the pedigree
  // to find common ancestors and calculate COI
  // For now, we'll return a placeholder value
  return 4.2;
}

/**
 * Calculate the probability distribution of offspring coat colors
 */
function calculateColorProbabilities(sireGenetics: DogGenotype, damGenetics: DogGenotype): Record<string, number> {
  // Parse genotypes
  const sireBase = sireGenetics.baseColor.split('/');
  const damBase = damGenetics.baseColor.split('/');
  
  const sireBrown = sireGenetics.brownDilution.split('/');
  const damBrown = damGenetics.brownDilution.split('/');
  
  const sireDilution = sireGenetics.dilution.split('/');
  const damDilution = damGenetics.dilution.split('/');
  
  // Initialize outcome counter
  const colorOutcomes: Record<string, number> = {};
  let totalOutcomes = 0;
  
  // Calculate for each possible allele combination
  for (const sireAllele1 of sireBase) {
    for (const damAllele1 of damBase) {
      for (const sireAllele2 of sireBrown) {
        for (const damAllele2 of damBrown) {
          for (const sireAllele3 of sireDilution) {
            for (const damAllele3 of damDilution) {
              // Generate genotype for this combination
              const baseGenotype = sortAlleles(sireAllele1 + damAllele1);
              const brownGenotype = sortAlleles(sireAllele2 + damAllele2);
              const dilutionGenotype = sortAlleles(sireAllele3 + damAllele3);
              
              // Determine the phenotype (actual color)
              const phenotype = determinePhenotype(
                baseGenotype, 
                brownGenotype, 
                dilutionGenotype
              );
              
              // Increment count for this phenotype
              colorOutcomes[phenotype] = (colorOutcomes[phenotype] || 0) + 1;
              totalOutcomes++;
            }
          }
        }
      }
    }
  }
  
  // Convert to percentages
  const percentages: Record<string, number> = {};
  for (const [color, count] of Object.entries(colorOutcomes)) {
    percentages[color] = Math.round((count / totalOutcomes) * 100);
  }
  
  return percentages;
}

/**
 * Helper function to sort alleles (dominant first)
 */
function sortAlleles(genotype: string): string {
  if (genotype.length !== 2) return genotype;
  
  const alleles = genotype.split('');
  
  // Sort so capital (dominant) letters come first
  alleles.sort((a, b) => {
    if (a === a.toUpperCase() && b !== b.toUpperCase()) return -1;
    if (a !== a.toUpperCase() && b === b.toUpperCase()) return 1;
    return a.localeCompare(b);
  });
  
  return alleles.join('');
}

/**
 * Determine phenotype based on genotype
 */
function determinePhenotype(
  baseGenotype: string,
  brownGenotype: string,
  dilutionGenotype: string
): string {
  // E is dominant (black-based), e is recessive (red-based)
  const isBlackBased = baseGenotype.includes('E');
  
  // B is dominant (no brown), b is recessive (brown)
  const hasBrownDilution = brownGenotype === 'bb';
  
  // D is dominant (no dilution), d is recessive (dilute)
  const hasDilution = dilutionGenotype === 'dd';
  
  // Determine base color
  if (!isBlackBased) {
    // Red-based colors
    if (hasDilution) {
      return 'Cream';
    }
    return 'Red';
  } else {
    // Black-based colors
    if (hasBrownDilution) {
      // Brown variants
      if (hasDilution) {
        return 'Light Brown';
      }
      return 'Brown';
    } else {
      // Black variants
      if (hasDilution) {
        return 'Grey';
      }
      return 'Black';
    }
  }
}

/**
 * Estimate size range for offspring
 */
function estimateSize(sireGenetics: DogGenotype, damGenetics: DogGenotype): { males: string; females: string } {
  // In a real implementation, this would use actual genetics and historical data
  // For now, we'll return placeholder values for Newfoundlands
  return {
    males: '145-160 lbs',
    females: '115-130 lbs'
  };
}

/**
 * Predict coat type for offspring
 */
function predictCoatType(sireGenetics: DogGenotype, damGenetics: DogGenotype): string {
  // In a real implementation, this would use actual genetics
  // For now, we'll return a placeholder for Newfoundlands
  return 'Straight coat, standard length';
}

/**
 * Format condition names for display
 */
function formatConditionName(condition: string): string {
  // Convert common abbreviations
  const abbreviations: Record<string, string> = {
    'DM': 'Degenerative Myelopathy',
    'DCM': 'Dilated Cardiomyopathy',
    'vWD': 'von Willebrand Disease',
    'PRA': 'Progressive Retinal Atrophy'
  };
  
  if (abbreviations[condition]) {
    return abbreviations[condition];
  }
  
  // Otherwise capitalize each word
  return condition
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default useGeneticPairing;
