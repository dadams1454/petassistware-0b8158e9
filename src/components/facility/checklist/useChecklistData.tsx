import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { FacilityArea, FacilityTask, FacilityStaff } from '@/types/facility';
import { ChecklistArea, ChecklistTask } from '../types/checklistTypes';

export const useChecklistData = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState('');
  const [completedBy, setCompletedBy] = useState('');
  const [verifiedBy, setVerifiedBy] = useState('');
  const [areas, setAreas] = useState<ChecklistArea[]>([]);
  const [staffMembers, setStaffMembers] = useState<FacilityStaff[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editingAreaId, setEditingAreaId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newAreaName, setNewAreaName] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const currentDate = new Date().toLocaleDateString();

  useEffect(() => {
    fetchAreasAndTasks();
    fetchStaffMembers();
  }, [toast]);

  const fetchStaffMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('facility_staff')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      setStaffMembers(data);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast({
        title: 'Error',
        description: 'Failed to load staff members',
        variant: 'destructive'
      });
    }
  };

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
            completed: false,
            staffId: null,
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
          completed: false,
          staffId: null,
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

  // Transform task data for checklist format
  const transformTaskToChecklistTask = (task: FacilityTask): ChecklistTask => {
    return {
      ...task,
      completed: false,
      staffId: null,
      initials: '',
      time: '',
      // Add these to match the ChecklistTask interface
      assigned_to: task.assigned_to,
      last_generated: task.last_generated,
      next_due: task.next_due
    };
  };

  // Function to handle task completion
  const toggleTask = (areaIndex: number, taskIndex: number) => {
    if (editMode) return;
    
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
    } else {
      task.staffId = null;
      task.time = '';
    }
    
    setAreas(newAreas);
  };

  // Function to update staff assigned to task
  const updateTaskStaff = (areaIndex: number, taskIndex: number, staffId: string | null) => {
    if (editMode) return;
    
    const newAreas = [...areas];
    newAreas[areaIndex].tasks[taskIndex].staffId = staffId;
    setAreas(newAreas);
  };

  // Function to update initials
  const updateInitials = (areaIndex: number, taskIndex: number, value: string) => {
    const newAreas = [...areas];
    newAreas[areaIndex].tasks[taskIndex].initials = value;
    setAreas(newAreas);
  };

  // Area editing functions
  const startEditingArea = (areaId: string, currentName: string) => {
    setEditingAreaId(areaId);
    setNewAreaName(currentName);
  };

  const saveAreaName = async (areaIndex: number) => {
    if (!newAreaName.trim()) return;
    
    try {
      const area = areas[areaIndex];
      
      // Only attempt to update the database if this is an actual area (not "unassigned")
      if (area.id !== 'unassigned') {
        const { error } = await supabase
          .from('facility_areas')
          .update({ name: newAreaName })
          .eq('id', area.id);
          
        if (error) throw error;
      }
      
      const newAreas = [...areas];
      newAreas[areaIndex].name = newAreaName;
      setAreas(newAreas);
      setEditingAreaId(null);
      
      toast({
        title: 'Success',
        description: 'Area name updated',
      });
    } catch (error) {
      console.error('Error updating area:', error);
      toast({
        title: 'Error',
        description: 'Failed to update area name',
        variant: 'destructive'
      });
    }
  };

  // Task editing functions
  const startEditingTask = (taskId: string, currentDescription: string) => {
    setEditingTaskId(taskId);
    setNewTaskDescription(currentDescription);
  };

  const saveTaskDescription = async (areaIndex: number, taskIndex: number) => {
    if (!newTaskDescription.trim()) return;
    
    try {
      const task = areas[areaIndex].tasks[taskIndex];
      
      // Update task in database
      const { error } = await supabase
        .from('facility_tasks')
        .update({ name: newTaskDescription })
        .eq('id', task.id);
        
      if (error) throw error;
      
      // Update local state
      const newAreas = [...areas];
      newAreas[areaIndex].tasks[taskIndex].name = newTaskDescription;
      setAreas(newAreas);
      setEditingTaskId(null);
      
      toast({
        title: 'Success',
        description: 'Task updated',
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive'
      });
    }
  };

  // Add new task to area
  const addTask = async (areaIndex: number) => {
    try {
      const area = areas[areaIndex];
      const areaId = area.id !== 'unassigned' ? area.id : null;
      
      // Add task to database
      const { data, error } = await supabase
        .from('facility_tasks')
        .insert({
          name: 'New task',
          description: '',
          frequency: 'daily',
          area_id: areaId,
          active: true
        })
        .select();
        
      if (error) throw error;
      
      // Update local state with properly typed data
      const newTask: ChecklistTask = {
        ...data[0],
        completed: false,
        staffId: null,
        initials: '',
        time: '',
        assigned_to: null,
        last_generated: null,
        next_due: null
      };
      
      const newAreas = [...areas];
      newAreas[areaIndex].tasks.push(newTask);
      setAreas(newAreas);
      
      // Start editing the new task
      setEditingTaskId(newTask.id);
      setNewTaskDescription('New task');
      
      toast({
        title: 'Success',
        description: 'New task added',
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: 'Error',
        description: 'Failed to add task',
        variant: 'destructive'
      });
    }
  };

  // Remove task
  const removeTask = async (areaIndex: number, taskIndex: number) => {
    try {
      const task = areas[areaIndex].tasks[taskIndex];
      
      // Remove task from database (soft delete by setting active=false)
      const { error } = await supabase
        .from('facility_tasks')
        .update({ active: false })
        .eq('id', task.id);
        
      if (error) throw error;
      
      // Update local state
      const newAreas = [...areas];
      newAreas[areaIndex].tasks.splice(taskIndex, 1);
      setAreas(newAreas);
      
      toast({
        title: 'Success',
        description: 'Task removed',
      });
    } catch (error) {
      console.error('Error removing task:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove task',
        variant: 'destructive'
      });
    }
  };

  // Add new area
  const addArea = async () => {
    try {
      // Add area to database
      const { data, error } = await supabase
        .from('facility_areas')
        .insert({
          name: 'New Area',
          description: ''
        })
        .select();
        
      if (error) throw error;
      
      // Update local state
      setAreas([...areas, {
        id: data[0].id,
        name: 'New Area',
        tasks: []
      }]);
      
      setEditingAreaId(data[0].id);
      setNewAreaName('New Area');
      
      toast({
        title: 'Success',
        description: 'New area added',
      });
    } catch (error) {
      console.error('Error adding area:', error);
      toast({
        title: 'Error',
        description: 'Failed to add area',
        variant: 'destructive'
      });
    }
  };

  // Remove area
  const removeArea = async (areaIndex: number) => {
    try {
      const area = areas[areaIndex];
      
      // Cannot remove "unassigned" area
      if (area.id === 'unassigned') {
        toast({
          title: 'Cannot Remove',
          description: 'The general tasks area cannot be removed',
          variant: 'destructive'
        });
        return;
      }
      
      // Remove area from database
      const { error } = await supabase
        .from('facility_areas')
        .delete()
        .eq('id', area.id);
        
      if (error) throw error;
      
      // Update local state
      const newAreas = [...areas];
      newAreas.splice(areaIndex, 1);
      setAreas(newAreas);
      
      toast({
        title: 'Success',
        description: 'Area removed',
      });
    } catch (error) {
      console.error('Error removing area:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove area',
        variant: 'destructive'
      });
    }
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

  // Reset checklist
  const resetChecklist = () => {
    if (!window.confirm('Reset all checked items? This will keep your areas and tasks but clear all checkmarks.')) return;
    
    const newAreas = areas.map(area => ({
      ...area,
      tasks: area.tasks.map(task => ({
        ...task,
        completed: false,
        staffId: null,
        initials: '',
        time: ''
      }))
    }));
    
    setAreas(newAreas);
    
    toast({
      title: 'Checklist Reset',
      description: 'All checkmarks have been cleared.'
    });
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
      // Create a new submission
      const { data: submission, error: submissionError } = await supabase
        .from('facility_checklist_submissions')
        .insert({
          created_by: user.id,
          completed_by: completedBy,
          verified_by: verifiedBy,
          comments: comments
        })
        .select();
        
      if (submissionError) throw submissionError;
      
      // Create task records for each completed task
      const submissionId = submission[0].id;
      
      const taskRecords = [];
      areas.forEach(area => {
        area.tasks.forEach(task => {
          if (task.completed) {
            taskRecords.push({
              submission_id: submissionId,
              task_id: task.id,
              task_description: task.name,
              completed: true,
              initials: task.initials,
              timestamp: task.time ? new Date(new Date().toDateString() + ' ' + task.time) : new Date(),
              staff_id: task.staffId
            });
          }
        });
      });
      
      if (taskRecords.length > 0) {
        const { error: tasksError } = await supabase
          .from('facility_checklist_tasks')
          .insert(taskRecords);
          
        if (tasksError) throw tasksError;
      }
      
      toast({
        title: 'Success',
        description: 'Checklist saved successfully',
      });
      
      // Reset the form after successful save
      resetChecklist();
      setComments('');
      setCompletedBy('');
      setVerifiedBy('');
      
    } catch (error) {
      console.error('Error saving checklist:', error);
      toast({
        title: 'Error',
        description: 'Failed to save checklist',
        variant: 'destructive'
      });
    }
  };

  // Get staff name by ID
  const getStaffNameById = (staffId: string | null) => {
    if (!staffId) return '';
    const staff = staffMembers.find(s => s.id === staffId);
    return staff ? staff.name : '';
  };

  return {
    isLoading,
    areas,
    staffMembers,
    comments,
    setComments,
    completedBy,
    setCompletedBy,
    verifiedBy,
    setVerifiedBy,
    currentDate,
    editMode,
    setEditMode,
    editingAreaId,
    editingTaskId,
    newAreaName,
    newTaskDescription,
    setNewAreaName,        // Added these two that were missing
    setNewTaskDescription, // and causing the errors
    toggleTask,
    updateTaskStaff,
    updateInitials,
    calculateProgress,
    saveChecklist,
    startEditingArea,
    saveAreaName,
    startEditingTask,
    saveTaskDescription,
    addTask,
    removeTask,
    addArea,
    removeArea,
    resetChecklist,
    getStaffNameById
  };
};
