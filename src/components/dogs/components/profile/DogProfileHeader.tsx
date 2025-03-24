
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Heart, PawPrint, Calendar, Edit } from 'lucide-react';
import { DogProfile } from '@/types/dog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DogStatusCard from '../DogStatusCard';

interface DogProfileHeaderProps {
  dog: DogProfile;
  onEdit?: () => void;
}

const DogProfileHeader: React.FC<DogProfileHeaderProps> = ({ dog, onEdit }) => {
  const navigate = useNavigate();
  
  const formattedBirthdate = dog.birthdate ? format(new Date(dog.birthdate), 'MMM d, yyyy') : 'Unknown';
  const age = dog.birthdate 
    ? Math.floor((new Date().getTime() - new Date(dog.birthdate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) 
    : null;
    
  return (
    <div className="flex flex-col md:flex-row items-start gap-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="relative">
        {dog.photo_url ? (
          <div className="h-32 w-32 md:h-48 md:w-48 rounded-lg overflow-hidden border-2 border-primary/20">
            <img
              src={dog.photo_url}
              alt={dog.name}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="h-32 w-32 md:h-48 md:w-48 rounded-lg flex items-center justify-center bg-primary/10 border-2 border-primary/20">
            <PawPrint className="h-16 w-16 text-primary/50" />
          </div>
        )}
        
        {dog.pedigree && (
          <Badge className="absolute top-2 right-2 bg-purple-500" variant="secondary">
            <Heart className="h-3 w-3 mr-1" />
            Pedigree
          </Badge>
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-3xl font-bold">{dog.name}</h1>
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
        
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
          <div className="flex items-center text-muted-foreground">
            <span className="font-medium">Breed:</span>
            <span className="ml-2">{dog.breed}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <span className="font-medium">Color:</span>
            <span className="ml-2">{dog.color}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <span className="font-medium">Gender:</span>
            <span className="ml-2">{dog.gender}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <span className="font-medium">Weight:</span>
            <span className="ml-2">{dog.weight} {dog.weight_unit}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <span className="font-medium">Birthdate:</span>
            <span className="ml-2">{formattedBirthdate}</span>
          </div>
          
          {age !== null && (
            <div className="flex items-center text-muted-foreground">
              <span className="font-medium">Age:</span>
              <span className="ml-2">{age} years</span>
            </div>
          )}
          
          {dog.status && (
            <div className="flex items-center text-muted-foreground">
              <span className="font-medium">Status:</span>
              <span className="ml-2">{dog.status}</span>
            </div>
          )}
          
          {dog.registration_number && (
            <div className="flex items-center text-muted-foreground">
              <span className="font-medium">Registration:</span>
              <span className="ml-2">
                {dog.registration_organization || 'AKC'} #{dog.registration_number}
              </span>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <DogStatusCard dog={dog} />
        </div>
        
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/calendar?dogId=${dog.id}`)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Appointment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DogProfileHeader;
