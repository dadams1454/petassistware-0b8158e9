
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import { useDailyCare } from '@/contexts/dailyCare'; // Fixed import
import { useDogs } from '@/hooks/useDogs';
import { DogFlag } from '@/types/dailyCare';

// Create a schema for form validation
const careLogSchema = z.object({
  category: z.string().min(1, "Category is required"),
  task_name: z.string().min(1, "Task name is required"),
  timestamp: z.date(),
  notes: z.string().optional(),
});

export type CareLogFormValues = z.infer<typeof careLogSchema>;

export const useCareLogForm = ({ 
  dogId, 
  onSuccess, 
  initialCategory = 'feeding' 
}: { 
  dogId: string; 
  onSuccess?: () => void;
  initialCategory?: string;
}) => {
  const { toast } = useToast();
  const { dogs } = useDogs();
  const { addCareLog, fetchCareTaskPresets } = useDailyCare();
  const [loading, setLoading] = useState(false);
  const [presets, setPresets] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [customTaskName, setCustomTaskName] = useState('');
  const [showCustomTask, setShowCustomTask] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newTaskName, setNewTaskName] = useState('');
  const [showNewPresetDialog, setShowNewPresetDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('task');

  // DogFlag state - convert from array to object structure for FlagSelection component
  const [selectedFlagState, setSelectedFlagState] = useState({
    in_heat: false,
    incompatible: false,
    special_attention: false,
    other: false
  });

  // For compatibility with components that expect DogFlag[]
  const selectedFlags: DogFlag[] = Object.entries(selectedFlagState)
    .filter(([_, isSelected]) => isSelected)
    .map(([type]) => ({
      id: type,
      name: type.replace('_', ' '),
      type: type as any
    }));

  // For compatibility with components that expect a toggleFlag function
  const toggleFlag = (flagType: "other" | "special_attention" | "incompatible" | "in_heat") => {
    setSelectedFlagState(prev => ({
      ...prev,
      [flagType]: !prev[flagType]
    }));
  };

  const [otherDogs, setOtherDogs] = useState<any[]>([]);
  const [incompatibleDogs, setIncompatibleDogs] = useState<string[]>([]);
  const [showFlagsSection, setShowFlagsSection] = useState(false);
  const [specialAttentionNote, setSpecialAttentionNote] = useState('');
  const [otherFlagNote, setOtherFlagNote] = useState('');

  // Setup form
  const form = useForm({
    resolver: zodResolver(careLogSchema),
    defaultValues: {
      category: initialCategory,
      task_name: '',
      timestamp: new Date(),
      notes: '',
    },
  });

  // Load presets
  useEffect(() => {
    const loadPresets = async () => {
      const presets = await fetchCareTaskPresets();
      setPresets(presets);
    };
    
    loadPresets();
  }, [fetchCareTaskPresets]);

  // Load other dogs (for incompatible selection)
  useEffect(() => {
    if (dogs && dogs.length > 0) {
      const otherDogsList = dogs.filter(dog => dog.id !== dogId);
      setOtherDogs(otherDogsList);
    }
  }, [dogs, dogId]);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    form.setValue('category', category);
    setShowCustomTask(false);
    form.setValue('task_name', '');
  };

  // Handle task name change
  const handleTaskNameChange = (taskName: string) => {
    form.setValue('task_name', taskName);
  };

  // Handle custom task change
  const handleCustomTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTaskName(e.target.value);
    form.setValue('task_name', e.target.value);
  };

  // Handle adding a new preset
  const handleAddPreset = async () => {
    // Implementation would go here
    setShowNewPresetDialog(false);
  };

  // Handle incompatible dog toggle
  const handleIncompatibleDogToggle = (dogId: string) => {
    setIncompatibleDogs(prev => 
      prev.includes(dogId) 
        ? prev.filter(id => id !== dogId) 
        : [...prev, dogId]
    );
  };

  // Form submission
  const onSubmit = async (data: CareLogFormValues) => {
    setLoading(true);
    
    try {
      // Add notes about flags if applicable
      let notes = data.notes || '';
      if (selectedFlagState.special_attention && specialAttentionNote) {
        notes += `\n[Special Attention]: ${specialAttentionNote}`;
      }
      if (selectedFlagState.other && otherFlagNote) {
        notes += `\n[Other Flag]: ${otherFlagNote}`;
      }
      if (incompatibleDogs.length > 0) {
        const incompatibleDogNames = incompatibleDogs
          .map(id => {
            const dog = dogs.find(d => d.id === id);
            return dog ? dog.name : id;
          })
          .join(', ');
        notes += `\n[Incompatible Dogs]: ${incompatibleDogNames}`;
      }
      
      await addCareLog({
        dog_id: dogId,
        category: data.category,
        task_name: data.task_name,
        task: data.task_name, // Add task property to match interface
        timestamp: data.timestamp,
        notes: notes.trim(),
      });
      
      toast({
        title: "Care log saved",
        description: `${data.category}: ${data.task_name} recorded successfully.`,
      });
      
      form.reset({
        category: data.category,
        task_name: '',
        timestamp: new Date(),
        notes: '',
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving care log:', error);
      toast({
        title: "Error",
        description: "Failed to save care log. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
    showCustomTask,
    setShowCustomTask,
    newCategoryName,
    setNewCategoryName,
    newTaskName, 
    setNewTaskName,
    showNewPresetDialog,
    setShowNewPresetDialog,
    activeTab,
    setActiveTab,
    otherDogs,
    incompatibleDogs,
    showFlagsSection,
    setShowFlagsSection,
    selectedFlags,
    specialAttentionNote,
    setSpecialAttentionNote,
    otherFlagNote,
    setOtherFlagNote,
    handleCategoryChange: (category: string) => {
      setSelectedCategory(category);
      form.setValue('category', category);
      setShowCustomTask(false);
      form.setValue('task_name', '');
    },
    handleTaskNameChange: (taskName: string) => {
      form.setValue('task_name', taskName);
    },
    handleCustomTaskChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setCustomTaskName(e.target.value);
      form.setValue('task_name', e.target.value);
    },
    handleAddPreset: async () => {
      setShowNewPresetDialog(false);
      // Implementation would go here
    },
    handleIncompatibleDogToggle: (dogId: string) => {
      setIncompatibleDogs(prev => 
        prev.includes(dogId) 
          ? prev.filter(id => id !== dogId) 
          : [...prev, dogId]
      );
    },
    toggleFlag,
    onSubmit
  };
};
