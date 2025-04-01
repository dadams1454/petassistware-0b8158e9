
import { supabase } from '@/integrations/supabase/client';

export interface BreedingRecommendation {
  id: string;
  sire: {
    id: string;
    name: string;
    breed: string;
    color: string;
    age: number;
  };
  dam: {
    id: string;
    name: string;
    breed: string;
    color: string;
    age: number;
  };
  match_score: number;
  genetic_diversity: number;
  coefficient_of_inbreeding: number;
  color_compatibility: number;
  health_score: number;
  common_ancestors: any[];
  trait_predictions: {
    trait: string;
    probability: number;
  }[];
  health_risk: {
    condition: string;
    risk_level: 'low' | 'medium' | 'high';
    probability: number;
  }[];
  expected_litter_size: {
    min: number;
    max: number;
    average: number;
  };
  created_at: string;
}

export interface GeneticCompatibility {
  id: string;
  sire_id: string;
  dam_id: string;
  match_score: number;
  genetic_diversity: number;
  coefficient_of_inbreeding: number;
  color_compatibility: number;
  health_score: number;
  created_at: string;
}

// Get breeding recommendations for a specific dog
export const getBreedingRecommendationsForDog = async (
  dogId: string,
  limit = 10
): Promise<BreedingRecommendation[]> => {
  try {
    // In a real app, this would query the database for actual recommendations
    // For now, we'll return mock data
    const mockRecommendations: BreedingRecommendation[] = Array(limit)
      .fill(null)
      .map((_, index) => ({
        id: `rec-${dogId}-${index}`,
        sire: {
          id: dogId,
          name: `Test Dog ${index}`,
          breed: 'Newfoundland',
          color: 'Black',
          age: 3
        },
        dam: {
          id: `partner-${index}`,
          name: `Partner Dog ${index}`,
          breed: 'Newfoundland',
          color: 'Brown',
          age: 2
        },
        match_score: 85 + Math.floor(Math.random() * 15),
        genetic_diversity: 75 + Math.floor(Math.random() * 25),
        coefficient_of_inbreeding: Math.random() * 10,
        color_compatibility: 80 + Math.floor(Math.random() * 20),
        health_score: 90 + Math.floor(Math.random() * 10),
        common_ancestors: [],
        trait_predictions: [
          { trait: 'Size', probability: 0.8 },
          { trait: 'Coat Type', probability: 0.75 },
          { trait: 'Temperament', probability: 0.9 }
        ],
        health_risk: [
          { condition: 'Hip Dysplasia', risk_level: 'low', probability: 0.15 },
          { condition: 'Heart Conditions', risk_level: 'medium', probability: 0.3 }
        ],
        expected_litter_size: {
          min: 6,
          max: 10,
          average: 8
        },
        created_at: new Date().toISOString()
      }));

    return mockRecommendations;
  } catch (error) {
    console.error('Error fetching breeding recommendations:', error);
    return [];
  }
};

// Get specific compatibility between two dogs
export const getSpecificCompatibility = async (
  dogId: string,
  partnerId: string
): Promise<BreedingRecommendation | null> => {
  try {
    // In a real app, this would query the database for the specific match
    // For now, we'll return mock data
    const mockRecommendation: BreedingRecommendation = {
      id: `rec-${dogId}-${partnerId}`,
      sire: {
        id: dogId,
        name: 'Test Dog',
        breed: 'Newfoundland',
        color: 'Black',
        age: 3
      },
      dam: {
        id: partnerId,
        name: 'Partner Dog',
        breed: 'Newfoundland',
        color: 'Brown',
        age: 2
      },
      match_score: 92,
      genetic_diversity: 85,
      coefficient_of_inbreeding: 2.5,
      color_compatibility: 95,
      health_score: 94,
      common_ancestors: [],
      trait_predictions: [
        { trait: 'Size', probability: 0.85 },
        { trait: 'Coat Type', probability: 0.8 },
        { trait: 'Temperament', probability: 0.95 }
      ],
      health_risk: [
        { condition: 'Hip Dysplasia', risk_level: 'low', probability: 0.1 },
        { condition: 'Heart Conditions', risk_level: 'low', probability: 0.2 }
      ],
      expected_litter_size: {
        min: 7,
        max: 11,
        average: 9
      },
      created_at: new Date().toISOString()
    };

    return mockRecommendation;
  } catch (error) {
    console.error('Error fetching specific compatibility:', error);
    return null;
  }
};
