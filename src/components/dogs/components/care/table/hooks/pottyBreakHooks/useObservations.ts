
import { useState } from 'react';
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

  return {
    observations,
    addObservation,
    hasObservation,
    getObservationDetails,
    fetchObservations,
    isLoading
  };
};
