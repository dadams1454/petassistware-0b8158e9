
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { Litter } from '@/types/litter';
import { useNavigate } from 'react-router-dom';
import { format, isValid } from 'date-fns';
import { useWelpingMutations } from '../../hooks/useWelpingMutations';
import { useToast } from '@/components/ui/use-toast';

interface ActiveWelpingsTabProps {
  litters: Litter[];
  isLoading: boolean;
}

const ActiveWelpingsTab: React.FC<ActiveWelpingsTabProps> = ({ litters, isLoading }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { deleteLitter } = useWelpingMutations();
  
  // Function to view a whelping session
  const handleView = (litterId: string) => {
    navigate(`/reproduction/welping/${litterId}`);
  };
  
  // Function to edit a litter
  const handleEdit = (litterId: string) => {
    navigate(`/reproduction/litters/${litterId}`);
  };
  
  // Function to delete a litter
  const handleDelete = async (litterId: string) => {
    if (window.confirm('Are you sure you want to delete this whelping record? This action cannot be undone.')) {
      try {
        await deleteLitter(litterId);
        toast({
          title: 'Whelping record deleted',
          description: 'The whelping record has been successfully deleted.',
        });
      } catch (error) {
        console.error('Error deleting litter:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete the whelping record.',
          variant: 'destructive',
        });
      }
    }
  };
  
  // Function to start a new whelping session
  const handleStartNew = () => {
    navigate('/reproduction/welping/new');
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p>Loading active whelping sessions...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Active Whelping Sessions</h3>
        <Button onClick={handleStartNew}>
          <Plus className="h-4 w-4 mr-2" />
          Start New Whelping
        </Button>
      </div>
      
      {litters.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground mb-4">
              No active whelping sessions found.
            </p>
            <Button onClick={handleStartNew}>
              <Plus className="h-4 w-4 mr-2" />
              Start New Whelping
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {litters.map((litter) => {
            const birthDate = litter.birth_date ? new Date(litter.birth_date) : null;
            
            return (
              <Card key={litter.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{litter.litter_name || 'Unnamed Litter'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Dam:</span>{' '}
                      <span>{litter.dam?.name || 'Unknown'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sire:</span>{' '}
                      <span>{litter.sire?.name || 'Unknown'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Birth Date:</span>{' '}
                      <span>
                        {birthDate && isValid(birthDate)
                          ? format(birthDate, 'MMM d, yyyy')
                          : 'Not set'}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>{' '}
                      <span className="capitalize">{litter.status || 'Active'}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-muted-foreground">Puppies:</span>{' '}
                    <span>
                      {(litter.male_count || 0) + (litter.female_count || 0)} total
                      {litter.male_count ? ` (${litter.male_count} males)` : ''}
                      {litter.female_count ? ` (${litter.female_count} females)` : ''}
                    </span>
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(litter.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <div className="space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(litter.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(litter.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActiveWelpingsTab;
