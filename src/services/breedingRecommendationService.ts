
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface GeneticCompatibilityResult {
  id: string;
  score: number;
  dog1_id: string;
  dog2_id: string;
  coefficient_of_inbreeding: number;
  health_risk_level: 'low' | 'medium' | 'high';
  created_at: string;
}

export interface DogWithGenes {
  id: string;
  name: string;
  gender: string;
  breed: string;
  color: string;
  photo_url?: string;
  coefficient_of_inbreeding?: number;
  genetic_tests?: {
    id: string;
    test_type: string;
    result: string;
  }[];
}

export interface TraitPrediction {
  trait: string;
  probability: number;
  description: string;
}

export interface CompatibilityRisk {
  risk_type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface BreedingRecommendation {
  id: string;
  compatibility_score: number;
  coefficient_of_inbreeding: number;
  health_score: number;
  dam: DogWithGenes;
  sire: DogWithGenes;
  trait_predictions: TraitPrediction[];
  health_risks: CompatibilityRisk[];
}

// Get breeding recommendations for a specific dog
export const getBreedingRecommendationsForDog = async (dogId: string): Promise<BreedingRecommendation[]> => {
  try {
    // Get dog details first to determine gender
    const { data: dogData, error: dogError } = await supabase
      .from('dogs')
      .select('id, name, gender, breed, color, photo_url')
      .eq('id', dogId)
      .single();

    if (dogError) throw dogError;
    if (!dogData) throw new Error('Dog not found');

    // Find potential matches of opposite gender
    const oppositeGender = dogData.gender === 'male' ? 'female' : 'male';
    
    const { data: potentialMatches, error: matchesError } = await supabase
      .from('dogs')
      .select('id, name, gender, breed, color, photo_url')
      .eq('gender', oppositeGender)
      .eq('breed', dogData.breed);
    
    if (matchesError) throw matchesError;
    if (!potentialMatches || potentialMatches.length === 0) {
      return [];
    }

    // Generate mock breeding recommendations
    // In a real application, this would involve complex genetic calculations
    const recommendations: BreedingRecommendation[] = potentialMatches.map((match, index) => {
      // Create a deterministic but seemingly random score based on the dog IDs
      const compatibilityScore = generateDeterministicScore(dogId, match.id, 65, 95);
      const coefficientOfInbreeding = generateDeterministicScore(dogId, match.id, 1, 15);
      const healthScore = generateDeterministicScore(dogId, match.id, 70, 98);
      
      const dam = dogData.gender === 'female' ? dogData : match;
      const sire = dogData.gender === 'male' ? dogData : match;
      
      return {
        id: `rec-${dogId}-${match.id}`,
        compatibility_score: compatibilityScore,
        coefficient_of_inbreeding: coefficientOfInbreeding,
        health_score: healthScore,
        dam: dam as DogWithGenes,
        sire: sire as DogWithGenes,
        trait_predictions: generateTraitPredictions(dogData.breed),
        health_risks: generateHealthRisks(coefficientOfInbreeding)
      };
    });
    
    // Sort by compatibility score (highest first)
    return recommendations.sort((a, b) => b.compatibility_score - a.compatibility_score);
  } catch (error) {
    console.error('Error getting breeding recommendations:', error);
    toast({
      title: 'Error',
      description: 'Failed to fetch breeding recommendations.',
      variant: 'destructive',
    });
    return [];
  }
};

// Get specific compatibility between two dogs
export const getSpecificCompatibility = async (
  dogId1: string, 
  dogId2: string
): Promise<BreedingRecommendation | null> => {
  try {
    const { data: dog1, error: error1 } = await supabase
      .from('dogs')
      .select('id, name, gender, breed, color, photo_url')
      .eq('id', dogId1)
      .single();

    const { data: dog2, error: error2 } = await supabase
      .from('dogs')
      .select('id, name, gender, breed, color, photo_url')
      .eq('id', dogId2)
      .single();

    if (error1 || error2 || !dog1 || !dog2) {
      const errorMessage = (error1 || error2 || new Error('Dogs not found')).message;
      throw new Error(errorMessage);
    }

    // Ensure dogs are of opposite genders
    if (dog1.gender === dog2.gender) {
      toast({
        title: 'Invalid Pairing',
        description: 'Breeding compatibility requires dogs of opposite genders.',
        variant: 'destructive',
      });
      return null;
    }

    // Determine which is dam and which is sire
    const dam = dog1.gender === 'female' ? dog1 : dog2;
    const sire = dog1.gender === 'male' ? dog1 : dog2;

    const compatibilityScore = generateDeterministicScore(dog1.id, dog2.id, 65, 95);
    const coefficientOfInbreeding = generateDeterministicScore(dog1.id, dog2.id, 1, 15);
    const healthScore = generateDeterministicScore(dog1.id, dog2.id, 70, 98);

    return {
      id: `rec-${dog1.id}-${dog2.id}`,
      compatibility_score: compatibilityScore,
      coefficient_of_inbreeding: coefficientOfInbreeding,
      health_score: healthScore,
      dam: dam as DogWithGenes,
      sire: sire as DogWithGenes,
      trait_predictions: generateTraitPredictions(dog1.breed),
      health_risks: generateHealthRisks(coefficientOfInbreeding)
    };
  } catch (error) {
    console.error('Error getting specific compatibility:', error);
    if (error instanceof Error) {
      toast({
        title: 'Error',
        description: `Failed to analyze compatibility: ${error.message}`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to analyze compatibility.',
        variant: 'destructive',
      });
    }
    return null;
  }
};

// Helper function to generate a deterministic but seemingly random score
function generateDeterministicScore(id1: string, id2: string, min: number, max: number): number {
  // Create a simple hash from the two IDs
  const combinedHash = (id1 + id2).split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  // Generate a number between 0 and 1 based on the hash
  const normalizedValue = (combinedHash % 100) / 100;
  
  // Map to the desired range
  return min + normalizedValue * (max - min);
}

// Generate mock trait predictions based on breed
function generateTraitPredictions(breed: string): TraitPrediction[] {
  const traits = [
    { trait: 'Coat Color', descriptions: { 'Newfoundland': 'Black', 'Golden Retriever': 'Golden', 'Labrador': 'Yellow/Black/Chocolate' } },
    { trait: 'Size', descriptions: { 'Newfoundland': 'Large', 'Golden Retriever': 'Medium-Large', 'Labrador': 'Medium-Large' } },
    { trait: 'Temperament', descriptions: { 'Newfoundland': 'Gentle, patient', 'Golden Retriever': 'Friendly, intelligent', 'Labrador': 'Outgoing, even-tempered' } },
    { trait: 'Life Span', descriptions: { 'Newfoundland': '8-10 years', 'Golden Retriever': '10-12 years', 'Labrador': '10-12 years' } },
  ];
  
  return traits.map(({ trait, descriptions }) => ({
    trait,
    probability: Math.floor(Math.random() * 30 + 70), // 70-99%
    description: descriptions[breed as keyof typeof descriptions] || 'Unknown'
  }));
}

// Generate health risks based on coefficient of inbreeding
function generateHealthRisks(coi: number): CompatibilityRisk[] {
  const risks = [
    { risk_type: 'Hip Dysplasia', descriptions: { low: 'Low risk based on genetic history', medium: 'Moderate risk present', high: 'High risk factor detected' } },
    { risk_type: 'Heart Conditions', descriptions: { low: 'Minimal cardiac risk factors', medium: 'Some cardiac concerns present', high: 'Significant cardiac risk factors' } },
    { risk_type: 'Eye Conditions', descriptions: { low: 'Low risk of hereditary eye issues', medium: 'Moderate risk of eye conditions', high: 'High risk of progressive eye disorders' } },
  ];
  
  let severity: 'low' | 'medium' | 'high';
  if (coi < 5) severity = 'low';
  else if (coi < 10) severity = 'medium';
  else severity = 'high';
  
  return risks.map(({ risk_type, descriptions }) => ({
    risk_type,
    severity,
    description: descriptions[severity]
  }));
}
