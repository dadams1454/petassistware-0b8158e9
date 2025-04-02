
import React from 'react';
import { DogProfile } from '../types/dog';
import DogCard from './DogCard';

interface DogGridProps {
  dogs: DogProfile[];
  onDogClick: (dogId: string) => void;
}

const DogGrid: React.FC<DogGridProps> = ({ dogs, onDogClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {dogs.map((dog) => (
        <DogCard 
          key={dog.id} 
          dog={dog} 
          onClick={() => onDogClick(dog.id)} 
        />
      ))}
    </div>
  );
};

export default DogGrid;
