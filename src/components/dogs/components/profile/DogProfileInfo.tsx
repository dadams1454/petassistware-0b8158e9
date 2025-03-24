
import React from 'react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import DogStatusCard from '../DogStatusCard';
import { DogProfile } from '@/types/dog';

interface DogProfileInfoProps {
  dog: DogProfile;
}

const DogProfileInfo: React.FC<DogProfileInfoProps> = ({ dog }) => {
  const navigate = useNavigate();
  const formattedBirthdate = dog.birthdate ? format(new Date(dog.birthdate), 'MMM d, yyyy') : 'Unknown';
  
  // Calculate age
  const calculateAge = (birthdate?: string): string => {
    if (!birthdate) return 'Unknown';
    
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 1) {
      // Calculate months for puppies
      const months = monthDiff < 0 ? 12 + monthDiff : monthDiff;
      return `${months} months`;
    }
    
    return `${age} years`;
  };

  const age = dog.birthdate ? calculateAge(dog.birthdate) : null;
  
  return (
    <div className="flex-1">
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
            <span className="ml-2">{age}</span>
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
  );
};

export default DogProfileInfo;
