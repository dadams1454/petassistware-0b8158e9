
import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface DogDetailsProps {
  dog: any;
}

const DogDetails = ({ dog }: DogDetailsProps) => {
  return (
    <div className="space-y-6">
      <div className="relative h-48 rounded-md overflow-hidden">
        {dog.photo_url ? (
          <img 
            src={dog.photo_url} 
            alt={dog.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="bg-muted w-full h-full flex items-center justify-center">
            <span className="text-4xl">🐾</span>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold flex items-center">
          {dog.name}
          {dog.pedigree && (
            <Badge className="ml-2" variant="outline">Pedigree</Badge>
          )}
        </h2>
        <p className="text-lg text-muted-foreground">{dog.breed}</p>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Gender</h3>
          <p>{dog.gender || 'Not specified'}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Birthdate</h3>
          <p>{dog.birthdate ? format(new Date(dog.birthdate), 'PPP') : 'Not specified'}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Color</h3>
          <p>{dog.color || 'Not specified'}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Weight</h3>
          <p>{dog.weight ? `${dog.weight} kg` : 'Not specified'}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Microchip Number</h3>
          <p>{dog.microchip_number || 'Not specified'}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Registration Number</h3>
          <p>{dog.registration_number || 'Not specified'}</p>
        </div>
      </div>
      
      {dog.notes && (
        <>
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
            <Card>
              <CardContent className="pt-4">
                <p className="whitespace-pre-line">{dog.notes}</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default DogDetails;
