
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';

import { useDailyCare } from '@/contexts/DailyCareProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DialogTrigger, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const careLogSchema = z.object({
  category: z.string().min(1, { message: 'Please select a category' }),
  task_name: z.string().min(1, { message: 'Please select or enter a task' }),
  timestamp: z.date(),
  notes: z.string().optional(),
});

type CareLogFormValues = z.infer<typeof careLogSchema>;

interface CareLogFormProps {
  dogId: string;
  onSuccess?: () => void;
}

const CareLogForm: React.FC<CareLogFormProps> = ({ dogId, onSuccess }) => {
  const { addCareLog, fetchCareTaskPresets, addCareTaskPreset, loading } = useDailyCare();
  const [presets, setPresets] = useState<CareTaskPreset[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [customTaskName, setCustomTaskName] = useState<string>('');
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [newTaskName, setNewTaskName] = useState<string>('');
  const [showCustomTask, setShowCustomTask] = useState(false);
  const [activeTab, setActiveTab] = useState('existing');
  const [showNewPresetDialog, setShowNewPresetDialog] = useState(false);

  // Extract unique categories from presets
  const categories = Array.from(new Set(presets.map(preset => preset.category)));

  const form = useForm<CareLogFormValues>({
    resolver: zodResolver(careLogSchema),
    defaultValues: {
      category: '',
      task_name: '',
      timestamp: new Date(),
      notes: '',
    },
  });

  useEffect(() => {
    const loadPresets = async () => {
      const data = await fetchCareTaskPresets();
      setPresets(data);
    };
    loadPresets();
  }, [fetchCareTaskPresets]);

  const onSubmit = async (values: CareLogFormValues) => {
    // Create a properly typed CareLogFormData object
    const careLogData: CareLogFormData = {
      dog_id: dogId,
      category: values.category,
      task_name: values.task_name,
      timestamp: values.timestamp,
      notes: values.notes
    };
    
    const success = await addCareLog(careLogData);
    
    if (success && onSuccess) {
      form.reset();
      onSuccess();
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    form.setValue('category', value);
    // Reset task when category changes
    form.setValue('task_name', '');
    setShowCustomTask(false);
  };

  const handleTaskNameChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomTask(true);
      form.setValue('task_name', '');
    } else {
      form.setValue('task_name', value);
      setShowCustomTask(false);
    }
  };

  const handleCustomTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTaskName(e.target.value);
    form.setValue('task_name', e.target.value);
  };

  const handleAddPreset = async () => {
    if (newCategoryName.trim() && newTaskName.trim()) {
      const result = await addCareTaskPreset(newCategoryName.trim(), newTaskName.trim());
      if (result) {
        // Refresh presets
        const updatedPresets = await fetchCareTaskPresets();
        setPresets(updatedPresets);
        
        // Select the new category and task
        form.setValue('category', newCategoryName.trim());
        form.setValue('task_name', newTaskName.trim());
        setSelectedCategory(newCategoryName.trim());
        
        // Clear inputs and close dialog
        setNewCategoryName('');
        setNewTaskName('');
        setShowNewPresetDialog(false);
        setActiveTab('existing');
      }
    }
  };

  // Filter tasks based on selected category
  const filteredTasks = selectedCategory
    ? presets.filter(preset => preset.category === selectedCategory)
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Log Daily Care</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="existing">Use Existing Task</TabsTrigger>
                <TabsTrigger value="new">Create New Task</TabsTrigger>
              </TabsList>
              
              <TabsContent value="existing" className="space-y-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => handleCategoryChange(value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedCategory && (
                  <FormField
                    control={form.control}
                    name="task_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Task</FormLabel>
                        <Select
                          value={field.value || ''}
                          onValueChange={handleTaskNameChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a task" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filteredTasks.map(task => (
                              <SelectItem key={task.id} value={task.task_name}>
                                {task.task_name}
                              </SelectItem>
                            ))}
                            <SelectItem value="custom">
                              <span className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Custom Task
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {showCustomTask && (
                  <FormItem>
                    <FormLabel>Custom Task</FormLabel>
                    <Input
                      placeholder="Enter custom task name"
                      value={customTaskName}
                      onChange={handleCustomTaskChange}
                    />
                  </FormItem>
                )}
              </TabsContent>
              
              <TabsContent value="new">
                <div className="space-y-4">
                  <Dialog open={showNewPresetDialog} onOpenChange={setShowNewPresetDialog}>
                    <DialogTrigger asChild>
                      <Button type="button" variant="outline" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Task Preset
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Task Preset</DialogTitle>
                        <DialogDescription>
                          Add a new task preset that can be reused for daily care logs.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <FormLabel>Category</FormLabel>
                          <Input
                            placeholder="Enter category name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <FormLabel>Task Name</FormLabel>
                          <Input
                            placeholder="Enter task name"
                            value={newTaskName}
                            onChange={(e) => setNewTaskName(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" onClick={handleAddPreset} disabled={loading}>
                          Save Preset
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </TabsContent>
            </Tabs>

            <FormField
              control={form.control}
              name="timestamp"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date & Time</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP HH:mm:ss") : <span>Pick a date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => field.onChange(date || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional notes"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              Log Care Task
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CareLogForm;
