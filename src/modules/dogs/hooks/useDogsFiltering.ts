
import { useState, useMemo } from 'react';
import { DogProfile } from '../types/dog';

export const useDogsFiltering = (
  dogs: DogProfile[],
  searchTerm: string,
  statusFilter: string,
  genderFilter: string
) => {
  const filteredDogs = useMemo(() => {
    return dogs.filter(dog => {
      // Filter by search term
      const searchMatches = !searchTerm || 
        dog.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (dog.breed && dog.breed.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (dog.color && dog.color.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filter by status
      const statusMatches = statusFilter === 'all' || 
        (dog.status && dog.status.toLowerCase() === statusFilter.toLowerCase());
      
      // Filter by gender
      const genderMatches = genderFilter === 'all' || 
        (dog.gender && dog.gender === genderFilter);
      
      return searchMatches && statusMatches && genderMatches;
    });
  }, [dogs, searchTerm, statusFilter, genderFilter]);

  return {
    filteredDogs
  };
};
