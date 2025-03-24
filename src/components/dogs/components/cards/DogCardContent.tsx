
import React from 'react';
import { format, differenceInYears, differenceInMonths } from 'date-fns';
import { DogProfile } from '@/types/dog';
import { Badge } from '@/components/ui/badge';

interface DogCardContentProps {
  dog: DogProfile;
  appointmentCount: number;
}

// Displays the dog's age based on birthdate
export const DogAge = ({ birthdate }: { birthdate: string | null }) => {
  if (!birthdate) return null;
  
  const birthDate = new Date(birthdate);
  const years = differenceInYears(new Date(), birthDate);
  const months = differenceInMonths(new Date(), birthDate) % 12;
  
  if (years > 0) {
    return (
      <span className="text-muted-foreground">
        {years} {years === 1 ? 'year' : 'years'}
        {months > 0 ? `, ${months} ${months === 1 ? 'month' : 'months'}` : ''}
      </span>
    );
  }
  
  return <span className="text-muted-foreground">{months} {months === 1 ? 'month' : 'months'}</span>;
};

// Status badge component
export const DogStatusBadge = ({ status }: { status: string }) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'retired':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'deceased':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Badge variant="outline" className={`${getStatusVariant(status)} border-none`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

// Appointment badge component
export const AppointmentBadge = ({ count }: { count: number }) => {
  if (count === 0) return null;
  
  return (
    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-none ml-2">
      {count} {count === 1 ? 'appointment' : 'appointments'}
    </Badge>
  );
};

// Card header component
export const DogCardHeader = ({ dog, appointmentCount }: DogCardContentProps) => (
  <div className="flex justify-between items-start mb-2">
    <h3 className="font-semibold text-lg truncate pr-2">{dog.name}</h3>
    <div className="flex flex-wrap gap-1 justify-end">
      {dog.status && <DogStatusBadge status={dog.status} />}
      <AppointmentBadge count={appointmentCount} />
    </div>
  </div>
);

// Card metadata component
export const DogCardMetadata = ({ dog }: { dog: DogProfile }) => (
  <div className="mt-2 space-y-1">
    {dog.breed && (
      <p className="text-sm font-medium">{dog.breed}</p>
    )}
    {dog.birthdate && (
      <p className="text-sm">
        <span className="text-muted-foreground">Born: </span>
        {format(new Date(dog.birthdate), 'MMM d, yyyy')} 
        <span className="mx-1">•</span>
        <DogAge birthdate={dog.birthdate} />
      </p>
    )}
    {dog.color && (
      <p className="text-sm text-muted-foreground">
        Color: {dog.color}
      </p>
    )}
  </div>
);

const DogCardContent: React.FC<DogCardContentProps> = ({ dog, appointmentCount }) => {
  return (
    <>
      <DogCardHeader dog={dog} appointmentCount={appointmentCount} />
      
      <div className="flex items-center mt-1">
        <div className="text-sm">
          {dog.gender && (
            <span className={`font-medium ${dog.gender === 'female' ? 'text-pink-600 dark:text-pink-400' : 'text-blue-600 dark:text-blue-400'}`}>
              {dog.gender.charAt(0).toUpperCase() + dog.gender.slice(1)}
            </span>
          )}
        </div>
      </div>
      
      <DogCardMetadata dog={dog} />
    </>
  );
};

export default DogCardContent;
