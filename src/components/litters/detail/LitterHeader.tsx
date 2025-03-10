
import React from 'react';
import { format } from 'date-fns';
import { Edit, Calendar, Paw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DogCard from '@/components/dogs/DogDetails';
import { Link } from 'react-router-dom';

interface LitterHeaderProps {
  litter: {
    id: string;
    litter_name?: string | null;
    birth_date?: string | null;
  };
  sire?: {
    id: string;
    name: string;
    breed?: string | null;
    photo_url?: string | null;
  } | null;
  dam?: {
    id: string;
    name: string;
    breed?: string | null;
    photo_url?: string | null;
  } | null;
  onEditClick?: () => void;
}

const LitterHeader: React.FC<LitterHeaderProps> = ({ litter, sire, dam, onEditClick }) => {
  return (
    <div className="bg-card shadow-sm rounded-lg p-6 border">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {litter.litter_name || `Litter ${litter.id.substring(0, 6)}`}
          </h1>
          <div className="flex items-center mt-1 text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              Birth Date: {litter.birth_date 
                ? format(new Date(litter.birth_date), 'MMMM d, yyyy') 
                : 'Not recorded'}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2 mt-3 lg:mt-0">
          {/* Add Welping Page Link */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="gap-1"
          >
            <Link to={`/welping/${litter.id}`}>
              <Paw className="h-4 w-4" />
              Welping Session
            </Link>
          </Button>
          
          {/* Edit Button (if provided) */}
          {onEditClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEditClick}
              className="gap-1"
            >
              <Edit className="h-4 w-4" />
              Edit Litter
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dam && (
          <div>
            <p className="text-sm font-medium mb-2">Dam:</p>
            <DogCard dog={dam} />
          </div>
        )}
        
        {sire && (
          <div>
            <p className="text-sm font-medium mb-2">Sire:</p>
            <DogCard dog={sire} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LitterHeader;
