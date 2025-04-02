
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Baby, 
  Calendar, 
  Clock, 
  Dog, 
  Eye, 
  Info, 
  PlayCircle 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import EmptyState from '@/components/common/EmptyState';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface PregnantDogsTabProps {
  isLoading?: boolean;
}

const PregnantDogsTab: React.FC<PregnantDogsTabProps> = ({
  isLoading: parentLoading
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isStartLabor, setIsStartLabor] = useState(false);
  const [selectedDog, setSelectedDog] = useState<any>(null);
  
  const { data: pregnantDogs = [], isLoading: isDogsLoading } = useQuery({
    queryKey: ['pregnant-dogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('gender', 'Female')
        .eq('is_pregnant', true)
        .order('name');
        
      if (error) throw error;
      return data;
    }
  });
  
  const startLaborMutation = useMutation({
    mutationFn: async ({ dogId, damId, birthDate }: { dogId: string, damId: string, birthDate: string }) => {
      // Try to find if there's already a litter with this dam
      const { data: existingLitters, error: existingError } = await supabase
        .from('litters')
        .select('id')
        .eq('dam_id', damId)
        .eq('birth_date', birthDate)
        .limit(1);
        
      if (existingError) throw existingError;
      
      let litterId;
      
      if (existingLitters && existingLitters.length > 0) {
        // Use existing litter
        litterId = existingLitters[0].id;
      } else {
        // Create a new litter
        const { data: litter, error: litterError } = await supabase
          .from('litters')
          .insert({
            dam_id: damId,
            birth_date: birthDate,
            status: 'active',
            litter_name: `${selectedDog?.name || 'Unknown'}'s Litter - ${format(new Date(birthDate), 'MMM d, yyyy')}`
          })
          .select()
          .single();
          
        if (litterError) throw litterError;
        litterId = litter.id;
      }
      
      // Create a new whelping record
      const { data: whelping, error: welpingError } = await supabase
        .from('welping_records')
        .insert({
          litter_id: litterId,
          birth_date: birthDate,
          start_time: format(new Date(), 'HH:mm'),
          status: 'in-progress',
          total_puppies: 0,
          males: 0,
          females: 0
        })
        .select()
        .single();
        
      if (welpingError) throw welpingError;
      
      return { whelping, litterId };
    },
    onSuccess: (data) => {
      setIsStartLabor(false);
      setSelectedDog(null);
      
      toast({
        title: 'Whelping Started',
        description: 'Whelping session started successfully.',
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['litters'] });
      queryClient.invalidateQueries({ queryKey: ['pregnant-dogs'] });
      
      // Navigate to the whelping page
      navigate(`/reproduction/welping/${data.whelping.id}`);
    },
    onError: (error) => {
      console.error('Error starting whelping:', error);
      toast({
        title: 'Error',
        description: 'Failed to start whelping session. Please try again.',
        variant: 'destructive',
      });
    }
  });
  
  const handleStartLabor = (dog: any) => {
    setSelectedDog(dog);
    setIsStartLabor(true);
  };
  
  const confirmStartLabor = () => {
    if (!selectedDog) return;
    
    const today = format(new Date(), 'yyyy-MM-dd');
    
    startLaborMutation.mutate({
      dogId: selectedDog.id,
      damId: selectedDog.id,
      birthDate: today
    });
  };
  
  const isLoading = parentLoading || isDogsLoading;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Loading pregnant dogs...</p>
        </div>
      </div>
    );
  }
  
  if (pregnantDogs.length === 0) {
    return (
      <EmptyState
        title="No Pregnant Dogs"
        description="There are no pregnant dogs in your records. Mark a dog as pregnant in their profile or record a breeding."
        icon={<Dog className="h-10 w-10 text-muted-foreground" />}
        action={{
          label: "Record Breeding",
          onClick: () => navigate('/reproduction/breeding'),
        }}
      />
    );
  }
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pregnantDogs.map((dog) => {
          // Calculate estimated due date (63 days from tie date if available)
          let dueDate = null;
          if (dog.tie_date) {
            dueDate = addDays(new Date(dog.tie_date), 63);
          }
          
          return (
            <Card key={dog.id} className="overflow-hidden">
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                {dog.photo_url ? (
                  <img 
                    src={dog.photo_url} 
                    alt={dog.name} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Dog className="h-16 w-16 text-gray-400" />
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{dog.name}</CardTitle>
                <CardDescription>
                  {dog.breed}, {dog.color || 'Unknown color'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <span className="text-sm font-medium flex items-center">
                      <Baby className="h-3 w-3 mr-1 text-pink-500" />
                      Pregnant
                    </span>
                  </div>
                  
                  {dog.tie_date && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Bred Date:</span>
                      <span className="text-sm font-medium">
                        {format(new Date(dog.tie_date), 'MMM d, yyyy')}
                      </span>
                    </div>
                  )}
                  
                  {dueDate && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Est. Due Date:</span>
                      <span className="text-sm font-medium">
                        {format(dueDate, 'MMM d, yyyy')}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/dogs/${dog.id}`)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/reproductive-management/${dog.id}`)}
                >
                  <Info className="h-4 w-4 mr-2" />
                  Manage
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleStartLabor(dog)}
                  className="ml-auto"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Start Whelping
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      {/* Start Labor Dialog */}
      <Dialog open={isStartLabor} onOpenChange={setIsStartLabor}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Whelping Session</DialogTitle>
            <DialogDescription>
              {selectedDog && (
                <>
                  You are about to start a whelping session for {selectedDog.name}.
                  This will create a new litter and begin tracking the birth process.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Birth Date</Label>
              <Input 
                type="date" 
                defaultValue={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input 
                type="time" 
                defaultValue={format(new Date(), 'HH:mm')}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsStartLabor(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmStartLabor}
              disabled={startLaborMutation.isPending}
            >
              {startLaborMutation.isPending ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start Whelping
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PregnantDogsTab;
