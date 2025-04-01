import { supabase, customSupabase } from '@/integrations/supabase/client';
import { DogGenotype, HealthMarker, PairingAnalysis, HealthWarning } from '@/types/genetics';
import { Dog } from '@/types/dog';

/**
 * Get breeding compatibility analysis between two dogs
 */
export const getBreedingCompatibility = async (
  sireId: string,
  damId: string
): Promise<PairingAnalysis> => {
  // Fetch genetic data for both dogs
  const sireData = await fetchDogGeneticData(sireId);
  const damData = await fetchDogGeneticData(damId);
  
  // Calculate coefficient of inbreeding
  const coi = await calculateCoefficient(sireId, damId);
  
  // Calculate health compatibility
  const healthAnalysis = analyzeHealthCompatibility(sireData, damData);
  
  // Calculate trait predictions
  const traitPredictions = predictOffspringTraits(sireData, damData);
  
  return {
    coi,
    healthWarnings: healthAnalysis.warnings,
    compatibleTests: healthAnalysis.compatibleTests,
    incompatibleTests: healthAnalysis.incompatibleTests,
    traitPredictions
  };
};

/**
 * Get suggested breeding partners for a dog based on genetic compatibility
 */
export const getSuggestedBreedingPartners = async (
  dogId: string,
  gender: string,
  limit: number = 5
): Promise<{
  dogId: string;
  name: string;
  compatibility: number;
  coi: number;
  majorHealthIssues: number;
  photoUrl?: string;
}[]> => {
  // Get dogs of opposite gender
  const oppositeGender = gender.toLowerCase() === 'male' ? 'female' : 'male';
  
  const { data: potentialPartners, error } = await supabase
    .from('dogs')
    .select('id, name, gender, breed, color, photo_url')
    .eq('gender', oppositeGender)
    .neq('id', dogId);
    
  if (error) throw error;
  if (!potentialPartners) return [];
  
  // Evaluate compatibility with each potential partner
  const compatibilityPromises = potentialPartners.map(async (partner) => {
    const sourceId = gender.toLowerCase() === 'male' ? dogId : partner.id;
    const targetId = gender.toLowerCase() === 'male' ? partner.id : dogId;
    
    try {
      const analysis = await getBreedingCompatibility(sourceId, targetId);
      
      // Calculate a compatibility score (0-100)
      const healthScore = calculateHealthScore(analysis);
      const coiScore = calculateCoiScore(analysis.coi);
      const overallScore = (healthScore * 0.7) + (coiScore * 0.3);
      
      return {
        dogId: partner.id,
        name: partner.name,
        compatibility: Math.round(overallScore),
        coi: analysis.coi,
        majorHealthIssues: analysis.healthWarnings.filter(w => 
          w.riskLevel === 'critical' || w.riskLevel === 'high'
        ).length,
        photoUrl: partner.photo_url
      };
    } catch (error) {
      console.error(`Error analyzing compatibility with ${partner.name}:`, error);
      return null;
    }
  });
  
  const results = (await Promise.all(compatibilityPromises))
    .filter(result => result !== null)
    .sort((a, b) => (b?.compatibility || 0) - (a?.compatibility || 0))
    .slice(0, limit);
    
  return results as any[];
};

/**
 * Fetch dog genetic data
 */
const fetchDogGeneticData = async (dogId: string): Promise<any> => {
  // Fetch genetic markers
  const { data: geneticTests, error } = await customSupabase
    .from('dog_genetic_tests')
    .select('*')
    .eq('dog_id', dogId);
    
  if (error) throw error;
  
  // Fetch dog information
  const { data: dogInfo, error: dogError } = await supabase
    .from('dogs')
    .select('*')
    .eq('id', dogId)
    .single();
    
  if (dogError) throw dogError;
  
  // Process data into a standardized format
  return {
    dogId,
    breed: dogInfo.breed,
    tests: geneticTests || [],
    dogInfo
  };
};

/**
 * Calculate coefficient of inbreeding between two dogs
 */
const calculateCoefficient = async (sireId: string, damId: string): Promise<number> => {
  // Check if there's a pre-calculated COI
  const { data, error } = await customSupabase
    .from('dog_genetic_calculations')
    .select('*')
    .eq('calculation_type', 'COI')
    .eq('dog_id', sireId)
    .order('calculation_date', { ascending: false })
    .limit(1);
    
  if (!error && data && data.length > 0) {
    return data[0].value;
  }
  
  // If no pre-calculated value, use a placeholder value
  // In a full implementation, this would use pedigree analysis
  return 5.2;
};

/**
 * Analyze health compatibility between two dogs
 */
const analyzeHealthCompatibility = (
  sireData: any,
  damData: any
): { 
  warnings: HealthWarning[],
  compatibleTests: string[],
  incompatibleTests: string[]
} => {
  const warnings: HealthWarning[] = [];
  const compatibleTests: string[] = [];
  const incompatibleTests: string[] = [];
  
  // Group sire tests by test type
  const sireTests = sireData.tests.reduce((acc: any, test: any) => {
    acc[test.test_type] = test;
    return acc;
  }, {});
  
  // Group dam tests by test type
  const damTests = damData.tests.reduce((acc: any, test: any) => {
    acc[test.test_type] = test;
    return acc;
  }, {});
  
  // Compare tests that both dogs have
  const allTestTypes = new Set([
    ...Object.keys(sireTests),
    ...Object.keys(damTests)
  ]);
  
  allTestTypes.forEach(testType => {
    const sireTest = sireTests[testType];
    const damTest = damTests[testType];
    
    // Skip if either dog doesn't have this test
    if (!sireTest || !damTest) {
      // Could add a warning for missing critical tests
      return;
    }
    
    // Parse the test results
    const sireResult = parseTestResult(sireTest.result);
    const damResult = parseTestResult(damTest.result);
    
    // Check for carrier x carrier scenarios
    if (sireResult === 'carrier' && damResult === 'carrier') {
      warnings.push({
        condition: formatConditionName(testType),
        riskLevel: 'critical',
        description: `Both parents are carriers for ${formatConditionName(testType)}`,
        affectedPercentage: 25
      });
      incompatibleTests.push(testType);
    }
    // Check for affected x carrier scenarios
    else if ((sireResult === 'affected' && damResult === 'carrier') ||
             (sireResult === 'carrier' && damResult === 'affected')) {
      warnings.push({
        condition: formatConditionName(testType),
        riskLevel: 'high',
        description: `One parent is affected and one is a carrier for ${formatConditionName(testType)}`,
        affectedPercentage: 50
      });
      incompatibleTests.push(testType);
    }
    // Check for affected x affected scenarios
    else if (sireResult === 'affected' && damResult === 'affected') {
      warnings.push({
        condition: formatConditionName(testType),
        riskLevel: 'critical',
        description: `Both parents are affected with ${formatConditionName(testType)}`,
        affectedPercentage: 100
      });
      incompatibleTests.push(testType);
    }
    // Add compatible tests
    else if (sireResult === 'clear' && damResult === 'clear') {
      compatibleTests.push(testType);
    }
    // Add mild warning for clear x carrier
    else if ((sireResult === 'clear' && damResult === 'carrier') ||
             (sireResult === 'carrier' && damResult === 'clear')) {
      warnings.push({
        condition: formatConditionName(testType),
        riskLevel: 'low',
        description: `One parent is a carrier for ${formatConditionName(testType)}`,
        affectedPercentage: 0
      });
      // Still considered compatible
      compatibleTests.push(testType);
    }
  });
  
  return {
    warnings,
    compatibleTests,
    incompatibleTests
  };
};

/**
 * Helper function to parse test result string
 */
const parseTestResult = (result: string): 'clear' | 'carrier' | 'affected' | 'unknown' => {
  if (!result) return 'unknown';
  
  const lowerResult = result.toLowerCase();
  if (lowerResult.includes('clear')) return 'clear';
  if (lowerResult.includes('carrier')) return 'carrier';
  if (lowerResult.includes('affected')) return 'affected';
  return 'unknown';
};

/**
 * Format condition names for display
 */
const formatConditionName = (condition: string): string => {
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
};

/**
 * Calculate health score (0-100) based on compatibility analysis
 */
const calculateHealthScore = (analysis: PairingAnalysis): number => {
  // Start with perfect score
  let score = 100;
  
  // Deduct points for health warnings based on severity
  analysis.healthWarnings.forEach(warning => {
    switch (warning.riskLevel) {
      case 'critical':
        score -= 40;
        break;
      case 'high':
        score -= 25;
        break;
      case 'medium':
        score -= 15;
        break;
      case 'low':
        score -= 5;
        break;
    }
  });
  
  // Add points for compatible tests
  score += analysis.compatibleTests.length * 2;
  
  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, score));
};

/**
 * Calculate COI score (0-100) - lower COI is better
 */
const calculateCoiScore = (coi: number): number => {
  // Perfect score for 0% COI
  if (coi === 0) return 100;
  
  // 0-6.25% is considered good (score 90-100)
  if (coi < 6.25) return 100 - (coi * 1.6);
  
  // 6.25-12.5% is okay (score 50-90)
  if (coi < 12.5) return 90 - ((coi - 6.25) * 6.4);
  
  // 12.5-25% is concerning (score 0-50)
  if (coi < 25) return 50 - ((coi - 12.5) * 4);
  
  // Over 25% is very high inbreeding
  return 0;
};

/**
 * Predict offspring traits based on parent genetics
 */
const predictOffspringTraits = (sireData: any, damData: any): any => {
  // In a real implementation, this would be based on genetic marker analysis
  // For now, we'll return a simplified prediction
  return {
    color: predictColorDistribution(sireData, damData),
    size: {
      males: predictSizeRange(sireData, damData, 'male'),
      females: predictSizeRange(sireData, damData, 'female')
    },
    coat: "Standard coat length and texture"
  };
};

/**
 * Predict color distribution in offspring
 */
const predictColorDistribution = (sireData: any, damData: any): Record<string, number> => {
  // This is a simplified placeholder
  // In a real implementation, would use genetic color markers
  
  const sireColor = sireData.dogInfo.color || 'Black';
  const damColor = damData.dogInfo.color || 'Black';
  
  // Simple distribution for Newfoundlands where black is dominant
  if (sireColor === 'Black' && damColor === 'Black') {
    return { 'Black': 95, 'Brown': 5 };
  } 
  else if ((sireColor === 'Black' && damColor === 'Brown') || 
           (sireColor === 'Brown' && damColor === 'Black')) {
    return { 'Black': 75, 'Brown': 25 };
  }
  else if (sireColor === 'Brown' && damColor === 'Brown') {
    return { 'Black': 25, 'Brown': 75 };
  }
  
  // Fallback
  return { 'Black': 60, 'Brown': 30, 'Grey': 10 };
};

/**
 * Predict size range for offspring
 */
const predictSizeRange = (sireData: any, damData: any, gender: string): string => {
  // Simple size estimation for Newfoundlands
  if (gender === 'male') {
    return '145-160 lbs';
  } else {
    return '115-130 lbs';
  }
};
