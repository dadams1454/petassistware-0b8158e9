
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PuppyCareLogProps } from '@/types/puppy';
import { RefreshCw, Plus } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PuppyCareLog: React.FC<PuppyCareLogProps> = ({
  puppyId,
  puppyName,
  puppyGender,
  puppyColor,
  puppyAge,
  onSuccess,
  onRefresh
}) => {
  const { toast } = useToast();
  const [activityType, setActivityType] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  const { data: activities, isLoading, refetch } = useQuery({
    queryKey: ['puppyActivities', puppyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('care_activities')
        .select('*')
        .eq('dog_id', puppyId)
        .order('timestamp', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      return data;
    }
  });
  
  const addActivityMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('care_activities')
        .insert({
          dog_id: puppyId,
          activity_type: activityType,
          notes: notes,
          timestamp: new Date().toISOString()
        });
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Activity logged',
        description: `${activityType} activity has been recorded for ${puppyName}`
      });
      
      setActivityType('');
      setNotes('');
      refetch();
      
      if (onSuccess) {
        onSuccess();
      }
    }
  });
  
  const handleAddActivity = () => {
    if (!activityType) {
      toast({
        title: 'Error',
        description: 'Please select an activity type',
        variant: 'destructive'
      });
      return;
    }
    
    addActivityMutation.mutate();
  };
  
  const handleRefresh = () => {
    refetch();
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Care Activities</CardTitle>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium">{puppyName}</p>
            <p className="text-xs text-muted-foreground">
              {puppyGender} • {puppyColor} • {puppyAge} days old
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="activity-type">Activity Type</Label>
            <Select value={activityType} onValueChange={setActivityType}>
              <SelectTrigger>
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="feeding">Feeding</SelectItem>
                <SelectItem value="medication">Medication</SelectItem>
                <SelectItem value="weight">Weight Check</SelectItem>
                <SelectItem value="temperature">Temperature Check</SelectItem>
                <SelectItem value="elimination">Elimination</SelectItem>
                <SelectItem value="grooming">Grooming</SelectItem>
                <SelectItem value="exercise">Exercise</SelectItem>
                <SelectItem value="socialization">Socialization</SelectItem>
                <SelectItem value="health_check">Health Check</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Enter notes about this activity"
              rows={3}
            />
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleAddActivity}
            disabled={addActivityMutation.isPending}
          >
            <Plus className="h-4 w-4 mr-2" />
            {addActivityMutation.isPending ? 'Adding...' : 'Add Activity'}
          </Button>
        </div>
        
        <div className="border rounded-md divide-y">
          {isLoading ? (
            <p className="p-4 text-center text-sm text-muted-foreground">Loading activities...</p>
          ) : activities && activities.length > 0 ? (
            activities.map((activity: any) => (
              <div key={activity.id} className="p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium capitalize">{activity.activity_type.replace('_', ' ')}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                {activity.notes && (
                  <p className="mt-1 text-sm">{activity.notes}</p>
                )}
              </div>
            ))
          ) : (
            <p className="p-4 text-center text-sm text-muted-foreground">No activities recorded yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PuppyCareLog;
