
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DogFlag } from '@/types/dailyCare';

// Schema definition moved from the main hook
export const careLogSchema = z.object({
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

export type CareLogFormValues = z.infer<typeof careLogSchema>;

export interface DogBasicInfo {
  id: string;
  name: string;
}

export const useCareLogFormState = () => {
  // Form state
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

  // Task selection state
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [customTaskName, setCustomTaskName] = useState<string>('');
  const [showCustomTask, setShowCustomTask] = useState(false);
  
  // New preset state
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [newTaskName, setNewTaskName] = useState<string>('');
  const [showNewPresetDialog, setShowNewPresetDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('existing');
  
  // Flag-related state
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

  return {
    // Form
    form,
    
    // Task selection
    selectedCategory,
    setSelectedCategory,
    customTaskName,
    setCustomTaskName,
    showCustomTask,
    setShowCustomTask,
    
    // New preset
    newCategoryName,
    setNewCategoryName,
    newTaskName,
    setNewTaskName,
    showNewPresetDialog,
    setShowNewPresetDialog,
    activeTab,
    setActiveTab,
    
    // Flags related
    otherDogs,
    setOtherDogs,
    incompatibleDogs,
    setIncompatibleDogs,
    showFlagsSection,
    setShowFlagsSection,
    selectedFlags,
    setSelectedFlags,
    specialAttentionNote,
    setSpecialAttentionNote,
    otherFlagNote,
    setOtherFlagNote
  };
};
