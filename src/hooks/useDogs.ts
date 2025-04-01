
import { useState } from 'react';
import { Dog } from '@/types/dogs';

export const useDogs = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch dogs function would be implemented here
  
  return {
    dogs,
    isLoading,
    error
  };
};
