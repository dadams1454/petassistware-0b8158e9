
import { useMemo } from 'react';
import { DogProfile } from '@/types/dog';

export function useDogsFiltering(
  dogs: DogProfile[],
  searchTerm: string,
  statusFilter: string,
  genderFilter: string
) {
  const filteredDogs = useMemo(() => {
    return dogs.filter(dog => {
      // Name or breed search
      const matchesSearch = searchTerm === '' || 
        (dog.name && dog.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (dog.breed && dog.breed.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || dog.status === statusFilter;
      
      // Gender filter
      const matchesGender = genderFilter === 'all' || 
        (dog.gender && dog.gender.toLowerCase() === genderFilter.toLowerCase());
      
      return matchesSearch && matchesStatus && matchesGender;
    });
  }, [dogs, searchTerm, statusFilter, genderFilter]);

  // Group dogs by gender
  const groupedDogs = useMemo(() => {
    const females = filteredDogs.filter(dog => dog.gender === 'female');
    // Sort females by age (oldest first)
    const sortedFemales = [...females].sort((a, b) => {
      if (!a.birthdate) return 1; // Dogs without birthdate go last
      if (!b.birthdate) return -1;
      return new Date(a.birthdate).getTime() - new Date(b.birthdate).getTime();
    });
    
    const males = filteredDogs.filter(dog => dog.gender === 'male');
    // Sort males by age (oldest first)
    const sortedMales = [...males].sort((a, b) => {
      if (!a.birthdate) return 1; // Dogs without birthdate go last
      if (!b.birthdate) return -1;
      return new Date(a.birthdate).getTime() - new Date(b.birthdate).getTime();
    });
    
    const unknown = filteredDogs.filter(dog => !dog.gender);
    
    return {
      females: sortedFemales,
      males: sortedMales,
      unknown
    };
  }, [filteredDogs]);

  return {
    filteredDogs,
    groupedDogs
  };
}
