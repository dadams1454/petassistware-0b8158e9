
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { SocializationCategory, SocializationExperience, SocializationReaction } from '@/types/puppyTracking';

interface SocializationExperiencesListProps {
  experiences: SocializationExperience[];
  categories: SocializationCategory[];
  reactions: SocializationReaction[];
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const SocializationExperiencesList: React.FC<SocializationExperiencesListProps> = ({
  experiences,
  categories,
  reactions,
  onDelete,
  onAdd
}) => {
  // Helper to find category name
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  };
  
  // Helper to find reaction details
  const getReactionDetails = (reactionId?: string) => {
    if (!reactionId) return null;
    return reactions.find(r => r.id === reactionId);
  };
  
  // Helper to get color based on reaction
  const getReactionColor = (reactionId?: string) => {
    if (!reactionId) return 'bg-gray-100 text-gray-800';
    const reaction = getReactionDetails(reactionId);
    
    switch (reaction?.color) {
      case 'green': return 'bg-green-100 text-green-800';
      case 'blue': return 'bg-blue-100 text-blue-800';
      case 'amber': return 'bg-amber-100 text-amber-800';
      case 'red': return 'bg-red-100 text-red-800';
      case 'purple': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (experiences.length === 0) {
    return (
      <Card className="mt-4">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground mb-4">No socialization experiences recorded yet</p>
          <Button onClick={onAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Experience
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Recent Experiences</h3>
        <Button onClick={onAdd} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add New
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {experiences.map(exp => (
          <Card key={exp.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="bg-primary/10">
                      {getCategoryName(exp.category_id)}
                    </Badge>
                    
                    {exp.reaction && (
                      <Badge variant="outline" className={getReactionColor(exp.reaction)}>
                        {getReactionDetails(exp.reaction)?.name || exp.reaction}
                      </Badge>
                    )}
                  </div>
                  
                  <h4 className="font-medium">{exp.experience}</h4>
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Experience</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this socialization experience? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => onDelete(exp.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              
              {exp.notes && (
                <p className="text-sm text-muted-foreground mb-2">{exp.notes}</p>
              )}
              
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{new Date(exp.experience_date).toLocaleDateString()}</span>
                <span>{formatDistance(new Date(exp.created_at), new Date(), { addSuffix: true })}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SocializationExperiencesList;
