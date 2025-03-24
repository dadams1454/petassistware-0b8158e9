
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays } from 'lucide-react';
import { useAgeCalculation } from '../../hooks/useAgeCalculation';
import DogPhotoPlaceholder from '../DogPhotoPlaceholder';

interface DogProfile {
  dog_id: string;
  dog_name: string;
  dog_photo?: string;
  birth_date: string;
  breed: string;
  gender: string;
  status: string;
  group_ids?: string[];
}

interface DogCardProps {
  dog: DogProfile;
}

const DogCard: React.FC<DogCardProps> = ({ dog }) => {
  const age = useAgeCalculation(dog.birth_date);
  
  return (
    <Link to={`/dogs/${dog.dog_id}`}>
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardContent className="p-0">
          <div className="relative">
            {dog.dog_photo ? (
              <img 
                src={dog.dog_photo} 
                alt={dog.dog_name} 
                className="w-full h-48 object-cover rounded-t-lg"
              />
            ) : (
              <div className="w-full h-48 bg-muted rounded-t-lg flex items-center justify-center">
                <span className="text-5xl text-muted-foreground">
                  {dog.dog_name.charAt(0)}
                </span>
              </div>
            )}
            
            <div className="absolute top-2 right-2">
              <Badge variant={dog.status === 'active' ? 'default' : 'secondary'}>
                {dog.status}
              </Badge>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="font-medium text-lg">{dog.dog_name}</h3>
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <span>{dog.breed}</span>
              {dog.gender && (
                <>
                  <span className="text-xs">•</span>
                  <span>{dog.gender}</span>
                </>
              )}
            </div>
            
            {dog.birth_date && (
              <div className="flex items-center text-xs text-muted-foreground mt-2">
                <CalendarDays className="h-3 w-3 mr-1" />
                <span>
                  {new Date(dog.birth_date).toLocaleDateString()} ({age})
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
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default DogCard;
