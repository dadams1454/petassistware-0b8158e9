
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SocializationExperience } from '@/types/puppyTracking';
import { getReactionColor, getReactionName } from '@/utils/socializationHelpers';

interface SocializationExperiencesListProps {
  experiences: SocializationExperience[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

const SocializationExperiencesList: React.FC<SocializationExperiencesListProps> = ({
  experiences,
  isLoading,
  onDelete
}) => {
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading socialization experiences...</p>
        </CardContent>
      </Card>
    );
  }

  if (experiences.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No socialization experiences recorded yet.</p>
        </CardContent>
      </Card>
    );
  }

  // Group experiences by category
  const groupedExperiences: Record<string, SocializationExperience[]> = {};
  experiences.forEach(exp => {
    const categoryName = exp.category || 'Uncategorized';
    if (!groupedExperiences[categoryName]) {
      groupedExperiences[categoryName] = [];
    }
    groupedExperiences[categoryName].push(exp);
  });

  // Get reaction badge style based on reaction
  const getReactionBadgeStyle = (reaction: string) => {
    return {
      backgroundColor: `${getReactionColor(reaction)}20`,
      color: getReactionColor(reaction),
      borderColor: getReactionColor(reaction)
    };
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedExperiences).map(([category, exps]) => (
        <Card key={category}>
          <CardHeader className="py-3">
            <h3 className="font-medium text-lg">{category}</h3>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {exps.map(experience => (
                <div 
                  key={experience.id} 
                  className="p-3 border rounded-md flex flex-col sm:flex-row justify-between gap-3"
                >
                  <div>
                    <h4 className="font-medium mb-1">{experience.experience_type}</h4>
                    
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge 
                        variant="outline"
                        style={getReactionBadgeStyle(experience.reaction)}
                      >
                        {getReactionName(experience.reaction)}
                      </Badge>
                      
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(experience.experience_date)}
                      </Badge>
                    </div>
                    
                    {experience.notes && (
                      <p className="text-sm text-muted-foreground">{experience.notes}</p>
                    )}
                  </div>
                  
                  <div className="flex-shrink-0">
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => onDelete(experience.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SocializationExperiencesList;
