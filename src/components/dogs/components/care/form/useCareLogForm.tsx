import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useDailyCare } from '@/contexts/dailyCare';
import { DogFlag, CareTaskPreset } from '@/types/dailyCare';

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

interface DogBasicInfo {
  id: string;
  name: string;
}

export const useCareLogForm = (dogId: string, onSuccess?: () => void) => {
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
    const careLogData = {
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

  return {
    form,
    loading,
    presets,
    selectedCategory,
    setSelectedCategory,
    customTaskName,
    setCustomTaskName,
    newCategoryName,
    setNewCategoryName,
    newTaskName,
    setNewTaskName,
    showCustomTask,
    setShowCustomTask,
    activeTab,
    setActiveTab,
    showNewPresetDialog,
    setShowNewPresetDialog,
    otherDogs,
    incompatibleDogs,
    showFlagsSection,
    setShowFlagsSection,
    selectedFlags,
    specialAttentionNote,
    setSpecialAttentionNote,
    otherFlagNote,
    setOtherFlagNote,
    handleCategoryChange,
    handleTaskNameChange,
    handleCustomTaskChange,
    handleAddPreset,
    handleIncompatibleDogToggle,
    toggleFlag,
    onSubmit
  };
};
