import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Building2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { FacilityArea } from '@/types/facility';

interface FacilityTaskDialogProps {
  taskId: string | null;
  areas: FacilityArea[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

const FacilityTaskDialog: React.FC<FacilityTaskDialogProps> = ({
  taskId,
  areas,
  onSuccess,
  onCancel,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [areaId, setAreaId] = useState<string | null>(null);
  
  // Load existing task data if editing
  useEffect(() => {
    const fetchTaskData = async () => {
      if (!taskId) return;
      
      try {
        const { data, error } = await supabase
          .from('facility_tasks')
          .select('*')
          .eq('id', taskId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setName(data.name);
          setDescription(data.description || '');
          setFrequency(data.frequency);
          setAreaId(data.area_id);
        }
      } catch (err) {
        console.error('Error loading task data:', err);
        toast({
          title: 'Error',
          description: 'Failed to load task data',
          variant: 'destructive'
        });
      }
    };
    
    fetchTaskData();
  }, [taskId, toast]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      setError('Task name is required');
      return;
    }
    
    if (!user?.id) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to save tasks',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const taskData = {
        name,
        description: description || null,
        frequency,
        area_id: areaId === 'none' ? null : areaId,
        // These fields are now in the database but we're not setting them yet
        // assigned_to: null,
        // last_generated: null,
        // next_due: null
      };
      
      let result;
      
      if (taskId) {
        // Update existing task
        result = await supabase
          .from('facility_tasks')
          .update(taskData)
          .eq('id', taskId);
      } else {
        // Create new task
        result = await supabase
          .from('facility_tasks')
          .insert(taskData);
      }
      
      if (result.error) {
        throw result.error;
      }
      
      toast({
        title: taskId ? 'Task Updated' : 'Task Created',
        description: `"${name}" has been ${taskId ? 'updated' : 'added'} successfully.`
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error saving task:', err);
      setError('Failed to save task. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to save task',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="taskName">Task Name</Label>
        <Input
          id="taskName"
          placeholder="Enter task name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="taskDescription">Description (Optional)</Label>
        <Textarea
          id="taskDescription"
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="taskFrequency">Frequency</Label>
        <Select
          value={frequency}
          onValueChange={setFrequency}
        >
          <SelectTrigger id="taskFrequency">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="taskArea">Area (Optional)</Label>
        <Select
          value={areaId || undefined}
          onValueChange={setAreaId}
        >
          <SelectTrigger id="taskArea">
            <SelectValue placeholder="Select area" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No specific area</SelectItem>
            {areas.map((area) => (
              <SelectItem key={area.id} value={area.id}>
                {area.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        
        <Button 
          type="submit" 
          disabled={isSubmitting || !name}
          className="gap-1"
        >
          <Building2 className="h-4 w-4" />
          {isSubmitting ? 'Saving...' : taskId ? 'Update Task' : 'Save Task'}
        </Button>
      </div>
    </form>
  );
};

export default FacilityTaskDialog;
