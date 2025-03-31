
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  Dog, 
  Plus, 
  X, 
  Users, 
  Save,
  Trash2
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { DogCareStatus } from '@/types/dailyCare';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

interface ScheduledTask {
  id: string;
  title: string;
  category: string;
  dogIds: string[];
  staffIds: string[];
  frequency: string;
  startDate: string;
  time: string;
  description: string;
}

// Mock staff data
const mockStaffMembers = [
  { id: '1', name: 'John Smith', role: 'Caretaker' },
  { id: '2', name: 'Emma Johnson', role: 'Veterinarian' },
  { id: '3', name: 'Michael Brown', role: 'Trainer' },
  { id: '4', name: 'Sarah Davis', role: 'Groomer' },
  { id: '5', name: 'David Wilson', role: 'Assistant' },
];

// Mock scheduled tasks
const mockScheduledTasks: ScheduledTask[] = [
  {
    id: '1',
    title: 'Morning Feeding',
    category: 'feeding',
    dogIds: ['dog1', 'dog2', 'dog3'],
    staffIds: ['1', '5'],
    frequency: 'daily',
    startDate: '2023-11-01',
    time: '08:00',
    description: 'Daily morning feeding for all dogs in the kennel area'
  },
  {
    id: '2',
    title: 'Weekly Grooming',
    category: 'grooming',
    dogIds: ['dog1', 'dog4'],
    staffIds: ['4'],
    frequency: 'weekly',
    startDate: '2023-11-02',
    time: '10:00',
    description: 'Weekly grooming session for show dogs'
  },
  {
    id: '3',
    title: 'Evening Medications',
    category: 'medications',
    dogIds: ['dog2', 'dog5'],
    staffIds: ['2'],
    frequency: 'daily',
    startDate: '2023-11-01',
    time: '19:00',
    description: 'Evening medication administration for dogs with prescriptions'
  }
];

interface CareTaskSchedulerProps {
  dogStatuses: DogCareStatus[];
  isLoading: boolean;
  onRefresh: () => void;
}

const CareTaskScheduler: React.FC<CareTaskSchedulerProps> = ({
  dogStatuses,
  isLoading,
  onRefresh
}) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tasks, setTasks] = useState<ScheduledTask[]>(mockScheduledTasks);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  
  // Form state
  const [newTask, setNewTask] = useState<Partial<ScheduledTask>>({
    title: '',
    category: 'feeding',
    dogIds: [],
    staffIds: [],
    frequency: 'daily',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    time: '08:00',
    description: ''
  });

  // Handle filter change
  const filteredTasks = selectedFilter === 'all' 
    ? tasks 
    : tasks.filter(task => task.category === selectedFilter);

  // Handle adding a new task
  const handleAddTask = () => {
    if (!newTask.title || newTask.dogIds?.length === 0 || newTask.staffIds?.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const taskId = `task${Date.now()}`;
    const completeTask = {
      ...newTask,
      id: taskId
    } as ScheduledTask;
    
    setTasks([...tasks, completeTask]);
    setIsDialogOpen(false);
    
    toast({
      title: "Task Scheduled",
      description: `${newTask.title} has been scheduled successfully`
    });
    
    // Reset form
    setNewTask({
      title: '',
      category: 'feeding',
      dogIds: [],
      staffIds: [],
      frequency: 'daily',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      time: '08:00',
      description: ''
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({
      title: "Task Deleted",
      description: "The scheduled task has been removed"
    });
  };

  // Toggle dog selection in the form
  const toggleDogSelection = (dogId: string) => {
    setNewTask(prev => {
      const currentDogIds = prev.dogIds || [];
      return {
        ...prev,
        dogIds: currentDogIds.includes(dogId)
          ? currentDogIds.filter(id => id !== dogId)
          : [...currentDogIds, dogId]
      };
    });
  };

  // Toggle staff selection in the form
  const toggleStaffSelection = (staffId: string) => {
    setNewTask(prev => {
      const currentStaffIds = prev.staffIds || [];
      return {
        ...prev,
        staffIds: currentStaffIds.includes(staffId)
          ? currentStaffIds.filter(id => id !== staffId)
          : [...currentStaffIds, staffId]
      };
    });
  };

  // Helper function to get dog names from ids
  const getDogNames = (dogIds: string[]) => {
    return dogStatuses
      .filter(dog => dogIds.includes(dog.dog_id))
      .map(dog => dog.dog_name);
  };

  // Helper function to get staff names from ids
  const getStaffNames = (staffIds: string[]) => {
    return mockStaffMembers
      .filter(staff => staffIds.includes(staff.id))
      .map(staff => staff.name);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="feeding">Feeding</SelectItem>
              <SelectItem value="medications">Medications</SelectItem>
              <SelectItem value="exercise">Exercise</SelectItem>
              <SelectItem value="grooming">Grooming</SelectItem>
              <SelectItem value="training">Training</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Schedule New Task
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <Card key={task.id} className="overflow-hidden group relative">
              <span 
                className={`absolute top-0 left-0 w-1 h-full ${
                  task.category === 'feeding' ? 'bg-green-500' :
                  task.category === 'medications' ? 'bg-amber-500' :
                  task.category === 'exercise' ? 'bg-blue-500' :
                  task.category === 'grooming' ? 'bg-purple-500' :
                  task.category === 'training' ? 'bg-indigo-500' : 'bg-gray-500'
                }`}
              />
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDeleteTask(task.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
              
              <CardContent className="pt-6">
                <div className="flex items-start mb-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    task.category === 'feeding' ? 'bg-green-100 text-green-700' :
                    task.category === 'medications' ? 'bg-amber-100 text-amber-700' :
                    task.category === 'exercise' ? 'bg-blue-100 text-blue-700' :
                    task.category === 'grooming' ? 'bg-purple-100 text-purple-700' :
                    task.category === 'training' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {task.category === 'feeding' && <span>F</span>}
                    {task.category === 'medications' && <span>M</span>}
                    {task.category === 'exercise' && <span>E</span>}
                    {task.category === 'grooming' && <span>G</span>}
                    {task.category === 'training' && <span>T</span>}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{task.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="capitalize">
                        {task.category}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {task.frequency}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{task.startDate}</span>
                    <Clock className="h-4 w-4 ml-2" />
                    <span>{task.time}</span>
                  </div>
                  
                  <div className="flex items-start gap-2 text-sm">
                    <Dog className="h-4 w-4 mt-1 shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      {getDogNames(task.dogIds).length > 0 ? 
                        getDogNames(task.dogIds).join(', ') : 'No dogs assigned'}
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-2 text-sm">
                    <Users className="h-4 w-4 mt-1 shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      {getStaffNames(task.staffIds).length > 0 ? 
                        getStaffNames(task.staffIds).join(', ') : 'No staff assigned'}
                    </span>
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center h-[40vh]">
            <div className="text-center">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-1">No Scheduled Tasks</h3>
              <p className="text-muted-foreground mb-4">Start by scheduling your first care task</p>
              <Button onClick={() => setIsDialogOpen(true)}>Schedule Task</Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Task scheduling dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Care Task</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  placeholder="Enter task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={newTask.category} 
                  onValueChange={(value) => setNewTask({...newTask, category: value})}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feeding">Feeding</SelectItem>
                    <SelectItem value="medications">Medications</SelectItem>
                    <SelectItem value="exercise">Exercise</SelectItem>
                    <SelectItem value="grooming">Grooming</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select 
                  value={newTask.frequency} 
                  onValueChange={(value) => setNewTask({...newTask, frequency: value})}
                >
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="once">One time only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newTask.startDate}
                    onChange={(e) => setNewTask({...newTask, startDate: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newTask.time}
                    onChange={(e) => setNewTask({...newTask, time: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Enter task details..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  rows={3}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Assign to Dogs</Label>
                <ScrollArea className="h-[150px] border rounded-md p-2">
                  <div className="space-y-2 pr-2">
                    {dogStatuses.map(dog => (
                      <div key={dog.dog_id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`dog-${dog.dog_id}`}
                          checked={(newTask.dogIds || []).includes(dog.dog_id)}
                          onChange={() => toggleDogSelection(dog.dog_id)}
                          className="rounded text-primary focus:ring-primary"
                        />
                        <label 
                          htmlFor={`dog-${dog.dog_id}`}
                          className="text-sm"
                        >
                          {dog.dog_name}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              <Separator className="my-2" />
              
              <div>
                <Label className="mb-2 block">Assign to Staff</Label>
                <ScrollArea className="h-[150px] border rounded-md p-2">
                  <div className="space-y-2 pr-2">
                    {mockStaffMembers.map(staff => (
                      <div key={staff.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`staff-${staff.id}`}
                          checked={(newTask.staffIds || []).includes(staff.id)}
                          onChange={() => toggleStaffSelection(staff.id)}
                          className="rounded text-primary focus:ring-primary"
                        />
                        <label 
                          htmlFor={`staff-${staff.id}`}
                          className="text-sm"
                        >
                          {staff.name} ({staff.role})
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTask} className="gap-2">
              <Save className="h-4 w-4" />
              Schedule Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CareTaskScheduler;
