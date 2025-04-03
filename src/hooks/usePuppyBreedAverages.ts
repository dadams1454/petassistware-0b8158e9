
import { useState, useEffect } from 'react';
import { WeightRecord, WeightUnit } from '@/types/health';
import { standardizeWeightUnit } from '@/types/common';

// Generated mock data for average breed weights
const generateBreedAverageData = (breed: string) => {
  // This would typically come from an API or database
  // For now, we're generating mock data based on the breed
  
  const mockWeights: WeightRecord[] = [
    {
      id: '1',
      dog_id: 'avg-newfoundland',
      weight: 1.2,
      weight_unit: 'lb',
      unit: 'lb',
      date: '2023-01-01',
      created_at: new Date().toISOString(),
      age_days: 1
    },
    {
      id: '2',
      dog_id: 'avg-newfoundland',
      weight: 2.3,
      weight_unit: 'lb',
      unit: 'lb',
      date: '2023-01-08',
      created_at: new Date().toISOString(),
      age_days: 7
    },
    {
      id: '3',
      dog_id: 'avg-newfoundland',
      weight: 3.5,
      weight_unit: 'lb',
      unit: 'lb',
      date: '2023-01-15',
      created_at: new Date().toISOString(),
      age_days: 14
    },
    {
      id: '4',
      dog_id: 'avg-newfoundland',
      weight: 5.0,
      weight_unit: 'lb',
      unit: 'lb',
      date: '2023-01-22',
      created_at: new Date().toISOString(),
      age_days: 21
    },
    {
      id: '5',
      dog_id: 'avg-newfoundland',
      weight: 7.5,
      weight_unit: 'lb',
      unit: 'lb',
      date: '2023-01-29',
      created_at: new Date().toISOString(),
      age_days: 28
    },
    {
      id: '6',
      dog_id: 'avg-newfoundland',
      weight: 10.0,
      weight_unit: 'lb',
      unit: 'lb',
      date: '2023-02-05',
      created_at: new Date().toISOString(),
      age_days: 35
    },
    {
      id: '7',
      dog_id: 'avg-newfoundland',
      weight: 12.5,
      weight_unit: 'lb',
      unit: 'lb',
      date: '2023-02-12',
      created_at: new Date().toISOString(),
      age_days: 42
    },
    {
      id: '8',
      dog_id: 'avg-newfoundland',
      weight: 15.0,
      weight_unit: 'lb',
      unit: 'lb',
      date: '2023-02-19',
      created_at: new Date().toISOString(),
      age_days: 49
    },
    {
      id: '9',
      dog_id: 'avg-newfoundland',
      weight: 18.0,
      weight_unit: 'lb',
      unit: 'lb',
      date: '2023-02-26',
      created_at: new Date().toISOString(),
      age_days: 56
    },
    {
      id: '10',
      dog_id: 'avg-newfoundland',
      weight: 22.0,
      weight_unit: 'lb',
      unit: 'lb',
      date: '2023-03-05',
      created_at: new Date().toISOString(),
      age_days: 63
    },
    {
      id: '11',
      dog_id: 'avg-newfoundland',
      weight: 26.0,
      weight_unit: 'lb',
      unit: 'lb',
      date: '2023-03-12',
      created_at: new Date().toISOString(),
      age_days: 70
    },
    {
      id: '12',
      dog_id: 'avg-newfoundland',
      weight: 30.0,
      weight_unit: 'lb',
      unit: 'lb',
      date: '2023-03-19',
      created_at: new Date().toISOString(),
      age_days: 77
    },
    {
      id: '13',
      dog_id: 'avg-newfoundland',
      weight: 35.0,
      weight_unit: 'lb',
      unit: 'lb',
      date: '2023-03-26',
      created_at: new Date().toISOString(),
      age_days: 84
    }
  ];
  
  // Apply breed-specific scaling
  let scaledWeights = [...mockWeights];
  
  if (breed.toLowerCase().includes('newfoundland')) {
    // Use default weights
  } else if (breed.toLowerCase().includes('labrador')) {
    scaledWeights = mockWeights.map(d => ({
      ...d,
      weight: d.weight * 0.7 // Labs grow slightly slower than Newfoundlands
    }));
  } else if (breed.toLowerCase().includes('german shepherd')) {
    scaledWeights = mockWeights.map(d => ({
      ...d,
      weight: d.weight * 0.65
    }));
  } else if (breed.toLowerCase().includes('golden retriever')) {
    scaledWeights = mockWeights.map(d => ({
      ...d,
      weight: d.weight * 0.6
    }));
  } else {
    // Default for unspecified breeds - use medium size dog average
    scaledWeights = mockWeights.map(d => ({
      ...d,
      weight: d.weight * 0.5
    }));
  }
  
  return {
    weights: scaledWeights,
    isLoading: false
  };
};

export const usePuppyBreedAverages = (breed: string) => {
  const [averageWeights, setAverageWeights] = useState({
    weights: [] as WeightRecord[],
    isLoading: true,
    error: null as null | Error
  });
  
  useEffect(() => {
    const fetchAverageData = async () => {
      try {
        // In a real application, this would be an API call
        // For now, we're using mock data
        const data = generateBreedAverageData(breed);
        setAverageWeights({
          ...data,
          error: null
        });
      } catch (err) {
        console.error('Error fetching breed average weights:', err);
        setAverageWeights({
          weights: [],
          isLoading: false,
          error: err instanceof Error ? err : new Error('Failed to fetch data')
        });
      }
    };
    
    fetchAverageData();
  }, [breed]);
  
  return averageWeights;
};
