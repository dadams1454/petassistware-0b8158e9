
import React from 'react';
import { format, parseISO, isValid } from 'date-fns';
import { DogProfile } from '../types/dog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DogInfoPanelProps {
  dog: DogProfile;
}

const DogInfoPanel: React.FC<DogInfoPanelProps> = ({ dog }) => {
  const formatDate = (date: string | undefined) => {
    if (!date) return 'Not recorded';
    const parsed = parseISO(date);
    return isValid(parsed) ? format(parsed, 'MMMM d, yyyy') : 'Invalid date';
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            {dog.photo_url ? (
              <img 
                src={dog.photo_url} 
                alt={dog.name} 
                className="w-32 h-32 rounded-full object-cover border-4 border-background"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center text-4xl">
                🐾
              </div>
            )}
            <Badge className="absolute bottom-0 right-0" variant="outline">
              {dog.gender}
            </Badge>
          </div>
          
          <h3 className="text-xl font-bold mb-1">{dog.name}</h3>
          <p className="text-muted-foreground mb-4">{dog.breed}</p>
          
          <div className="w-full space-y-3 mt-2">
            <InfoItem label="Status" value={dog.status || 'Active'} />
            <InfoItem label="Color" value={dog.color || 'Not specified'} />
            <InfoItem label="Birthdate" value={formatDate(dog.birthdate)} />
            
            {dog.weight && (
              <InfoItem 
                label="Weight" 
                value={`${dog.weight} ${dog.weight_unit || 'lbs'}`} 
              />
            )}
            
            {dog.microchip_number && (
              <InfoItem label="Microchip" value={dog.microchip_number} />
            )}
            
            {dog.registration_number && (
              <InfoItem label="Registration" value={dog.registration_number} />
            )}
            
            {dog.gender === 'Female' && dog.is_pregnant && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md mt-4">
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  Currently Pregnant
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">{label}:</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default DogInfoPanel;
