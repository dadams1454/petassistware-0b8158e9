
import React from 'react';
import { CalendarDays } from 'lucide-react';
import { DogProfile } from '@/types/dog';
import { useAgeCalculation } from '../../hooks/useAgeCalculation';

interface DogCardContentProps {
  dog: DogProfile;
  appointmentCount: number;
}

const DogCardContent = ({ dog, appointmentCount }: DogCardContentProps) => {
  const age = useAgeCalculation(dog.birthdate);
  
  return (
    <div>
      <h3 className="font-medium text-lg">{dog.name}</h3>
      
      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
        <span>{dog.breed}</span>
        {dog.gender && (
          <>
            <span className="text-xs">•</span>
            <span>{dog.gender}</span>
          </>
        )}
      </div>
      
      {dog.birthdate && (
        <div className="flex items-center text-xs text-muted-foreground mt-2">
          <CalendarDays className="h-3 w-3 mr-1" />
          <span>
            {new Date(dog.birthdate).toLocaleDateString()} ({age})
          </span>
        </div>
      )}
      
      {dog.group_ids && dog.group_ids.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {dog.group_ids.slice(0, 2).map(groupId => (
            <span 
              key={groupId} 
              className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs"
            >
              Group {groupId}
            </span>
          ))}
          {dog.group_ids.length > 2 && (
            <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded-full text-xs">
              +{dog.group_ids.length - 2} more
            </span>
          )}
        </div>
      )}
      
      {appointmentCount > 0 && (
        <div className="mt-2 text-sm text-amber-600">
          {appointmentCount} upcoming appointment{appointmentCount !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default DogCardContent;
