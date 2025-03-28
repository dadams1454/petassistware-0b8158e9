
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { FacilityTask } from '@/types/facility';

export const useFacilityData = () => {
  const { toast } = useToast();
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState('all');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'tasks' | 'checklist'>('tasks');
  
  // Fetch facility areas
  const { data: areas, isLoading: isLoadingAreas } = useQuery({
    queryKey: ['facilityAreas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('facility_areas')
        .select('*')
        .order('name');
        
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to load facility areas',
          variant: 'destructive'
        });
        throw error;
      }
      
      return data || [];
    }
  });
  
  // Fetch facility tasks with area details
  const { data: tasks, isLoading: isLoadingTasks, refetch: refetchTasks } = useQuery({
    queryKey: ['facilityTasks', selectedFrequency],
    queryFn: async () => {
      let query = supabase
        .from('facility_tasks')
        .select(`
          *,
          facility_areas(*)
        `)
        .eq('active', true)
        .order('name');
      
      if (selectedFrequency !== 'all') {
        query = query.eq('frequency', selectedFrequency);
      }
        
      const { data, error } = await query;
        
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to load facility tasks',
          variant: 'destructive'
        });
        throw error;
      }
      
      return data as FacilityTask[];
    }
  });
  
  // Filter tasks based on search query
  const filteredTasks = tasks?.filter(task => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    const taskName = task.name.toLowerCase();
    const taskDesc = task.description?.toLowerCase() || '';
    const areaName = task.facility_areas?.name.toLowerCase() || '';
    
    return (
      taskName.includes(searchLower) ||
      taskDesc.includes(searchLower) ||
      areaName.includes(searchLower)
    );
  });
  
  // Handler functions
  const handleAddTask = () => {
    setSelectedTaskId(null);
    setIsTaskDialogOpen(true);
  };
  
  const handleEditTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsTaskDialogOpen(true);
  };
  
  const handleTaskSaved = () => {
    refetchTasks();
    setIsTaskDialogOpen(false);
  };
  
  const isLoading = isLoadingAreas || isLoadingTasks;

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
