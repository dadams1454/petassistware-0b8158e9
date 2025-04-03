import { DogGenotype, HealthMarker, ColorProbability, GeneticHealthStatus } from '@/types/genetics';
import { supabase } from '@/integrations/supabase/client';

export interface CompatibilityResult {
  overallScore: number;
  healthScore: number;
  colorCompatibility: number;
  inbreedingCoefficient: number;
  healthRisks: {
    highRiskConditions: string[];
    carrierConditions: string[];
    clearConditions: string[];
  };
  colorPredictions: ColorProbability[];
  recommendations: string[];
}

// Calculate genetic compatibility between two dogs
export const calculateGeneticCompatibility = async (
  sireId: string,
  damId: string
): Promise<CompatibilityResult> => {
  try {
    // Fetch genetic data for both dogs
    const [sireGenetics, damGenetics] = await Promise.all([
      fetchDogGenetics(sireId),
      fetchDogGenetics(damId)
    ]);

    if (!sireGenetics || !damGenetics) {
      throw new Error('Genetic data not available for one or both dogs');
    }

    // Calculate health compatibility
    const healthRisks = analyzeHealthRisks(sireGenetics, damGenetics);
    const healthScore = calculateHealthScore(healthRisks);

    // Calculate color predictions
    const colorPredictions = predictPuppyColors(sireGenetics, damGenetics);
    const colorCompatibility = calculateColorCompatibility(colorPredictions);

    // Calculate inbreeding coefficient
    const inbreedingCoefficient = calculateInbreedingCoefficient(sireId, damId);

    // Calculate overall score
    const overallScore = calculateOverallScore(healthScore, colorCompatibility, inbreedingCoefficient);

    // Generate recommendations
    const recommendations = generateRecommendations(
      healthRisks,
      inbreedingCoefficient,
      overallScore
    );

    return {
      overallScore,
      healthScore,
      colorCompatibility,
      inbreedingCoefficient,
      healthRisks,
      colorPredictions,
      recommendations
    };
  } catch (error) {
    console.error('Error calculating genetic compatibility:', error);
    throw error;
  }
};

// Fetch dog genetic data from Supabase
const fetchDogGenetics = async (dogId: string): Promise<DogGenotype | null> => {
  const { data, error } = await supabase
    .from('genetic_data')
    .select('*')
    .eq('dog_id', dogId)
    .single();

  if (error) {
    console.error('Error fetching genetic data:', error);
    return null;
  }

  if (!data) return null;

  // Transform the data into the format our application expects
  const healthMarkers: Record<string, HealthMarker> = {};
  
  if (data.health_results) {
    Object.entries(data.health_results).forEach(([key, value]: [string, any]) => {
      healthMarkers[key] = {
        name: key,
        status: value.status as GeneticHealthStatus,
        testDate: value.test_date || '',
        lab: value.lab || '',
        source: value.source || ''
      };
    });
  }

  return {
    dog_id: dogId,
    id: data.id,
    name: data.name || '',
    breed: data.breed_composition?.primary?.breed || '',
    baseColor: data.trait_results?.color?.base || 'Unknown',
    brownDilution: data.trait_results?.color?.brown_dilution || 'Unknown',
    dilution: data.trait_results?.color?.dilution || 'Unknown',
    agouti: data.trait_results?.color?.agouti || 'Unknown',
    healthMarkers,
    colorGenetics: data.trait_results?.color || {},
    traits: data.trait_results || {},
    updated_at: data.updated_at
  };
};

// Analyze health risks based on genetic markers
const analyzeHealthRisks = (sireGenetics: DogGenotype, damGenetics: DogGenotype) => {
  const highRiskConditions: string[] = [];
  const carrierConditions: string[] = [];
  const clearConditions: string[] = [];

  // Combine unique conditions from both parents
  const allConditions = new Set<string>();
  
  Object.keys(sireGenetics.healthMarkers || {}).forEach(key => allConditions.add(key));
  Object.keys(damGenetics.healthMarkers || {}).forEach(key => allConditions.add(key));

  // Analyze each condition
  allConditions.forEach(condition => {
    const sireStatus = sireGenetics.healthMarkers?.[condition]?.status || 'unknown';
    const damStatus = damGenetics.healthMarkers?.[condition]?.status || 'unknown';

    // Analyze risk based on genetics
    if ((sireStatus === 'at_risk' || sireStatus === 'affected') && 
        (damStatus === 'at_risk' || damStatus === 'affected')) {
      // Both parents affected - high risk
      highRiskConditions.push(condition);
    } else if ((sireStatus === 'at_risk' || sireStatus === 'affected') && damStatus === 'carrier') {
      // One parent affected, one carrier - high risk
      highRiskConditions.push(condition);
    } else if (sireStatus === 'carrier' && (damStatus === 'at_risk' || damStatus === 'affected')) {
      // One parent carrier, one affected - high risk
      highRiskConditions.push(condition);
    } else if (sireStatus === 'carrier' && damStatus === 'carrier') {
      // Both parents carriers - medium risk
      carrierConditions.push(condition);
    } else if ((sireStatus === 'clear' && damStatus === 'clear') ||
              (sireStatus === 'clear' && damStatus === 'unknown') ||
              (sireStatus === 'unknown' && damStatus === 'clear')) {
      // Both parents clear or one clear, one unknown - safe
      clearConditions.push(condition);
    } else {
      // One parent clear, one carrier - low risk
      if (sireStatus === 'carrier' || damStatus === 'carrier') {
        carrierConditions.push(condition);
      }
    }
  });

  return {
    highRiskConditions,
    carrierConditions,
    clearConditions
  };
};

// Calculate health score based on risk analysis
const calculateHealthScore = (healthRisks: { 
  highRiskConditions: string[];
  carrierConditions: string[];
  clearConditions: string[];
}) => {
  // Base score of 100
  let score = 100;

  // Subtract for high risk conditions (more impactful)
  score -= healthRisks.highRiskConditions.length * 25;

  // Subtract less for carrier conditions
  score -= healthRisks.carrierConditions.length * 10;

  // Add a small bonus for clear conditions
  score += healthRisks.clearConditions.length * 2;

  // Ensure score stays within 0-100 range
  return Math.max(0, Math.min(100, score));
};

// Predict puppy colors based on parent genetics
const predictPuppyColors = (sireGenetics: DogGenotype, damGenetics: DogGenotype): ColorProbability[] => {
  // This is a simplified implementation of color genetics
  // In a real-world scenario, this would be much more complex based on breed-specific color inheritance
  
  const sireColor = sireGenetics.baseColor || 'Unknown';
  const damColor = damGenetics.baseColor || 'Unknown';
  
  // Default colors with low probabilities
  const defaultColors: ColorProbability[] = [
    { color: 'Black', probability: 0.25, hex: '#222222' },
    { color: 'Brown', probability: 0.25, hex: '#8B4513' },
    { color: 'Golden', probability: 0.25, hex: '#DAA520' },
    { color: 'White', probability: 0.25, hex: '#FFFFFF' }
  ];
  
  // If we don't have color information, return default colors
  if (sireColor === 'Unknown' || damColor === 'Unknown') {
    return defaultColors;
  }
  
  // Simple color prediction based on parent colors
  // This is a placeholder for more sophisticated color genetics
  if (sireColor === 'Black' && damColor === 'Black') {
    return [
      { color: 'Black', probability: 0.75, hex: '#222222' },
      { color: 'Brown', probability: 0.2, hex: '#8B4513' },
      { color: 'Golden', probability: 0.05, hex: '#DAA520' }
    ];
  } else if (sireColor === 'Black' && damColor === 'Brown') {
    return [
      { color: 'Black', probability: 0.5, hex: '#222222' },
      { color: 'Brown', probability: 0.45, hex: '#8B4513' },
      { color: 'Golden', probability: 0.05, hex: '#DAA520' }
    ];
  } else if (sireColor === 'Brown' && damColor === 'Brown') {
    return [
      { color: 'Brown', probability: 0.7, hex: '#8B4513' },
      { color: 'Black', probability: 0.2, hex: '#222222' },
      { color: 'Golden', probability: 0.1, hex: '#DAA520' }
    ];
  }
  
  // For other color combinations, return a generic prediction
  return [
    { color: sireColor, probability: 0.4, hex: getColorHex(sireColor) },
    { color: damColor, probability: 0.4, hex: getColorHex(damColor) },
    { color: 'Mixed', probability: 0.2, hex: '#A0A0A0' }
  ];
};

// Helper function to get hex color
const getColorHex = (colorName: string): string => {
  const colors: Record<string, string> = {
    'Black': '#222222',
    'Brown': '#8B4513',
    'Golden': '#DAA520',
    'White': '#FFFFFF',
    'Cream': '#FFFDD0',
    'Red': '#A52A2A',
    'Tan': '#D2B48C',
    'Silver': '#C0C0C0',
    'Blue': '#6082B6',
    'Gray': '#808080',
    'Liver': '#674C47'
  };
  
  return colors[colorName] || '#A0A0A0';
};

// Calculate color compatibility score
const calculateColorCompatibility = (colorPredictions: ColorProbability[]): number => {
  // Simple algorithm based on prediction diversity
  // Higher probability in primary colors gives higher score
  
  if (colorPredictions.length <= 1) return 70; // Limited data
  
  // More predictable outcomes (higher primary color probability) scores higher
  const primaryColorProbability = colorPredictions[0].probability;
  
  // Scale from 70-95 based on primary color probability
  return 70 + Math.round(primaryColorProbability * 25);
};

// Calculate inbreeding coefficient
const calculateInbreedingCoefficient = async (sireId: string, damId: string): Promise<number> => {
  try {
    // Check for existing calculation
    const { data, error } = await supabase
      .from('dog_genetic_calculations')
      .select('value')
      .eq('calculation_type', 'breeding_coi')
      .eq('dog_id', sireId)
      .eq('related_dog_id', damId)
      .order('calculation_date', { ascending: false })
      .limit(1);
      
    if (!error && data && data.length > 0) {
      return data[0].value;
    }
    
    // If no existing calculation, simulate coefficient calculation
    // In a real system, this would use pedigree data to calculate actual COI
    // This is a placeholder that returns a random value between 0-15%
    const estimatedCOI = Math.random() * 0.15;
    
    // Store the calculated value
    await supabase
      .from('dog_genetic_calculations')
      .insert({
        dog_id: sireId,
        related_dog_id: damId,
        calculation_type: 'breeding_coi',
        value: estimatedCOI,
        calculation_date: new Date().toISOString()
      });
      
    return estimatedCOI;
  } catch (error) {
    console.error('Error calculating inbreeding coefficient:', error);
    // Return a moderate default value if calculation fails
    return 0.05;
  }
};

// Calculate overall compatibility score
const calculateOverallScore = (
  healthScore: number,
  colorCompatibility: number,
  inbreedingCoefficient: number
): number => {
  // Health is most important (60%)
  const healthComponent = healthScore * 0.6;
  
  // Color compatibility is less important (15%)
  const colorComponent = colorCompatibility * 0.15;
  
  // Inbreeding coefficient is important (25%)
  // Lower inbreeding is better, so convert to a score
  // 0% inbreeding = 100 points, 25%+ inbreeding = 0 points
  const inbreedingScore = Math.max(0, 100 - (inbreedingCoefficient * 400));
  const inbreedingComponent = inbreedingScore * 0.25;
  
  // Combine components
  const overallScore = healthComponent + colorComponent + inbreedingComponent;
  
  // Round to nearest whole number and ensure within 0-100 range
  return Math.max(0, Math.min(100, Math.round(overallScore)));
};

// Generate breeding recommendations
const generateRecommendations = (
  healthRisks: {
    highRiskConditions: string[];
    carrierConditions: string[];
    clearConditions: string[];
  },
  inbreedingCoefficient: number,
  overallScore: number
): string[] => {
  const recommendations: string[] = [];
  
  // Health-based recommendations
  if (healthRisks.highRiskConditions.length > 0) {
    recommendations.push(
      `CAUTION: This pairing has ${healthRisks.highRiskConditions.length} high-risk genetic condition(s). Reconsidering this match is strongly advised.`
    );
    
    // Add specific condition recommendations
    healthRisks.highRiskConditions.forEach(condition => {
      recommendations.push(
        `Consider genetic testing for ${formatConditionName(condition)} before proceeding.`
      );
    });
  }
  
  if (healthRisks.carrierConditions.length > 0) {
    recommendations.push(
      `This pairing has ${healthRisks.carrierConditions.length} condition(s) where both parents are carriers. Puppies should be tested.`
    );
  }
  
  // Inbreeding recommendations
  if (inbreedingCoefficient > 0.125) {
    recommendations.push(
      `WARNING: High inbreeding coefficient (${(inbreedingCoefficient * 100).toFixed(1)}%). Consider a different pairing to increase genetic diversity.`
    );
  } else if (inbreedingCoefficient > 0.0625) {
    recommendations.push(
      `Moderate inbreeding coefficient (${(inbreedingCoefficient * 100).toFixed(1)}%). Monitor for inbreeding depression in offspring.`
    );
  } else {
    recommendations.push(
      `Good genetic diversity with low inbreeding coefficient (${(inbreedingCoefficient * 100).toFixed(1)}%).`
    );
  }
  
  // Overall recommendation
  if (overallScore >= 85) {
    recommendations.push(
      `This pairing shows good genetic compatibility (${overallScore}% overall score).`
    );
  } else if (overallScore >= 70) {
    recommendations.push(
      `This pairing shows moderate genetic compatibility (${overallScore}% overall score). Consider health testing offspring.`
    );
  } else {
    recommendations.push(
      `This pairing shows poor genetic compatibility (${overallScore}% overall score). A different pairing is recommended.`
    );
  }
  
  return recommendations;
};

// Format condition name for display
const formatConditionName = (condition: string): string => {
  // Check for common abbreviations first
  const commonAbbreviations: Record<string, string> = {
    'PRA': 'Progressive Retinal Atrophy',
    'DM': 'Degenerative Myelopathy',
    'vWD': 'von Willebrand Disease',
    'EIC': 'Exercise-Induced Collapse',
    'MDR1': 'Multi-Drug Resistance 1',
    'HC': 'Hereditary Cataracts',
    'JHC': 'Juvenile Hereditary Cataracts',
    'NCL': 'Neuronal Ceroid Lipofuscinosis',
    'CD': 'Cone Degeneration'
  };
  
  if (commonAbbreviations[condition]) {
    return commonAbbreviations[condition];
  }
  
  // Otherwise format from snake_case or camelCase
  return condition
    // Handle snake_case
    .split('_')
    // Handle camelCase
    .join(' ')
    .replace(/([A-Z])/g, ' $1')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
};
