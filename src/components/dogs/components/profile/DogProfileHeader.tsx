
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit } from 'lucide-react';
import { DogProfile } from '@/types/dog';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/common/BackButton';
import DogProfilePhoto from './DogProfilePhoto';
import DogProfileInfo from './DogProfileInfo';

interface DogProfileHeaderProps {
  dog: DogProfile;
  onEdit?: () => void;
}

const DogProfileHeader: React.FC<DogProfileHeaderProps> = ({ dog, onEdit }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row items-start gap-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <DogProfilePhoto 
        dogId={dog.id}
        photoUrl={dog.photo_url}
        name={dog.name}
        hasPedigree={dog.pedigree}
      />
      
      <div className="flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-3xl font-bold">{dog.name}</h1>
          <div className="flex gap-2">
            <BackButton 
              fallbackPath="/dogs" 
              variant="outline"
              size="sm"
              label="Back to Dogs"
            />
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>
        
        <DogProfileInfo dog={dog} />
      </div>
    </div>
  );
};

export default DogProfileHeader;
