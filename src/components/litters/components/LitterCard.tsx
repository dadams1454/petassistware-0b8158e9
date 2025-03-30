
import React from 'react';
import { Litter } from '@/types/litter';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Archive, Trash2, RotateCcw } from 'lucide-react';
import { formatDateForDisplay } from '@/utils/dateUtils';

interface LitterCardProps {
  litter: Litter;
  onEditLitter: (litter: Litter) => void;
  onDeleteLitter: (litter: Litter) => void;
  onArchiveLitter: (litter: Litter) => void;
  onUnarchiveLitter?: (litter: Litter) => void;
}

const LitterCard: React.FC<LitterCardProps> = ({ 
  litter,
  onEditLitter,
  onDeleteLitter,
  onArchiveLitter,
  onUnarchiveLitter
}) => {
  const isArchived = litter.status === 'archived';
  
  // Function to format the litter name
  const getLitterName = () => {
    if (litter.litter_name) return litter.litter_name;
    
    const damName = litter.dam ? litter.dam.name : 'Unknown Dam';
    return `${damName}'s Litter`;
  };

  return (
    <Card className={`${isArchived ? 'opacity-75' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span className="truncate">{getLitterName()}</span>
          {isArchived && (
            <span className="text-xs bg-gray-200 text-gray-700 rounded-full px-2 py-1">
              Archived
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Birth Date</p>
            <p>{litter.birth_date ? formatDateForDisplay(new Date(litter.birth_date)) : 'Not set'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Puppies</p>
            <p>{litter.puppy_count || 0} total</p>
          </div>
          <div>
            <p className="text-muted-foreground">Dam</p>
            <p>{litter.dam ? litter.dam.name : 'Not set'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Sire</p>
            <p>{litter.sire ? litter.sire.name : 'Not set'}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-1">
        {isArchived ? (
          <>
            {onUnarchiveLitter && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onUnarchiveLitter(litter)}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Unarchive
              </Button>
            )}
          </>
        ) : (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEditLitter(litter)}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onArchiveLitter(litter)}
            >
              <Archive className="h-4 w-4" />
              <span className="sr-only">Archive</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onDeleteLitter(litter)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default LitterCard;
