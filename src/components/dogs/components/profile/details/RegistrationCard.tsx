
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';
import { DogProfile } from '@/types/dog';

interface RegistrationCardProps {
  dog: DogProfile;
}

const RegistrationCard: React.FC<RegistrationCardProps> = ({ dog }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="mr-2 h-5 w-5" />
          Registration & Identification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Registration Number</p>
            <p>{dog.registration_number || 'Not registered'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Registry</p>
            <p>{dog.registration_organization || 'N/A'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Microchip ID</p>
            <p>{dog.microchip_number || 'No microchip'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Microchip Location</p>
            <p>{dog.microchip_location || 'N/A'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegistrationCard;
