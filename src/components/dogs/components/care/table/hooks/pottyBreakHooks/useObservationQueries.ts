import { useCallback } from 'react';
import { ObservationMap } from './observationTypes';

export const useObservationQueries = (observations: ObservationMap) => {
  // Check if a dog has an observation based on category and time slot
  const hasObservation = useCallback((dogId: string, timeSlot: string = '', activeCategory: string = 'pottybreaks') => {
    // Determine which category to filter by
    const targetCategory = activeCategory === 'feeding' ? 'feeding_observation' : 'observation';
    
    // If dog doesn't have any observations, return false
    if (!observations[dogId]?.length) {
      return false;
    }
    
    // If no timeSlot is provided, check if the dog has any observations in the current category
    if (!timeSlot) {
      return observations[dogId].some(obs => obs.category === targetCategory);
    }
    
    // If time slot is provided, check if there's an observation matching this time slot and category
    return observations[dogId].some(obs => 
      obs.timeSlot === timeSlot && obs.category === targetCategory
    );
  }, [observations]);
  
  // Get observation details filtered by category
  const getObservationDetails = useCallback((dogId: string, activeCategory: string = 'pottybreaks') => {
    // Determine which category to filter by
    const targetCategory = activeCategory === 'feeding' ? 'feeding_observation' : 'observation';
    
    if (!observations[dogId] || observations[dogId].length === 0) {
      return null;
    }
    
    // Filter observations based on category
    const categoryObservations = observations[dogId].filter(obs => obs.category === targetCategory);
    
    if (categoryObservations.length === 0) {
      return null;
    }
    
    // Get the most recent observation for this dog in this category
    const latestObservation = categoryObservations[0];
    
    return {
      text: latestObservation.observation,
      type: latestObservation.observation_type,
      timeSlot: latestObservation.timeSlot,
      category: latestObservation.category
    };
  }, [observations]);

  return {
    hasObservation,
    getObservationDetails
  };
};
