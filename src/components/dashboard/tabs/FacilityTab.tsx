
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Plus, Filter, CalendarDays, ClipboardCheck, Clipboard, ListChecks } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/standardized';
import FacilityTasksList from '@/components/facility/FacilityTasksList';
import FacilityTaskForm from '@/components/facility/FacilityTaskForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FacilityTaskDialog from '@/components/facility/FacilityTaskDialog';
import FacilityDailyChecklist from '@/components/facility/FacilityDailyChecklist';
import { FacilityTask } from '@/types/facility';
import { DogCareStatus } from '@/types/dailyCare';

interface FacilityTabProps {
  onRefreshData: () => void;
  dogStatuses?: DogCareStatus[];
}

const FacilityTab: React.FC<FacilityTabProps> = ({ onRefreshData, dogStatuses }) => {
  const { toast } = useToast();
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState('all');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'tasks' | 'checklist'>('tasks');
  const [activeTaskTab, setActiveTaskTab] = useState<'list' | 'checklist'>('list');
  
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
  
  // Handle add/edit task actions
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
    onRefreshData();
  };
  
  const handleLogTask = () => {
    // This will be implemented in a future update
    toast({
      title: 'Coming Soon',
      description: 'Task logging functionality will be available in the next update.'
    });
  };
  
  const isLoading = isLoadingAreas || isLoadingTasks;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="flex gap-2">
          <Button
            variant={currentView === 'tasks' ? "default" : "outline"}
            className="gap-1"
            onClick={() => setCurrentView('tasks')}
          >
            <Clipboard className="h-4 w-4" />
            <span>Manage Tasks</span>
          </Button>
          
          <Button
            variant={currentView === 'checklist' ? "default" : "outline"}
            className="gap-1"
            onClick={() => setCurrentView('checklist')}
          >
            <ListChecks className="h-4 w-4" />
            <span>Daily Checklist</span>
          </Button>
        </div>
        
        {currentView === 'tasks' && (
          <div className="flex justify-between gap-3 flex-col sm:flex-row">
            <div className="relative w-full sm:w-72">
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
              <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-10 gap-1"
                onClick={handleLogTask}
              >
                <ClipboardCheck className="h-4 w-4" />
                <span>Log Task</span>
              </Button>
              
              <Button onClick={handleAddTask}>
                <Plus className="h-4 w-4 mr-1" />
                <span>Add Task</span>
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {currentView === 'tasks' ? (
        <>
          <Tabs 
            value={selectedFrequency} 
            onValueChange={setSelectedFrequency}
            className="w-full"
          >
            <TabsList className="w-full justify-start overflow-auto p-1 bg-background border-b">
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
            
            <div className="mt-4">
              <div className="flex justify-end mb-4">
                <Tabs
                  value={activeTaskTab}
                  onValueChange={(value) => setActiveTaskTab(value as 'list' | 'checklist')}
                  className="w-auto"
                >
                  <TabsList>
                    <TabsTrigger value="list" className="flex items-center gap-1">
                      <Clipboard className="h-4 w-4" />
                      <span>List View</span>
                    </TabsTrigger>
                    <TabsTrigger value="checklist" className="flex items-center gap-1">
                      <ListChecks className="h-4 w-4" />
                      <span>Checklist View</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center p-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : filteredTasks && filteredTasks.length > 0 ? (
                <>
                  {activeTaskTab === 'list' ? (
                    <FacilityTasksList 
                      tasks={filteredTasks} 
                      onEdit={handleEditTask}
                      onRefresh={refetchTasks}
                    />
                  ) : (
                    <FacilityDailyChecklist />
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <EmptyState
                      icon={<Building2 className="h-12 w-12 text-muted-foreground" />}
                      title="No Tasks Found"
                      description={searchQuery 
                        ? "No tasks match your search criteria. Try a different search term." 
                        : "Start by adding facility management tasks."
                      }
                      action={{
                        label: "Add Task",
                        onClick: handleAddTask
                      }}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </Tabs>
        </>
      ) : (
        <FacilityDailyChecklist />
      )}
      
      {/* Add/Edit Task Dialog */}
      <Dialog 
        open={isTaskDialogOpen} 
        onOpenChange={setIsTaskDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedTaskId ? 'Edit Task' : 'Add New Task'}
            </DialogTitle>
          </DialogHeader>
          
          <FacilityTaskDialog
            taskId={selectedTaskId}
            areas={areas || []}
            onSuccess={handleTaskSaved}
            onCancel={() => setIsTaskDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Quick Add Button (Mobile friendly) */}
      {currentView === 'tasks' && (
        <div className="fixed bottom-6 right-6 sm:hidden">
          <Button
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg"
            onClick={handleAddTask}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default FacilityTab;
