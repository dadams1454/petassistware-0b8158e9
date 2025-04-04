
import React from 'react';
import { format } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  Calendar, 
  Trash
} from 'lucide-react';
import { SocializationRecord } from '../types';
import { socializationCategoryOptions } from './socializationCategories';
import { socializationReactions } from './socializationReactions';

interface SocializationListProps {
  experiences: SocializationRecord[];
  isLoading: boolean;
  error: string;
  onDelete: (id: string) => Promise<void>;
}

const SocializationList: React.FC<SocializationListProps> = ({ 
  experiences, 
  isLoading, 
  error, 
  onDelete 
}) => {
  if (isLoading) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Loading socialization experiences...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-destructive gap-2">
        <AlertCircle className="h-5 w-5" />
        <p>{error}</p>
      </div>
    );
  }

  if (experiences.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg">
        <p className="text-muted-foreground mb-2">No socialization experiences recorded yet.</p>
        <p className="text-sm text-muted-foreground">
          Use the "Add New" tab to record socialization experiences for this puppy.
        </p>
      </div>
    );
  }

  const getReactionBadge = (reactionId?: string) => {
    if (!reactionId) return null;
    
    const reaction = socializationReactions.find(r => r.id === reactionId);
    if (!reaction) return null;
    
    const colorMap: Record<string, string> = {
      green: 'bg-green-100 text-green-800',
      blue: 'bg-blue-100 text-blue-800',
      amber: 'bg-amber-100 text-amber-800',
      red: 'bg-red-100 text-red-800',
      purple: 'bg-purple-100 text-purple-800',
      yellow: 'bg-yellow-100 text-yellow-800' // Added yellow for the 'fearful' reaction
    };
    
    const badgeColor = reaction.color ? colorMap[reaction.color] : 'bg-gray-100 text-gray-800';
    
    return (
      <Badge className={badgeColor}>
        {reaction.name}
      </Badge>
    );
  };

  const getCategoryDisplayName = (categoryId: string) => {
    if (typeof categoryId === 'object' && categoryId.name) {
      return categoryId.name;
    }
    
    const category = socializationCategoryOptions.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  return (
    <div className="space-y-4">
      {experiences.map((experience) => (
        <Card key={experience.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">
                  {experience.experience}
                </CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(new Date(experience.experience_date), 'MMM d, yyyy')}
                </CardDescription>
              </div>
              <Badge variant="outline">
                {getCategoryDisplayName(experience.category.id)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            {experience.reaction && (
              <div className="mb-2">
                <p className="text-xs text-muted-foreground mb-1">Reaction:</p>
                {getReactionBadge(experience.reaction)}
              </div>
            )}
            {experience.notes && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Notes:</p>
                <p className="text-sm">{experience.notes}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-2 flex justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(experience.id)}
            >
              <Trash className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default SocializationList;
