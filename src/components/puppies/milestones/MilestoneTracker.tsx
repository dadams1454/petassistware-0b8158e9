
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { differenceInDays, differenceInWeeks, format } from 'date-fns';
import { Check, Clock, Plus, Trash2 } from 'lucide-react';

interface MilestoneTrackerProps {
  puppyId: string;
  birthDate?: string;
  onMilestoneAdded?: () => void;
}

interface Milestone {
  id: string;
  puppy_id: string;
  title: string;
  milestone_type: string;
  expected_age_days: number;
  description?: string;
  is_completed: boolean;
  completion_date?: string;
  created_at: string;
}

const MILESTONE_TYPES = [
  { label: 'Eyes Open', value: 'eyes_open', expected_days: 10 },
  { label: 'Ears Open', value: 'ears_open', expected_days: 14 },
  { label: 'First Walk', value: 'first_walk', expected_days: 21 },
  { label: 'First Food', value: 'first_food', expected_days: 28 },
  { label: 'Weaning Start', value: 'weaning_start', expected_days: 28 },
  { label: 'Weaning Complete', value: 'weaning_complete', expected_days: 42 },
  { label: 'First Bath', value: 'first_bath', expected_days: 35 },
  { label: 'First Vaccination', value: 'first_vaccine', expected_days: 42 },
  { label: 'Socialization', value: 'socialization', expected_days: 49 },
  { label: 'Health Check', value: 'health_check', expected_days: 7 },
  { label: 'Deworming', value: 'deworming', expected_days: 14 },
  { label: 'Custom', value: 'custom', expected_days: 0 },
];

const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({ puppyId, birthDate, onMilestoneAdded }) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // New milestone form state
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    milestone_type: '',
    expected_age_days: 0,
    description: '',
    is_completed: false,
    completion_date: '',
  });

  useEffect(() => {
    if (puppyId) {
      fetchMilestones();
    }
  }, [puppyId]);

  const fetchMilestones = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('puppy_developmental_milestones')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('expected_age_days', { ascending: true });

      if (error) throw error;
      setMilestones(data || []);
    } catch (error) {
      console.error('Error fetching milestones:', error);
      toast({
        title: 'Error',
        description: 'Failed to load milestones',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMilestoneTypeChange = (type: string) => {
    const selectedType = MILESTONE_TYPES.find(t => t.value === type);
    
    setNewMilestone({
      ...newMilestone,
      milestone_type: type,
      title: type === 'custom' ? '' : selectedType?.label || '',
      expected_age_days: selectedType?.expected_days || 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form
      if (!newMilestone.title) {
        throw new Error('Title is required');
      }
      
      const milestone = {
        puppy_id: puppyId,
        title: newMilestone.title,
        milestone_type: newMilestone.milestone_type,
        expected_age_days: newMilestone.expected_age_days,
        description: newMilestone.description || null,
        is_completed: newMilestone.is_completed,
        completion_date: newMilestone.is_completed ? (newMilestone.completion_date || new Date().toISOString().split('T')[0]) : null,
      };
      
      const { data, error } = await supabase
        .from('puppy_developmental_milestones')
        .insert(milestone)
        .select();
        
      if (error) throw error;
      
      toast({
        title: 'Milestone added',
        description: 'Milestone has been successfully added',
      });
      
      // Reset form
      setNewMilestone({
        title: '',
        milestone_type: '',
        expected_age_days: 0,
        description: '',
        is_completed: false,
        completion_date: '',
      });
      
      // Close form
      setIsAddingMilestone(false);
      
      // Refresh milestones
      fetchMilestones();
      
      // Call onMilestoneAdded callback if provided
      if (onMilestoneAdded) {
        onMilestoneAdded();
      }
      
    } catch (error: any) {
      console.error('Error adding milestone:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add milestone',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMilestoneCompletion = async (milestone: Milestone) => {
    try {
      const updatedMilestone = {
        ...milestone,
        is_completed: !milestone.is_completed,
        completion_date: !milestone.is_completed ? new Date().toISOString().split('T')[0] : null,
      };
      
      const { error } = await supabase
        .from('puppy_developmental_milestones')
        .update(updatedMilestone)
        .eq('id', milestone.id);
        
      if (error) throw error;
      
      // Update local state to reflect change
      setMilestones(milestones.map(m => 
        m.id === milestone.id ? updatedMilestone : m
      ));
      
      toast({
        title: updatedMilestone.is_completed ? 'Milestone completed' : 'Milestone uncompleted',
        description: `"${milestone.title}" has been ${updatedMilestone.is_completed ? 'marked as completed' : 'unmarked'}`,
      });
      
    } catch (error) {
      console.error('Error updating milestone:', error);
      toast({
        title: 'Error',
        description: 'Failed to update milestone',
        variant: 'destructive',
      });
    }
  };

  const deleteMilestone = async (id: string) => {
    try {
      const { error } = await supabase
        .from('puppy_developmental_milestones')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setMilestones(milestones.filter(m => m.id !== id));
      
      toast({
        title: 'Milestone deleted',
        description: 'Milestone has been successfully deleted',
      });
      
    } catch (error) {
      console.error('Error deleting milestone:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete milestone',
        variant: 'destructive',
      });
    }
  };

  const getAgeDescription = (days: number) => {
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    
    if (weeks === 0) {
      return `${days} ${days === 1 ? 'day' : 'days'}`;
    } else if (remainingDays === 0) {
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
    } else {
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}, ${remainingDays} ${remainingDays === 1 ? 'day' : 'days'}`;
    }
  };

  const calculateCurrentAge = () => {
    if (!birthDate) return null;
    
    const birthDateTime = new Date(birthDate);
    const today = new Date();
    
    const ageInDays = differenceInDays(today, birthDateTime);
    return ageInDays;
  };

  const getMilestoneStatus = (milestone: Milestone) => {
    if (milestone.is_completed) {
      return { status: 'completed', label: 'Completed', icon: <Check className="h-4 w-4" /> };
    }
    
    const currentAge = calculateCurrentAge();
    if (currentAge === null) return { status: 'pending', label: 'Pending', icon: <Clock className="h-4 w-4" /> };
    
    if (currentAge >= milestone.expected_age_days) {
      return { status: 'overdue', label: 'Overdue', icon: <Clock className="h-4 w-4 text-red-500" /> };
    } else {
      return { status: 'upcoming', label: 'Upcoming', icon: <Clock className="h-4 w-4 text-blue-500" /> };
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Developmental Milestones</CardTitle>
        {!isAddingMilestone && (
          <Button onClick={() => setIsAddingMilestone(true)} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Milestone
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isAddingMilestone && (
          <Card className="mb-6 border-dashed border-blue-200">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="milestone-type">Milestone Type</Label>
                  <Select
                    value={newMilestone.milestone_type}
                    onValueChange={handleMilestoneTypeChange}
                    required
                  >
                    <SelectTrigger id="milestone-type">
                      <SelectValue placeholder="Select milestone type" />
                    </SelectTrigger>
                    <SelectContent>
                      {MILESTONE_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label} {type.expected_days > 0 && `(~${getAgeDescription(type.expected_days)})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="milestone-title">Title</Label>
                  <Input
                    id="milestone-title"
                    value={newMilestone.title}
                    onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                    placeholder="Milestone title"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expected-age">Expected Age (days)</Label>
                    <Input
                      id="expected-age"
                      type="number"
                      min="0"
                      value={newMilestone.expected_age_days}
                      onChange={(e) => setNewMilestone({ ...newMilestone, expected_age_days: parseInt(e.target.value) })}
                      placeholder="Expected age in days"
                      required
                    />
                    {newMilestone.expected_age_days > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {getAgeDescription(newMilestone.expected_age_days)}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center mt-8 space-x-2">
                      <Checkbox
                        id="is-completed"
                        checked={newMilestone.is_completed}
                        onCheckedChange={(checked) => 
                          setNewMilestone({ 
                            ...newMilestone, 
                            is_completed: checked as boolean,
                            completion_date: checked ? new Date().toISOString().split('T')[0] : ''
                          })
                        }
                      />
                      <Label htmlFor="is-completed" className="cursor-pointer">Already Completed</Label>
                    </div>
                  </div>
                </div>
                
                {newMilestone.is_completed && (
                  <div className="space-y-2">
                    <Label htmlFor="completion-date">Completion Date</Label>
                    <Input
                      id="completion-date"
                      type="date"
                      value={newMilestone.completion_date}
                      onChange={(e) => setNewMilestone({ ...newMilestone, completion_date: e.target.value })}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="milestone-description">Description (Optional)</Label>
                  <Input
                    id="milestone-description"
                    value={newMilestone.description}
                    onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                    placeholder="Additional details"
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddingMilestone(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Milestone'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : milestones.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No milestones recorded yet
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {milestones.map(milestone => {
                const status = getMilestoneStatus(milestone);
                return (
                <div 
                  key={milestone.id} 
                  className={`border rounded-lg p-4 ${
                    milestone.is_completed 
                      ? 'bg-green-50 border-green-200' 
                      : status.status === 'overdue'
                        ? 'bg-red-50 border-red-200'
                        : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{milestone.title}</h3>
                      <div className="text-sm text-muted-foreground">
                        Expected: {getAgeDescription(milestone.expected_age_days)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className={milestone.is_completed ? "text-green-600" : "text-gray-400"}
                        onClick={() => toggleMilestoneCompletion(milestone)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-destructive"
                        onClick={() => deleteMilestone(milestone.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <div className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      milestone.is_completed 
                        ? 'bg-green-100 text-green-800' 
                        : status.status === 'overdue'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}>
                      {status.icon} {status.label}
                    </div>
                    
                    {milestone.is_completed && milestone.completion_date && (
                      <div className="text-xs ml-2 text-muted-foreground">
                        Completed on {format(new Date(milestone.completion_date), 'MMM d, yyyy')}
                      </div>
                    )}
                  </div>
                  {milestone.description && (
                    <div className="mt-2 text-sm">{milestone.description}</div>
                  )}
                </div>
              )})}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MilestoneTracker;
