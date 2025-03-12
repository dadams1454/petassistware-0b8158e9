
import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Calendar, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DogHeaderProps {
  dog: any;
  upcomingEvents: number;
  onEdit: () => void;
  onViewFirstEvent: () => void;
  onAddAppointment: () => void;
}

const DogHeader: React.FC<DogHeaderProps> = ({
  dog,
  upcomingEvents,
  onEdit,
  onViewFirstEvent,
  onAddAppointment
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start">
      <div className="w-full sm:w-1/4 aspect-square relative rounded-lg overflow-hidden bg-muted">
        {dog.photo_url ? (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${dog.photo_url})` }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-5xl">🐾</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{dog.name}</h2>
            <p className="text-muted-foreground">{dog.breed}</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onAddAppointment}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Add Appointment
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onEdit}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-y-2">
          {dog.gender && (
            <div>
              <span className="text-muted-foreground font-medium">Gender:</span>{' '}
              {dog.gender}
            </div>
          )}
          
          {dog.birthdate && (
            <div>
              <span className="text-muted-foreground font-medium">Date of Birth:</span>{' '}
              {format(new Date(dog.birthdate), 'PPP')}
            </div>
          )}
          
          {dog.color && (
            <div>
              <span className="text-muted-foreground font-medium">Color:</span>{' '}
              {dog.color}
            </div>
          )}
          
          {dog.weight && (
            <div>
              <span className="text-muted-foreground font-medium">Weight:</span>{' '}
              {dog.weight} kg
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {dog.pedigree && (
            <Badge variant="outline" className="bg-primary/10">Pedigree</Badge>
          )}
          
          {upcomingEvents > 0 && (
            <Badge 
              variant="outline" 
              className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1 cursor-pointer hover:bg-amber-200 transition-colors"
              onClick={onViewFirstEvent}
            >
              <Bell className="h-3 w-3" />
              {upcomingEvents} {upcomingEvents === 1 ? 'Appointment' : 'Appointments'}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default DogHeader;
