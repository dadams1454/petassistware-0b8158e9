
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays, differenceInDays } from 'date-fns';
import { Dog } from '@/types/reproductive';
import { useWelpingMutations } from '../../hooks/useWelpingMutations';
import { useToast } from '@/components/ui/use-toast';

interface PregnantDogsTabProps {
  isLoading: boolean;
}

const PregnantDogsTab: React.FC<PregnantDogsTabProps> = ({ isLoading }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { markLitterAsWhelping } = useWelpingMutations();
  
  // Fetch pregnant dogs
  const { data: pregnantDogs = [], isLoading: isLoadingDogs } = useQuery({
    queryKey: ['pregnantDogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('gender', 'Female')
        .eq('is_pregnant', true);
        
      if (error) throw error;
      return data as Dog[];
    },
  });
  
  // Function to start whelping for a pregnant dog
  const handleStartWhelping = async (dog: Dog) => {
    try {
      // First check if there's already a litter for this dam in planning status
      const { data: existingLitters } = await supabase
        .from('litters')
        .select('*')
        .eq('dam_id', dog.id)
        .eq('status', 'planned');
      
      if (existingLitters && existingLitters.length > 0) {
        // Use the existing litter
        await markLitterAsWhelping(existingLitters[0]);
        navigate(`/reproduction/welping/${existingLitters[0].id}`);
      } else {
        // No existing litter, redirect to create new whelping session
        navigate('/reproduction/welping/new', { state: { damId: dog.id } });
      }
    } catch (error) {
      console.error('Error starting whelping:', error);
      toast({
        title: 'Error',
        description: 'Failed to start whelping session.',
        variant: 'destructive',
      });
    }
  };
  
  if (isLoading || isLoadingDogs) {
    return (
      <div className="text-center py-10">
        <p>Loading pregnant dogs...</p>
      </div>
    );
  }
  
  if (pregnantDogs.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-muted-foreground mb-4">
            No pregnant dogs found. Mark a dog as pregnant to track whelping.
          </p>
          <Button onClick={() => navigate('/dogs')}>
            <Plus className="h-4 w-4 mr-2" />
            View Dogs
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Pregnant Dogs</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pregnantDogs.map((dog) => {
          // Calculate estimated due date (63 days from tie date)
          const tieDate = dog.tie_date ? new Date(dog.tie_date) : null;
          const dueDate = tieDate ? addDays(tieDate, 63) : null;
          const daysUntilDue = dueDate ? differenceInDays(dueDate, new Date()) : null;
          
          return (
            <Card key={dog.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{dog.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Breed:</span>{' '}
                    <span>{dog.breed || 'Unknown'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Color:</span>{' '}
                    <span>{dog.color || 'Unknown'}</span>
                  </div>
                  
                  {tieDate && (
                    <div>
                      <span className="text-muted-foreground">Tie Date:</span>{' '}
                      <span>{format(tieDate, 'MMM d, yyyy')}</span>
                    </div>
                  )}
                  
                  {dueDate && (
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-1">Due Date:</span>{' '}
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(dueDate, 'MMM d, yyyy')}
                      </span>
                    </div>
                  )}
                </div>
                
                {daysUntilDue !== null && (
                  <div className="text-sm flex items-center">
                    <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span>
                      {daysUntilDue > 0
                        ? `${daysUntilDue} days until due`
                        : daysUntilDue === 0
                        ? 'Due today!'
                        : `${Math.abs(daysUntilDue)} days overdue`}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-center pt-2">
                  <Button onClick={() => handleStartWhelping(dog)}>
                    Start Whelping
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PregnantDogsTab;
