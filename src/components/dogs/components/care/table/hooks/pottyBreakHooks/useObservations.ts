
import { useState, useEffect } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { ObservationsMap } from './observationTypes';
import { useObservationsFetch } from './useObservationsFetch';
import { useObservationActions } from './useObservationActions';
import { useObservationQueries } from './useObservationQueries';
import { ObservationsContextValue } from './observationsContext';

export const useObservations = (dogs: DogCareStatus[]): ObservationsContextValue => {
  const [observations, setObservations] = useState<ObservationsMap>({});
  const { fetchObservations, isLoading } = useObservationsFetch(dogs);
  const { addObservation } = useObservationActions(observations, setObservations);
  const { hasObservation, getObservationDetails } = useObservationQueries(observations);

  // Fetch observations on mount and when dogs change
  useEffect(() => {
    const loadObservations = async () => {
      const fetchedObservations = await fetchObservations();
      setObservations(fetchedObservations);
    };
    
    loadObservations();
  }, [fetchObservations]);

  return {
    observations,
    addObservation,
    hasObservation,
    getObservationDetails,
    fetchObservations: async () => {
      const fetchedObservations = await fetchObservations();
      setObservations(fetchedObservations);
      return fetchedObservations;
    },
    isLoading
  };
};
