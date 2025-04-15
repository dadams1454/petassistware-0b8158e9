
import { useState, useEffect } from 'react';
import mockDogs from '@/mockData/dogs';
import { Dog } from '@/types/dog';

export const useDogsData = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDogs = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use mock data
      setDogs(mockDogs);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch dogs'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDogs();
  }, []);

  const refetch = async () => {
    return fetchDogs();
  };

  return { dogs, isLoading, error, refetch };
};

export const useDogData = (dogId: string | undefined) => {
  const [dog, setDog] = useState<Dog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDog = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Find dog in mock data
      const foundDog = mockDogs.find(d => d.id === id);
      
      if (!foundDog) {
        throw new Error(`Dog with ID ${id} not found`);
      }
      
      setDog(foundDog);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch dog'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (dogId) {
      fetchDog(dogId);
    } else {
      setIsLoading(false);
      setError(new Error('No dog ID provided'));
    }
  }, [dogId]);

  const refetch = async () => {
    if (dogId) {
      return fetchDog(dogId);
    }
    return Promise.resolve();
  };

  return { dog, isLoading, error, refetch };
};
