
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FacilityArea, FacilityTask } from '@/types/facility';

export const useFacilityData = () => {
  const { toast } = useToast();
  const [areas, setAreas] = useState<FacilityArea[] | null>(null);
  const [tasks, setTasks] = useState<FacilityTask[] | null>(null);
  const [filteredTasks, setFilteredTasks] = useState<FacilityTask[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'checklist'>('checklist');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState('all');

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
      
      setAreas(areasData);
      setTasks(tasksData);
      setFilteredTasks(tasksData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load facility data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddTask = () => {
    setSelectedTaskId(null);
    setIsTaskDialogOpen(true);
  };
  
  const handleEditTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsTaskDialogOpen(true);
  };
  
  const handleTaskSaved = () => {
    fetchAreasAndTasks();
    setIsTaskDialogOpen(false);
  };
  
  // Refetch tasks
  const refetchTasks = () => {
    fetchAreasAndTasks();
  };
  
  return {
    areas,
    tasks,
    filteredTasks,
    isLoading,
    isTaskDialogOpen,
    setIsTaskDialogOpen,
    searchQuery,
    setSearchQuery,
    selectedFrequency,
    setSelectedFrequency,
    selectedTaskId,
    currentView,
    setCurrentView,
    handleAddTask,
    handleEditTask,
    handleTaskSaved,
    refetchTasks
  };
};
