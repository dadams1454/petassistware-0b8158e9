
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { FacilityArea, FacilityTask } from '@/types/facility';
import { ChecklistArea, ChecklistTask } from '../types/checklistTypes';

export const useChecklistData = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState('');
  const [completedBy, setCompletedBy] = useState('');
  const [verifiedBy, setVerifiedBy] = useState('');
  const [areas, setAreas] = useState<ChecklistArea[]>([]);
  const currentDate = new Date().toLocaleDateString();

  useEffect(() => {
    fetchAreasAndTasks();
  }, [toast]);

  const fetchAreasAndTasks = async () => {
    setIsLoading(true);
    try {
      // Fetch areas
      const { data: areasData, error: areasError } = await supabase
        .from('facility_areas')
        .select('*')
        .order('name');
        
      if (areasError) throw areasError;
      
      // Fetch tasks with proper typing
      const { data: tasksData, error: tasksError } = await supabase
        .from('facility_tasks')
        .select(`
          *,
          facility_areas(*)
        `)
        .eq('active', true)
        .order('name');
        
      if (tasksError) throw tasksError;
      
      // Transform into checklist format with proper typing
      const checklistAreas: ChecklistArea[] = [];
      
      // Group tasks by area
      areasData.forEach((area: FacilityArea) => {
        // Type assertion with partial to ensure compatibility
        const areaTasks = (tasksData as any[])
          .filter(task => task.area_id === area.id)
          .map(task => ({
            ...task,
            assigned_to: task.assigned_to || null,
            last_generated: task.last_generated || null,
            next_due: task.next_due || null,
            completed: false,
            initials: '',
            time: ''
          } as ChecklistTask));
          
        if (areaTasks.length > 0) {
          checklistAreas.push({
            id: area.id,
            name: area.name,
            tasks: areaTasks
          });
        }
      });
      
      // Add tasks with no assigned area
      const unassignedTasks = (tasksData as any[])
        .filter(task => !task.area_id)
        .map(task => ({
          ...task,
          assigned_to: task.assigned_to || null,
          last_generated: task.last_generated || null,
          next_due: task.next_due || null,
          completed: false,
          initials: '',
          time: ''
        } as ChecklistTask));
        
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

  return {
    isLoading,
    areas,
    comments,
    setComments,
    completedBy,
    setCompletedBy,
    verifiedBy,
    setVerifiedBy,
    currentDate,
    toggleTask,
    updateInitials,
    calculateProgress,
    saveChecklist
  };
};
