import { useState, useEffect } from 'react';
import { useDogGenetics } from './useDogGenetics';

// Just showing the problem area
export const useGeneticPairing = (sireId: string, damId: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pairingResults, setPairingResults] = useState<any>(null);
  const [healthRisks, setHealthRisks] = useState<string[]>([]);
  
  // Get genetic data for sire and dam
  const { 
    dogData: sireData, 
    isLoading: sireLoading, 
    error: sireError 
  } = useDogGenetics(sireId);
  
  const { 
    dogData: damData, 
    isLoading: damLoading, 
    error: damError 
  } = useDogGenetics(damId);
  
  useEffect(() => {
    const analyzePairing = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Wait for both dogs' genetic data to load
        if (sireLoading || damLoading) return;
        
        // Check for errors
        if (sireError) throw sireError;
        if (damError) throw damError;
        
        // Check if we have data for both dogs
        if (!sireData || !damData) {
          throw new Error('Missing genetic data for one or both dogs');
        }
        
        // Calculate genetic compatibility and potential outcomes
        const results = calculateCompatibility();
        setPairingResults(results);
        
        // Identify potential health risks
        const risks = identifyHealthRisks();
        setHealthRisks(risks);
      } catch (err) {
        console.error('Error analyzing genetic pairing:', err);
        setError(err instanceof Error ? err : new Error('Failed to analyze genetic pairing'));
      } finally {
        setIsLoading(false);
      }
    };
    
    analyzePairing();
  }, [sireData, damData, sireLoading, damLoading, sireError, damError]);
  
  // Calculate genetic compatibility between sire and dam
  const calculateCompatibility = () => {
    if (!sireData || !damData) {
      return {
        compatibilityScore: 0,
        matchedTraits: [],
        conflictingTraits: [],
        potentialColors: [],
        isCompatible: false
      };
    }
    
    // This is a simplified example - real genetic compatibility would be more complex
    const matchedTraits = [];
    const conflictingTraits = [];
    
    // Check color genetics
    if (sireData.baseColor === damData.baseColor) {
      matchedTraits.push(`Base color: ${sireData.baseColor}`);
    } else {
      conflictingTraits.push(`Base color: Sire ${sireData.baseColor}, Dam ${damData.baseColor}`);
    }
    
    // Check dilution
    if (sireData.dilution === damData.dilution) {
      matchedTraits.push(`Dilution: ${sireData.dilution}`);
    } else {
      conflictingTraits.push(`Dilution: Sire ${sireData.dilution}, Dam ${damData.dilution}`);
    }
    
    // Calculate potential puppy colors
    const potentialColors = calculatePotentialColors(sireData, damData);
    
    // Calculate compatibility score (simplified)
    const compatibilityScore = Math.round((matchedTraits.length / (matchedTraits.length + conflictingTraits.length)) * 100) || 0;
    
    // Replace string[] with boolean
    const isCompatible = matchedTraits.length > 0; // Convert to boolean
    
    return {
      compatibilityScore,
      matchedTraits,
      conflictingTraits,
      potentialColors,
      isCompatible, // Now it's a boolean
    };
  };
  
  // Calculate potential puppy colors based on parents' genetics
  const calculatePotentialColors = (sire: any, dam: any) => {
    // This is a simplified example - real color genetics would be more complex
    const potentialColors = new Set<string>();
    
    // Add parent colors as possibilities
    if (sire.baseColor && sire.baseColor !== 'unknown') potentialColors.add(sire.baseColor);
    if (dam.baseColor && dam.baseColor !== 'unknown') potentialColors.add(dam.baseColor);
    
    // Add potential diluted colors
    if (sire.dilution === 'carrier' || dam.dilution === 'carrier' || 
        sire.dilution === 'affected' || dam.dilution === 'affected') {
      
      // Add diluted versions of base colors
      if (potentialColors.has('black')) potentialColors.add('blue');
      if (potentialColors.has('liver')) potentialColors.add('isabella');
      if (potentialColors.has('red')) potentialColors.add('cream');
    }
    
    return Array.from(potentialColors);
  };
  
  // Identify potential health risks in the pairing
  const identifyHealthRisks = () => {
    if (!sireData || !damData) return [];
    
    const risks: string[] = [];
    
    // Check for common genetic health issues
    // This is a simplified example - real health risk analysis would be more complex
    
    // Check if both parents carry the same recessive health conditions
    const sireHealthIssues = sireData.healthResults || [];
    const damHealthIssues = damData.healthResults || [];
    
    // Find matching carrier status
    sireHealthIssues.forEach((sireIssue: any) => {
      if (sireIssue.status === 'carrier') {
        const matchingDamIssue = damHealthIssues.find(
          (damIssue: any) => damIssue.condition === sireIssue.condition && damIssue.status === 'carrier'
        );
        
        if (matchingDamIssue) {
          risks.push(`Both parents are carriers for ${sireIssue.condition}`);
        }
      }
    });
    
    // Add breed-specific risks
    if (sireData.breed === damData.breed) {
      // Add common breed-specific issues
      switch (sireData.breed) {
        case 'Labrador Retriever':
          risks.push('Hip dysplasia risk');
          risks.push('Exercise-induced collapse risk');
          break;
        case 'German Shepherd':
          risks.push('Hip/elbow dysplasia risk');
          risks.push('Degenerative myelopathy risk');
          break;
        case 'Bulldog':
          risks.push('Brachycephalic airway syndrome risk');
          risks.push('Heat intolerance risk');
          break;
        // Add more breeds as needed
      }
    }
    
    return risks;
  };
  
  return {
    isLoading,
    error,
    pairingResults,
    healthRisks,
    sireGenetics: sireData,
    damGenetics: damData,
    refresh: () => {
      // Force a refresh of the analysis
      setIsLoading(true);
    }
  };
};
