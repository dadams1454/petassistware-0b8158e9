
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { getMockGeneticData } from './genetics/mockGeneticData';

export interface BreedingRecommendation {
  id: string;
  dam_id: string;
  sire_id: string;
  compatibility_score: number;
  health_risk: string;
  color_prediction: string;
  size_prediction: string;
  recommendations: string[];
  created_at: string;
}

export interface GeneticCompatibility {
  score: number;
  healthRisks: { 
    condition: string; 
    risk: 'low' | 'moderate' | 'high';
    description: string;
  }[];
  traits: { 
    trait: string; 
    probability: number;
    description: string;
  }[];
}

// Mock function for now
export const getBreedingCompatibility = async (
  damId: string,
  sireId: string
): Promise<GeneticCompatibility> => {
  try {
    // Get mock genetic data for both dogs
    const damGeneticData = await getMockGeneticData(damId);
    const sireGeneticData = await getMockGeneticData(sireId);
    
    // For now, return mock data
    return {
      score: Math.floor(Math.random() * 51) + 50, // 50-100
      healthRisks: [
        {
          condition: 'Hip Dysplasia',
          risk: Math.random() > 0.7 ? 'high' : Math.random() > 0.3 ? 'moderate' : 'low',
          description: 'Common hereditary condition affecting the hip joints.'
        },
        {
          condition: 'Cardiac Issues',
          risk: Math.random() > 0.8 ? 'high' : Math.random() > 0.4 ? 'moderate' : 'low',
          description: 'Various heart conditions that can be genetically transferred.'
        },
        {
          condition: 'Progressive Retinal Atrophy',
          risk: Math.random() > 0.9 ? 'high' : Math.random() > 0.6 ? 'moderate' : 'low',
          description: 'Degenerative eye disorder that can lead to blindness.'
        }
      ],
      traits: [
        {
          trait: 'Coat Color',
          probability: Math.random(),
          description: 'Expected coat color distribution in puppies.'
        },
        {
          trait: 'Size',
          probability: Math.random(),
          description: 'Expected size range of puppies when fully grown.'
        },
        {
          trait: 'Temperament',
          probability: Math.random(),
          description: 'Expected temperament traits based on parents.'
        }
      ]
    };
  } catch (error) {
    console.error('Error getting breeding compatibility:', error);
    toast({
      title: 'Error',
      description: 'Unable to calculate genetic compatibility. Using estimated values.',
      variant: 'destructive',
    });
    
    // Return fallback data
    return {
      score: 75,
      healthRisks: [
        {
          condition: 'Unknown',
          risk: 'moderate',
          description: 'Could not determine specific health risks.'
        }
      ],
      traits: [
        {
          trait: 'Unknown',
          probability: 0.5,
          description: 'Could not determine specific trait probabilities.'
        }
      ]
    };
  }
};

export const saveBreedingRecommendation = async (
  damId: string,
  sireId: string,
  compatibility: GeneticCompatibility
): Promise<BreedingRecommendation | null> => {
  try {
    // This would save the recommendation to the database
    // For now just return a mock object
    return {
      id: crypto.randomUUID(),
      dam_id: damId,
      sire_id: sireId,
      compatibility_score: compatibility.score,
      health_risk: compatibility.healthRisks[0]?.risk || 'unknown',
      color_prediction: 'Mixed',
      size_prediction: 'Medium to Large',
      recommendations: [
        'Consider genetic testing for specific conditions',
        'Monitor for early signs of joint issues in offspring',
        'Regular cardiac examinations recommended'
      ],
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error saving breeding recommendation:', error);
    return null;
  }
};
