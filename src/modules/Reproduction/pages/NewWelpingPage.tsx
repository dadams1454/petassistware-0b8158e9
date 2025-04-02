
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WelpingFormData {
  damId: string;
  birthDate: Date;
  startTime: string;
  endTime?: string;
  males: number;
  females: number;
  notes?: string;
  attendedBy?: string;
  complications: boolean;
  complicationNotes?: string;
}

const NewWelpingPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [endTimeEnabled, setEndTimeEnabled] = useState(false);
  const [hasComplications, setHasComplications] = useState(false);
  
  const form = useForm<WelpingFormData>({
    defaultValues: {
      damId: '',
      birthDate: new Date(),
      startTime: format(new Date(), 'HH:mm'),
      males: 0,
      females: 0,
      complications: false,
    }
  });
  
  // Fetch female dogs
  const { data: femaleDogs = [], isLoading: isLoadingDogs } = useQuery({
    queryKey: ['female-dogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('gender', 'Female')
        .order('name');
        
      if (error) throw error;
      return data;
    }
  });
  
  // Create whelping record mutation
  const createWelping = useMutation({
    mutationFn: async (data: WelpingFormData) => {
      const { damId, birthDate, startTime, endTime, males, females, notes, attendedBy, complications, complicationNotes } = data;
      
      // First create or get a litter
      const { data: litterData, error: litterError } = await supabase
        .from('litters')
        .insert({
          dam_id: damId,
          birth_date: format(birthDate, 'yyyy-MM-dd'),
          status: 'active',
          litter_name: `${femaleDogs.find(d => d.id === damId)?.name || 'Unknown'}'s Litter - ${format(birthDate, 'MMM d, yyyy')}`,
          male_count: males,
          female_count: females
        })
        .select()
        .single();
      
      if (litterError) throw litterError;
      
      // Then create the whelping record
      const { data: welpingData, error: welpingError } = await supabase
        .from('welping_records')
        .insert({
          litter_id: litterData.id,
          birth_date: format(birthDate, 'yyyy-MM-dd'),
          start_time: startTime,
          end_time: endTimeEnabled ? endTime : null,
          males: males,
          females: females,
          total_puppies: males + females,
          notes: notes,
          attended_by: attendedBy,
          complications: complications,
          complication_notes: complications ? complicationNotes : null,
          status: endTimeEnabled ? 'completed' : 'in-progress'
        })
        .select()
        .single();
      
      if (welpingError) throw welpingError;
      
      // Update the dam's is_pregnant status
      await supabase
        .from('dogs')
        .update({ is_pregnant: false })
        .eq('id', damId);
      
      return { litter: litterData, welping: welpingData };
    },
    onSuccess: (data) => {
      toast({
        title: 'Whelping Record Created',
        description: 'The whelping record has been successfully created.',
      });
      
      queryClient.invalidateQueries({ queryKey: ['litters'] });
      queryClient.invalidateQueries({ queryKey: ['dogs'] });
      
      // Navigate to the whelping page
      navigate(`/reproduction/welping/${data.welping.id}`);
    },
    onError: (error) => {
      console.error('Error creating whelping record:', error);
      toast({
        title: 'Error',
        description: 'Failed to create whelping record. Please try again.',
        variant: 'destructive',
      });
    }
  });
  
  const onSubmit = (data: WelpingFormData) => {
    createWelping.mutate(data);
  };
  
  const totalPuppies = form.watch('males') + form.watch('females');
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">New Whelping Record</h1>
          <p className="text-muted-foreground">
            Record a new whelping event for a dam
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/reproduction/welping')}>
          Cancel
        </Button>
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dam & Birth Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="damId">Dam (Mother)</Label>
                <Select 
                  onValueChange={(value) => form.setValue('damId', value)} 
                  defaultValue={form.watch('damId')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a female dog" />
                  </SelectTrigger>
                  <SelectContent>
                    {femaleDogs.map((dog) => (
                      <SelectItem key={dog.id} value={dog.id}>
                        {dog.name} ({dog.breed || 'Unknown breed'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Birth Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !form.watch('birthDate') && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.watch('birthDate') ? (
                        format(form.watch('birthDate'), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={form.watch('birthDate')}
                      onSelect={(date) => date && form.setValue('birthDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input 
                  type="time" 
                  id="startTime" 
                  {...form.register('startTime')} 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="endTime" className={!endTimeEnabled ? 'text-muted-foreground' : ''}>
                    End Time (if completed)
                  </Label>
                  <label className="flex items-center space-x-2 text-sm">
                    <input 
                      type="checkbox" 
                      checked={endTimeEnabled} 
                      onChange={() => setEndTimeEnabled(!endTimeEnabled)} 
                      className="h-4 w-4"
                    />
                    <span>Whelping Completed</span>
                  </label>
                </div>
                <Input 
                  type="time" 
                  id="endTime" 
                  disabled={!endTimeEnabled}
                  {...form.register('endTime')} 
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Puppies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="males">Male Puppies</Label>
                <Input 
                  type="number" 
                  id="males" 
                  min="0"
                  {...form.register('males', { 
                    valueAsNumber: true,
                    onChange: (e) => form.setValue('males', parseInt(e.target.value) || 0)
                  })} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="females">Female Puppies</Label>
                <Input 
                  type="number" 
                  id="females" 
                  min="0"
                  {...form.register('females', { 
                    valueAsNumber: true,
                    onChange: (e) => form.setValue('females', parseInt(e.target.value) || 0)
                  })} 
                />
              </div>
              
              <div className="space-y-2">
                <Label>Total Puppies</Label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center">
                  {totalPuppies}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="attendedBy">Attended By</Label>
              <Input 
                id="attendedBy" 
                placeholder="Who attended the whelping" 
                {...form.register('attendedBy')} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="complications" 
                  checked={hasComplications} 
                  onChange={() => {
                    setHasComplications(!hasComplications);
                    form.setValue('complications', !hasComplications);
                  }} 
                  className="h-4 w-4"
                />
                <Label htmlFor="complications">Were there any complications?</Label>
              </div>
              
              {hasComplications && (
                <Textarea 
                  id="complicationNotes" 
                  placeholder="Describe any complications during whelping" 
                  {...form.register('complicationNotes')} 
                />
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                placeholder="Enter any additional notes about the whelping session" 
                {...form.register('notes')} 
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-4">
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => navigate('/reproduction/welping')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={createWelping.isPending || !form.watch('damId') || totalPuppies === 0}
          >
            {createWelping.isPending ? 'Creating...' : 'Create Whelping Record'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewWelpingPage;
