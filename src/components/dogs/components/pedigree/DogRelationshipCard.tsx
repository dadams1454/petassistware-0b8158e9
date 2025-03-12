
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface DogRelationshipCardProps {
  dogId: string;
  relatedDog: any;
  relationshipId: string;
  onRemove: (relationshipId: string) => void;
}

const DogRelationshipCard = ({ 
  relatedDog, 
  relationshipId, 
  onRemove 
}: DogRelationshipCardProps) => {
  if (!relatedDog) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg hover:bg-accent/40 transition-colors">
      <div className="h-10 w-10 rounded-full bg-muted overflow-hidden flex-shrink-0">
        {relatedDog?.photo_url ? (
          <div 
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${relatedDog.photo_url})` }}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
            🐾
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{relatedDog?.name || 'Unknown Dog'}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{relatedDog?.breed || 'Unknown Breed'}</span>
          {relatedDog?.gender && (
            <>
              <span>•</span>
              <span>{relatedDog.gender}</span>
            </>
          )}
          {relatedDog?.color && (
            <>
              <span>•</span>
              <span>{relatedDog.color}</span>
            </>
          )}
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={() => onRemove(relationshipId)}
        title="Remove relationship"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DogRelationshipCard;
