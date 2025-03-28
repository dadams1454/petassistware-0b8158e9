
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, Plus, Clipboard, ListChecks, ClipboardCheck } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/standardized';
import { Building2 } from 'lucide-react';
import { FacilityTask } from '@/types/facility';
import FacilityTasksList from './FacilityTasksList';
import FacilityDailyChecklist from './FacilityDailyChecklist';
import { useToast } from '@/components/ui/use-toast';

interface TasksViewProps {
  filteredTasks: FacilityTask[] | undefined;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedFrequency: string;
  setSelectedFrequency: (frequency: string) => void;
  handleAddTask: () => void;
  handleEditTask: (taskId: string) => void;
  refetchTasks: () => void;
}

const TasksView: React.FC<TasksViewProps> = ({
  filteredTasks,
  isLoading,
  searchQuery,
  setSearchQuery,
  selectedFrequency,
  setSelectedFrequency,
  handleAddTask,
  handleEditTask,
  refetchTasks,
}) => {
  const { toast } = useToast();
  const [activeTaskTab, setActiveTaskTab] = useState<'list' | 'checklist'>('list');

  const handleLogTask = () => {
    toast({
      title: 'Coming Soon',
      description: 'Task logging functionality will be available in the next update.'
    });
  };
  
  return (
    <>
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
                <FacilityDailyChecklist
                  onEditTask={handleEditTask}
                />
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

      {/* Quick Add Button (Mobile friendly) */}
      <div className="fixed bottom-6 right-6 sm:hidden">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={handleAddTask}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </>
  );
};

export default TasksView;
