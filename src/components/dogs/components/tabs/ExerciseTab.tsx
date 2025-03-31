
import React from 'react';
import ExerciseTracker from '../exercise/ExerciseTracker';
import { DogProfile } from '@/types/dog';
import { differenceInYears } from 'date-fns';

interface ExerciseTabProps {
  dog: DogProfile;
}

const ExerciseTab: React.FC<ExerciseTabProps> = ({ dog }) => {
  // Extract health conditions (this could be expanded with more detailed health information)
  const healthConditions = dog.notes?.includes('health issue') 
    ? dog.notes.split(',').filter(note => note.includes('health issue'))
    : [];
  
  return (
    <ExerciseTracker 
      dogId={dog.id}
      dogName={dog.name}
      dogBreed={dog.breed}
      dogBirthdate={dog.birthdate ? new Date(dog.birthdate) : undefined}
      dogWeight={dog.weight ? Number(dog.weight) : undefined}
      healthConditions={healthConditions}
    />
  );
};

export default ExerciseTab;
