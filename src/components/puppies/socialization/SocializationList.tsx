
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, SearchX, Loader2, AlertCircle } from 'lucide-react';
import { SocializationExperience } from '@/types/puppyTracking';
import { Badge } from '@/components/ui/badge';
import { getReactionObjectForUI } from '@/utils/socializationHelpers';

interface SocializationListProps {
  experiences: SocializationExperience[];
  isLoading: boolean;
  error?: string | null;
  onDelete: (id: string) => void;
}

const SocializationList: React.FC<SocializationListProps> = ({
  experiences,
  isLoading,
  error,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-60">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <AlertCircle className="h-10 w-10 text-destructive mb-2" />
          <h3 className="text-lg font-semibold">Error Loading Data</h3>
          <p className="text-muted-foreground text-center mt-1">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!experiences || experiences.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-10">
          <SearchX className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="text-lg font-semibold">No Experiences Yet</h3>
          <p className="text-muted-foreground text-center mt-1">
            No socialization experiences have been recorded. Add some using the form.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {experiences.map((experience) => {
        const reactionInfo = getReactionObjectForUI(experience.reaction || 'neutral');
        
        return (
          <Card key={experience.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{experience.experience}</h3>
                    <Badge variant="outline" className="text-xs capitalize">
                      {experience.category}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-2">
                    {format(
                      typeof experience.experience_date === 'string' 
                        ? parseISO(experience.experience_date) 
                        : experience.experience_date,
                      'MMM d, yyyy'
                    )}
                  </div>
                  
                  {experience.reaction && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className={reactionInfo.color.startsWith('#') ? '' : reactionInfo.color}>
                        {reactionInfo.emoji} {reactionInfo.name}
                      </span>
                    </div>
                  )}
                  
                  {experience.notes && (
                    <p className="text-sm mt-2">{experience.notes}</p>
                  )}
                </div>
                
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete(experience.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SocializationList;
