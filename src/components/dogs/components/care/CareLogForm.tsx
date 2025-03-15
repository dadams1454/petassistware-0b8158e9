
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Calendar as CalendarIcon, Plus, Heart, Slash, Flag, AlertCircle } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

const careLogSchema = z.object({
  category: z.string().min(1, { message: 'Please select a category' }),
  task_name: z.string().min(1, { message: 'Please select or enter a task' }),
  timestamp: z.date(),
  notes: z.string().optional(),
  flags: z.array(z.object({
    type: z.enum(['in_heat', 'incompatible', 'special_attention', 'other']),
    value: z.string().optional(),
    incompatible_with: z.array(z.string()).optional(),
  })).optional(),
});

type CareLogFormValues = z.infer<typeof careLogSchema>;

interface CareLogFormProps {
  dogId: string;
  onSuccess?: () => void;
}

interface DogBasicInfo {
  id: string;
  name: string;
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
  const [otherDogs, setOtherDogs] = useState<DogBasicInfo[]>([]);
  const [incompatibleDogs, setIncompatibleDogs] = useState<string[]>([]);
  const [showFlagsSection, setShowFlagsSection] = useState(false);
  const [selectedFlags, setSelectedFlags] = useState<{
    in_heat: boolean;
    incompatible: boolean;
    special_attention: boolean;
    other: boolean;
  }>({
    in_heat: false,
    incompatible: false,
    special_attention: false,
    other: false,
  });
  const [specialAttentionNote, setSpecialAttentionNote] = useState('');
  const [otherFlagNote, setOtherFlagNote] = useState('');

  // Extract unique categories from presets
  const categories = Array.from(new Set(presets.map(preset => preset.category)));

  const form = useForm<CareLogFormValues>({
    resolver: zodResolver(careLogSchema),
    defaultValues: {
      category: '',
      task_name: '',
      timestamp: new Date(),
      notes: '',
      flags: [],
    },
  });

  useEffect(() => {
    const loadPresets = async () => {
      const data = await fetchCareTaskPresets();
      setPresets(data);
    };
    loadPresets();
  }, [fetchCareTaskPresets]);

  useEffect(() => {
    // Fetch other dogs for incompatibility selection
    const fetchOtherDogs = async () => {
      try {
        const { data, error } = await supabase
          .from('dogs')
          .select('id, name')
          .neq('id', dogId)
          .order('name');
        
        if (error) throw error;
        setOtherDogs(data || []);
      } catch (error) {
        console.error('Error fetching other dogs:', error);
      }
    };
    
    fetchOtherDogs();
  }, [dogId]);

  const compileFlags = (): DogFlag[] => {
    const flags: DogFlag[] = [];
    
    if (selectedFlags.in_heat) {
      flags.push({ type: 'in_heat' });
    }
    
    if (selectedFlags.incompatible && incompatibleDogs.length > 0) {
      flags.push({ 
        type: 'incompatible',
        incompatible_with: incompatibleDogs
      });
    }
    
    if (selectedFlags.special_attention && specialAttentionNote) {
      flags.push({
        type: 'special_attention',
        value: specialAttentionNote
      });
    }
    
    if (selectedFlags.other && otherFlagNote) {
      flags.push({
        type: 'other',
        value: otherFlagNote
      });
    }
    
    return flags;
  };

  const onSubmit = async (values: CareLogFormValues) => {
    // Compile flags from UI state
    const flags = compileFlags();
    
    // Create a properly typed CareLogFormData object
    const careLogData: CareLogFormData = {
      dog_id: dogId,
      category: values.category,
      task_name: values.task_name,
      timestamp: values.timestamp,
      notes: values.notes,
      flags: flags.length > 0 ? flags : undefined
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

  const handleIncompatibleDogToggle = (dogId: string) => {
    setIncompatibleDogs(current => 
      current.includes(dogId)
        ? current.filter(id => id !== dogId)
        : [...current, dogId]
    );
  };

  const toggleFlag = (flagType: keyof typeof selectedFlags) => {
    setSelectedFlags(prev => ({
      ...prev,
      [flagType]: !prev[flagType]
    }));
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

            {/* Add flags section */}
            <div className="border rounded-md p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Special Flags</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFlagsSection(!showFlagsSection)}
                >
                  {showFlagsSection ? 'Hide' : 'Show'}
                </Button>
              </div>
              
              {showFlagsSection && (
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="in-heat" 
                        checked={selectedFlags.in_heat}
                        onCheckedChange={() => toggleFlag('in_heat')}
                      />
                      <label 
                        htmlFor="in-heat"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2"
                      >
                        <Heart className="h-4 w-4 text-red-500" />
                        <span>In Heat</span>
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="incompatible" 
                        checked={selectedFlags.incompatible}
                        onCheckedChange={() => toggleFlag('incompatible')}
                      />
                      <label 
                        htmlFor="incompatible"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2"
                      >
                        <Slash className="h-4 w-4 text-amber-500" />
                        <span>Doesn't Get Along With Other Dogs</span>
                      </label>
                    </div>

                    {selectedFlags.incompatible && (
                      <div className="pl-6 mt-2 space-y-2">
                        <p className="text-sm text-muted-foreground">Select incompatible dogs:</p>
                        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                          {otherDogs.map(dog => (
                            <div key={dog.id} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`incompatible-${dog.id}`}
                                checked={incompatibleDogs.includes(dog.id)}
                                onCheckedChange={() => handleIncompatibleDogToggle(dog.id)}
                              />
                              <label 
                                htmlFor={`incompatible-${dog.id}`}
                                className="text-sm cursor-pointer"
                              >
                                {dog.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="special-attention" 
                        checked={selectedFlags.special_attention}
                        onCheckedChange={() => toggleFlag('special_attention')}
                      />
                      <label 
                        htmlFor="special-attention"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2"
                      >
                        <AlertCircle className="h-4 w-4 text-blue-500" />
                        <span>Needs Special Attention</span>
                      </label>
                    </div>

                    {selectedFlags.special_attention && (
                      <div className="pl-6 mt-2">
                        <Input
                          placeholder="Specify what special attention is needed"
                          value={specialAttentionNote}
                          onChange={(e) => setSpecialAttentionNote(e.target.value)}
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="other-flag" 
                        checked={selectedFlags.other}
                        onCheckedChange={() => toggleFlag('other')}
                      />
                      <label 
                        htmlFor="other-flag"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2"
                      >
                        <Flag className="h-4 w-4 text-gray-500" />
                        <span>Other Flag</span>
                      </label>
                    </div>

                    {selectedFlags.other && (
                      <div className="pl-6 mt-2">
                        <Input
                          placeholder="Specify the flag"
                          value={otherFlagNote}
                          onChange={(e) => setOtherFlagNote(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  {/* Show active flags summary */}
                  {(selectedFlags.in_heat || selectedFlags.incompatible || 
                    selectedFlags.special_attention || selectedFlags.other) && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedFlags.in_heat && (
                        <Badge variant="outline" className="bg-red-100 text-red-800">
                          <Heart className="h-3 w-3 mr-1 fill-red-500 text-red-500" />
                          In Heat
                        </Badge>
                      )}
                      {selectedFlags.incompatible && incompatibleDogs.length > 0 && (
                        <Badge variant="outline" className="bg-amber-100 text-amber-800">
                          <Slash className="h-3 w-3 mr-1 text-amber-500" />
                          Incompatible with {incompatibleDogs.length} dogs
                        </Badge>
                      )}
                      {selectedFlags.special_attention && specialAttentionNote && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800">
                          <AlertCircle className="h-3 w-3 mr-1 text-blue-500" />
                          {specialAttentionNote}
                        </Badge>
                      )}
                      {selectedFlags.other && otherFlagNote && (
                        <Badge variant="outline" className="bg-gray-100 text-gray-800">
                          <Flag className="h-3 w-3 mr-1 text-gray-500" />
                          {otherFlagNote}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

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
