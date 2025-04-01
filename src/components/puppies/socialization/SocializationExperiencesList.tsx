
import React from 'react';
import { format } from 'date-fns';
import { 
  Calendar, 
  Trash2, 
  AlertCircle 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SocializationExperience } from '@/types/puppyTracking';
import { 
  SOCIALIZATION_CATEGORIES, 
  SOCIALIZATION_REACTIONS 
} from '@/data/socializationCategories';

interface SocializationExperiencesListProps {
  experiences: SocializationExperience[];
  isLoading: boolean;
  error: any;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const SocializationExperiencesList: React.FC<SocializationExperiencesListProps> = ({ 
  experiences, 
  isLoading, 
  error, 
  onDelete,
  isDeleting
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-destructive">
        <AlertCircle className="h-10 w-10 mb-2" />
        <p>Error loading socialization experiences</p>
        <p className="text-sm">{error.message || 'Unknown error'}</p>
      </div>
    );
  }
  
  if (experiences.length === 0) {
    return (
      <div className="text-center p-10 border border-dashed rounded-lg">
        <p className="text-muted-foreground mb-2">No socialization experiences recorded yet</p>
        <p className="text-sm text-muted-foreground">
          Use the form to record new socialization experiences for this puppy
        </p>
      </div>
    );
  }
  
  // Helper function to get category name from ID
  const getCategoryName = (categoryId: string): string => {
    const category = SOCIALIZATION_CATEGORIES.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };
  
  // Helper function to get reaction details from ID
  const getReactionBadge = (reactionId?: string) => {
    if (!reactionId) return null;
    
    const reaction = SOCIALIZATION_REACTIONS.find(r => r.id === reactionId);
    if (!reaction) return null;
    
    // Map reaction colors to Tailwind classes
    const colorMap: Record<string, string> = {
      'green': 'bg-green-100 text-green-800',
      'emerald': 'bg-emerald-100 text-emerald-800',
      'blue': 'bg-blue-100 text-blue-800',
      'amber': 'bg-amber-100 text-amber-800',
      'orange': 'bg-orange-100 text-orange-800',
      'red': 'bg-red-100 text-red-800'
    };
    
    const badgeClass = colorMap[reaction.color] || 'bg-gray-100 text-gray-800';
    
    return (
      <Badge className={badgeClass}>
        {reaction.name}
      </Badge>
    );
  };

  // Group experiences by date
  const experiencesByDate = experiences.reduce((groups: Record<string, SocializationExperience[]>, exp) => {
    const date = exp.experience_date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(exp);
    return groups;
  }, {});
  
  // Sort dates in descending order (most recent first)
  const sortedDates = Object.keys(experiencesByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  return (
    <div className="space-y-6">
      {sortedDates.map(date => (
        <div key={date} className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">
              {format(new Date(date), 'EEEE, MMMM d, yyyy')}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {experiencesByDate[date].map((exp) => (
              <Card key={exp.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-base">
                      {exp.experience}
                    </CardTitle>
                    <Badge variant="outline">
                      {getCategoryName(exp.category_id)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 pt-2">
                  {exp.reaction && (
                    <div className="mb-2">
                      <p className="text-xs text-muted-foreground mb-1">Reaction:</p>
                      {getReactionBadge(exp.reaction)}
                    </div>
                  )}
                  
                  {exp.notes && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Notes:</p>
                      <p className="text-sm">{exp.notes}</p>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="p-3 pt-0 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDelete(exp.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SocializationExperiencesList;
