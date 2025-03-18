
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, FileText, PlusCircle } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';
import { useNavigate } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface QuickPottyBreakTabProps {
  dogs: DogCareStatus[];
  getTimeSinceLastPottyBreak: (dog: DogCareStatus) => string;
  handleQuickPottyBreak: (dogId: string, dogName: string, notes?: string) => void;
  isLoading: boolean;
}

const QuickPottyBreakTab: React.FC<QuickPottyBreakTabProps> = ({
  dogs,
  getTimeSinceLastPottyBreak,
  handleQuickPottyBreak,
  isLoading
}) => {
  const navigate = useNavigate();
  const [selectedDog, setSelectedDog] = useState<{id: string, name: string} | null>(null);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');

  const handleNavigateToDog = (dogId: string) => {
    navigate(`/dogs/${dogId}`);
  };

  const openNotesDialog = (dogId: string, dogName: string) => {
    setSelectedDog({id: dogId, name: dogName});
    setIsNotesDialogOpen(true);
  };

  const handleNotesSubmit = () => {
    if (selectedDog) {
      handleQuickPottyBreak(selectedDog.id, selectedDog.name, notes);
      setNotes('');
      setIsNotesDialogOpen(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {dogs.map(dog => {
        const needsPottyBreak = !dog.last_care || dog.last_care.category !== 'pottybreaks';
        return (
          <Card 
            key={`quick-${dog.dog_id}`} 
            className={`shadow-sm border overflow-hidden hover:shadow-md transition ${
              needsPottyBreak ? 'border-amber-400 dark:border-amber-700' : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            <CardContent className="p-4 flex items-start">
              <div 
                className="flex-shrink-0 mr-3 cursor-pointer" 
                onClick={() => handleNavigateToDog(dog.dog_id)}
              >
                {dog.dog_photo ? (
                  <img 
                    src={dog.dog_photo} 
                    alt={dog.dog_name} 
                    className="h-12 w-12 rounded-full object-cover hover:opacity-80 transition-opacity"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center hover:opacity-80 transition-opacity">
                    <span>{dog.dog_name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <h4 
                  className="font-medium cursor-pointer hover:underline" 
                  onClick={() => handleNavigateToDog(dog.dog_id)}
                >
                  {dog.dog_name}
                </h4>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {getTimeSinceLastPottyBreak(dog)}
                </div>
              </div>
              <Button 
                size="sm"
                variant="outline"
                onClick={() => openNotesDialog(dog.dog_id, dog.dog_name)}
                disabled={isLoading}
                className="gap-1"
              >
                <FileText className="h-3.5 w-3.5" />
                {needsPottyBreak ? 'Add Notes' : 'Update'}
              </Button>
            </CardContent>
          </Card>
        );
      })}

      <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Potty Break Notes for {selectedDog?.name}</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Enter any observations about this potty break..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[120px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNotesDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleNotesSubmit} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Notes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuickPottyBreakTab;
