
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { DogProfile } from '@/types/dog';
import DogStatusCard from './DogStatusCard';

interface DogCardProps {
  dog: DogProfile;
  appointmentCount?: number;
}

const DogCard: React.FC<DogCardProps> = ({ dog, appointmentCount = 0 }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profile/dog/${dog.id}`);
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer h-full hover:shadow-md transition-shadow" 
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="relative">
          {dog.photo_url ? (
            <div 
              className="h-48 w-full bg-muted"
              style={{
                backgroundImage: `url(${dog.photo_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ) : (
            <div className="w-full h-48 bg-muted flex items-center justify-center">
              <span className="text-5xl text-muted-foreground">
                🐾
              </span>
            </div>
          )}
          
          <div className="absolute top-3 left-3 z-30 flex gap-2 flex-wrap">
            {dog.gender === 'female' && (
              <DogStatusCard dog={dog} />
            )}
            
            {appointmentCount > 0 && (
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1">
                <Bell className="h-3 w-3" />
                {appointmentCount}
              </Badge>
            )}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
            <h3 className="text-xl font-semibold text-white">{dog.name}</h3>
            <p className="text-white/80">{dog.breed}</p>
          </div>
          
          <div className="absolute top-3 right-3">
            <Badge variant={dog.status === 'active' ? 'default' : 'secondary'}>
              {dog.status}
            </Badge>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            {dog.gender && (
              <div>
                <span className="text-muted-foreground">Gender:</span> {dog.gender}
              </div>
            )}
            {dog.birthdate && (
              <div className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3 text-muted-foreground" />
                <span>{format(new Date(dog.birthdate), 'PP')}</span>
              </div>
            )}
            {dog.color && (
              <div>
                <span className="text-muted-foreground">Color:</span> {dog.color}
              </div>
            )}
            {dog.weight && (
              <div>
                <span className="text-muted-foreground">Weight:</span> {dog.weight} kg
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DogCard;
