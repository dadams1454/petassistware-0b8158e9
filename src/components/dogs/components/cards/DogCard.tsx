
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DogProfile } from '@/types/dog';
import { Card, CardContent } from '@/components/ui/card';
import DogPhotoPlaceholder from '../DogPhotoPlaceholder';
import DogCardContent from './DogCardContent';

interface DogCardProps {
  dog: DogProfile;
  appointmentCount: number;
}

const DogCard = ({ dog, appointmentCount }: DogCardProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/dogs/${dog.id}`);
  };
  
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <div className="relative h-48 overflow-hidden">
        {dog.photo_url ? (
          <img 
            src={dog.photo_url} 
            alt={dog.name} 
            className="object-cover w-full h-full"
          />
        ) : (
          <DogPhotoPlaceholder gender={dog.gender} />
        )}
      </div>
      <CardContent className="pt-4">
        <DogCardContent dog={dog} appointmentCount={appointmentCount} />
      </CardContent>
    </Card>
  );
};

export default DogCard;
