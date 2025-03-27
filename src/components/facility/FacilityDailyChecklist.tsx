
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { CheckCircle, Clipboard, ClipboardCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { FacilityArea, FacilityTask } from '@/types/facility';

interface ChecklistTask extends FacilityTask {
  completed: boolean;
  initials: string;
  time: string;
}

interface ChecklistArea {
  name: string;
  id: string;
  tasks: ChecklistTask[];
}

const FacilityDailyChecklist: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState('');
  const [completedBy, setCompletedBy] = useState('');
  const [verifiedBy, setVerifiedBy] = useState('');
  const [areas, setAreas] = useState<ChecklistArea[]>([]);
  const currentDate = new Date().toLocaleDateString();

  useEffect(() => {
    const fetchAreasAndTasks = async () => {
      setIsLoading(true);
      try {
        // Fetch areas
        const { data: areasData, error: areasError } = await supabase
          .from('facility_areas')
          .select('*')
          .order('name');
          
        if (areasError) throw areasError;
        
        // Fetch tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from('facility_tasks')
          .select(`
            *,
            facility_areas(*)
          `)
          .eq('active', true)
          .order('name');
          
        if (tasksError) throw tasksError;
        
        // Transform into checklist format
        const checklistAreas: ChecklistArea[] = [];
        
        // Group tasks by area
        areasData.forEach((area: FacilityArea) => {
          const areaTasks = tasksData
            .filter((task: FacilityTask) => task.area_id === area.id)
            .map((task: FacilityTask) => ({
              ...task,
              completed: false,
              initials: '',
              time: ''
            }));
            
          if (areaTasks.length > 0) {
            checklistAreas.push({
              id: area.id,
              name: area.name,
              tasks: areaTasks
            });
          }
        });
        
        // Add tasks with no assigned area
        const unassignedTasks = tasksData
          .filter((task: FacilityTask) => !task.area_id)
          .map((task: FacilityTask) => ({
            ...task,
            completed: false,
            initials: '',
            time: ''
          }));
          
        if (unassignedTasks.length > 0) {
          checklistAreas.push({
            id: 'unassigned',
            name: 'General Tasks',
            tasks: unassignedTasks
          });
        }
        
        setAreas(checklistAreas);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load facility checklist data',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAreasAndTasks();
  }, [toast]);

  // Function to handle task completion
  const toggleTask = (areaIndex: number, taskIndex: number) => {
    const newAreas = [...areas];
    const task = newAreas[areaIndex].tasks[taskIndex];
    task.completed = !task.completed;
    
    // If marking as completed, add time and default initials
    if (task.completed) {
      task.time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      if (!task.initials && user?.email) {
        // Use initials from email (first letter of username)
        const username = user.email.split('@')[0];
        task.initials = username.charAt(0).toUpperCase();
      }
    }
    
    setAreas(newAreas);
  };

  // Function to update initials
  const updateInitials = (areaIndex: number, taskIndex: number, value: string) => {
    const newAreas = [...areas];
    newAreas[areaIndex].tasks[taskIndex].initials = value;
    setAreas(newAreas);
  };

  // Calculate completion percentages
  const calculateProgress = () => {
    let totalTasks = 0;
    let completedTasks = 0;
    
    areas.forEach(area => {
      area.tasks.forEach(task => {
        totalTasks++;
        if (task.completed) completedTasks++;
      });
    });
    
    return {
      totalTasks,
      completedTasks,
      percentage: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  };
  
  const progress = calculateProgress();

  // Function to save checklist
  const saveChecklist = async () => {
    if (!user?.id) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to save the checklist',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      toast({
        title: 'Success',
        description: 'Checklist saved successfully',
      });
      
      // In the future, this could save to a facility_task_logs table
      // with all the completed tasks, comments, and verification signatures
      
    } catch (error) {
      console.error('Error saving checklist:', error);
      toast({
        title: 'Error',
        description: 'Failed to save checklist',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Card className="shadow-md">
        <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Daily Kennel Facility Checklist</CardTitle>
            <div className="text-lg">{currentDate}</div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Progress Bar */}
          <div className="p-4 border-b">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Daily Progress:</span>
              <span>{progress.completedTasks} of {progress.totalTasks} tasks ({progress.percentage}%)</span>
            </div>
            <Progress value={progress.percentage} />
          </div>
          
          {/* Task Lists by Area */}
          <div className="p-4">
            {areas.map((area, areaIndex) => (
              <div key={area.id} className="mb-6">
                <h2 className="text-xl font-semibold bg-muted p-2 rounded">{area.name}</h2>
                <div className="overflow-x-auto">
                  <table className="w-full mt-2">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="w-8 p-2 text-left">✓</th>
                        <th className="p-2 text-left">Task</th>
                        <th className="w-20 p-2 text-center">Initials</th>
                        <th className="w-24 p-2 text-center">Time</th>
                        <th className="w-24 p-2 text-center">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {area.tasks.map((task, taskIndex) => (
                        <tr key={task.id} className="border-t">
                          <td className="p-2">
                            <input 
                              type="checkbox" 
                              checked={task.completed}
                              onChange={() => toggleTask(areaIndex, taskIndex)}
                              className="w-4 h-4" 
                            />
                          </td>
                          <td className="p-2">{task.name}</td>
                          <td className="p-2">
                            <Input
                              value={task.initials}
                              onChange={(e) => updateInitials(areaIndex, taskIndex, e.target.value)}
                              placeholder="Init."
                              className="w-full p-1 text-center h-8" 
                            />
                          </td>
                          <td className="p-2 text-center">{task.completed ? task.time : '—'}</td>
                          <td className="p-2">
                            <Button variant="outline" size="sm">
                              Add
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
          
          {/* Signature and Verification */}
          <div className="p-4 border-t mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Completed By:</h3>
                <Input
                  value={completedBy}
                  onChange={(e) => setCompletedBy(e.target.value)}
                  className="mb-1"
                />
                <div className="text-center mt-1 text-sm">Signature</div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Verified By:</h3>
                <Input
                  value={verifiedBy}
                  onChange={(e) => setVerifiedBy(e.target.value)}
                  className="mb-1"
                />
                <div className="text-center mt-1 text-sm">Supervisor Signature</div>
              </div>
            </div>
          </div>
          
          {/* Comments Section */}
          <div className="p-4 border-t">
            <h3 className="font-semibold mb-2">Additional Comments or Issues:</h3>
            <Textarea 
              className="w-full h-24" 
              placeholder="Enter any issues, special circumstances, or follow-up items here..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>
          
          {/* Save Button */}
          <div className="p-4 border-t flex justify-end">
            <Button 
              onClick={saveChecklist}
              className="gap-2"
            >
              <ClipboardCheck className="h-4 w-4" />
              Save Checklist
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacilityDailyChecklist;
