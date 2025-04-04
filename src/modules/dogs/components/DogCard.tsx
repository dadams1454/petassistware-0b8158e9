
import React from 'react';
import { DogProfile } from '../types/dog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';

interface DogCardProps {
  dog: DogProfile;
  onClick: () => void;
}

const DogCard: React.FC<DogCardProps> = ({ dog, onClick }) => {
  const formatBirthdate = (date: string | undefined) => {
    if (!date) return 'Unknown';
    const parsed = parseISO(date);
    return isValid(parsed) ? format(parsed, 'MMM d, yyyy') : 'Invalid date';
  };

  // Use default status if not provided
  const dogStatus = dog.status || 'active';

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow h-full"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        {dog.photo_url ? (
          <img 
            src={dog.photo_url} 
            alt={dog.name} 
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-5xl">🐾</span>
          </div>
        )}
        
        <div className="absolute top-2 right-2">
          <Badge variant={dogStatus === 'active' ? 'default' : 'secondary'}>
            {dogStatus}
          </Badge>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
          <h3 className="text-xl font-semibold text-white">{dog.name}</h3>
          <p className="text-white/80 text-sm">{dog.breed}</p>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Gender:</span> {dog.gender}
          </div>
          
          {dog.birthdate && (
            <div className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3 text-muted-foreground" />
              <span>{formatBirthdate(dog.birthdate)}</span>
            </div>
          )}
          
          {dog.color && (
            <div>
              <span className="text-muted-foreground">Color:</span> {dog.color}
            </div>
          )}
          
          {dog.weight && (
            <div>
              <span className="text-muted-foreground">Weight:</span> {dog.weight} {dog.weight_unit || 'lbs'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DogCard;
