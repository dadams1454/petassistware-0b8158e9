
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Paintbrush, Check, X, RotateCcw } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

const colorOptions = [
  { name: 'Blue', value: 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/50' },
  { name: 'Green', value: 'bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-800/50' },
  { name: 'Yellow', value: 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-800/50' },
  { name: 'Purple', value: 'bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-800/50' },
  { name: 'Pink', value: 'bg-pink-100 hover:bg-pink-200 dark:bg-pink-900/30 dark:hover:bg-pink-800/50' },
  { name: 'Cyan', value: 'bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-900/30 dark:hover:bg-cyan-800/50' },
  { name: 'Teal', value: 'bg-teal-100 hover:bg-teal-200 dark:bg-teal-900/30 dark:hover:bg-teal-800/50' },
  { name: 'Indigo', value: 'bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/50' },
  { name: 'Rose', value: 'bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 dark:hover:bg-rose-800/50' },
  { name: 'Lime', value: 'bg-lime-100 hover:bg-lime-200 dark:bg-lime-900/30 dark:hover:bg-lime-800/50' },
  { name: 'Default', value: '' },
];

interface DogColorPickerProps {
  dogId: string;
  dogName: string;
  trigger?: React.ReactNode;
}

const DogColorPicker: React.FC<DogColorPickerProps> = ({ dogId, dogName, trigger }) => {
  const { getDogColor, setDogColor, resetDogColor } = useUserPreferences();
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(getDogColor(dogId));
  
  const handleSave = () => {
    if (selectedColor) {
      setDogColor(dogId, selectedColor);
    } else {
      resetDogColor(dogId);
    }
    setOpen(false);
  };
  
  const handleReset = () => {
    setSelectedColor(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Paintbrush className="h-3.5 w-3.5" />
            <span>Customize</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Personalize {dogName}'s Appearance</DialogTitle>
          <DialogDescription>
            Choose a custom color for {dogName}'s cells in the schedule.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-5 gap-2 py-4">
          {colorOptions.map((color) => (
            <button
              key={color.name}
              className={`aspect-square rounded-md border-2 transition-all ${
                color.value ? color.value.split(' ')[0] : 'bg-white dark:bg-slate-800'
              } ${
                selectedColor === color.value 
                  ? 'ring-2 ring-primary border-primary'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
              onClick={() => setSelectedColor(color.value)}
              title={color.name}
            >
              {selectedColor === color.value && (
                <Check className="h-4 w-4 mx-auto text-primary dark:text-primary" />
              )}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 gap-4 py-2">
          <div className="flex gap-2 items-center">
            <div className="font-medium text-sm">Preview:</div>
            <div className={`flex-1 h-10 rounded-md border ${selectedColor || 'bg-white dark:bg-slate-800'}`}>
              <div className="flex items-center justify-center h-full text-sm">
                {dogName}'s Cell
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            className="gap-1"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="gap-1"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </Button>
          <Button
            type="button"
            className="gap-1"
            onClick={handleSave}
          >
            <Check className="h-4 w-4" />
            <span>Apply</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DogColorPicker;
