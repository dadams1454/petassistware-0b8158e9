
import React from 'react';
import { DogProfile } from '@/types/dog';
import DogCard from './DogCard';

interface DogGroupProps {
  dogs: DogProfile[];
  title: string;
  icon: React.ReactNode;
  dogAppointments: Record<string, number>;
}

const DogGroup = ({ dogs, title, icon, dogAppointments }: DogGroupProps) => {
  if (dogs.length === 0) return null;
  
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-xl font-semibold">{title} ({dogs.length})</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dogs.map((dog) => (
          <DogCard 
            key={dog.id} 
            dog={dog} 
            appointmentCount={dogAppointments[dog.id] || 0}
          />
        ))}
      </div>
    </div>
  );
};

export default DogGroup;
