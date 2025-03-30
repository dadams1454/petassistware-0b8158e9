
import { useState, useEffect, useCallback, useRef } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { ObservationsMap } from './observationTypes';
import { useObservationsFetch } from './useObservationsFetch';
import { useObservationActions } from './useObservationActions';
import { useObservationQueries } from './useObservationQueries';

export const useObservations = (dogs: DogCareStatus[]) => {
  const [observations, setObservations] = useState<ObservationsMap>({});
  const { fetchObservations, isLoading } = useObservationsFetch(dogs);
  const { addObservation } = useObservationActions(observations, setObservations);
  const { hasObservation, getObservationDetails } = useObservationQueries(observations);
  
  // Use a ref to prevent multiple simultaneous fetches
  const fetchInProgressRef = useRef(false);
  const lastFetchTime = useRef<number>(0);
  const minTimeBetweenFetches = 5000; // 5 seconds minimum between fetches

  // Memoized fetch function with throttling
  const fetchObservationsThrottled = useCallback(async () => {
    const now = Date.now();
    
    // Skip if a fetch is already in progress
    if (fetchInProgressRef.current) {
      console.log('Observation fetch already in progress, skipping');
      return observations;
    }
    
    // Skip if we fetched too recently
    if (now - lastFetchTime.current < minTimeBetweenFetches) {
      console.log(`Throttling observation fetch (last fetch was ${now - lastFetchTime.current}ms ago)`);
      return observations;
    }
    
    console.log('Fetching observations...');
    fetchInProgressRef.current = true;
    
    try {
      const fetchedObservations = await fetchObservations();
      lastFetchTime.current = Date.now();
      setObservations(fetchedObservations);
      return fetchedObservations;
    } finally {
      fetchInProgressRef.current = false;
    }
  }, [fetchObservations, observations]);

  // Fetch observations on mount and when dogs change
  useEffect(() => {
    // Only fetch if we have dogs and haven't fetched recently
    if (dogs.length > 0 && (Date.now() - lastFetchTime.current > minTimeBetweenFetches)) {
      fetchObservationsThrottled();
    }
  }, [dogs, fetchObservationsThrottled]);

  return {
    observations,
    addObservation,
    hasObservation,
    getObservationDetails,
    fetchObservations: fetchObservationsThrottled,
    isLoading
  };
};
