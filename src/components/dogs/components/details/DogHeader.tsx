
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MoreHorizontal, Edit, Trash, Share, Download, 
  Heart, PawPrint, Calendar, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import DogStatusCard from '../DogStatusCard';

interface DogHeaderProps {
  dog: any;
  isFullPage?: boolean;
  upcomingEvents?: number;
  onEdit?: (dog: any) => void;
  onDelete?: (dogId: string) => void;
  onViewFirstEvent?: () => void;
  onAddAppointment?: () => void;
}

const DogHeader: React.FC<DogHeaderProps> = ({ 
  dog, 
  isFullPage = false,
  upcomingEvents,
  onEdit,
  onDelete,
  onViewFirstEvent,
  onAddAppointment
}) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleViewDetails = () => {
    navigate(`/dogs/${dog.id}`);
  };

  return (
    <div className={`flex flex-col ${isFullPage ? 'mb-6' : 'mb-2'}`}>
      <div className="flex items-start gap-4">
        {dog.photo_url ? (
          <img
            src={dog.photo_url}
            alt={dog.name}
            className="h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
            <PawPrint className="h-12 w-12 text-primary" />
          </div>
        )}
        
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">{dog.name}</h2>
            {dog.pedigree && (
              <Badge variant="secondary">
                <Heart className="h-3.5 w-3.5 mr-1" />
                Pedigree
              </Badge>
            )}
          </div>
          
          <div className="text-muted-foreground text-sm mb-1">
            {dog.breed} • {dog.gender} • {dog.weight} lbs
          </div>
          
          {/* Add DogStatusCard for displaying heat/pregnancy status */}
          <DogStatusCard dog={dog} />
          
          {/* Add upcoming events button if available */}
          {upcomingEvents && upcomingEvents > 0 && onViewFirstEvent && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 mr-2"
              onClick={onViewFirstEvent}
            >
              <Calendar className="h-4 w-4 mr-1" />
              {upcomingEvents} Upcoming {upcomingEvents === 1 ? 'Event' : 'Events'}
            </Button>
          )}
          
          {onAddAppointment && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={onAddAppointment}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Add Appointment
            </Button>
          )}
          
          {!isFullPage && (
            <div className="flex items-center mt-2 space-x-2">
              <Button variant="outline" size="sm" onClick={handleViewDetails}>
                View Details
              </Button>
              {onEdit && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit(dog)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DogHeader;

