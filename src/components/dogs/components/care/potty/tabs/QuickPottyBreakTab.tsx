
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DogCareStatus } from '@/types/dailyCare';
import { FileText, Clock, PenLine } from 'lucide-react';

interface QuickPottyBreakTabProps {
  dogs: DogCareStatus[];
  getTimeSinceLastPottyBreak: (dog: DogCareStatus) => string;
  handleQuickPottyBreak: (dogId: string, dogName: string, notes?: string) => Promise<void>;
  isLoading: boolean;
}

const QuickPottyBreakTab: React.FC<QuickPottyBreakTabProps> = ({
  dogs,
  getTimeSinceLastPottyBreak,
  handleQuickPottyBreak,
  isLoading
}) => {
  const [selectedDog, setSelectedDog] = useState<DogCareStatus | null>(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const handleOpenNotes = (dog: DogCareStatus) => {
    setSelectedDog(dog);
    setNotes('');
    setNotesOpen(true);
  };

  const handleLogWithNotes = async () => {
    if (!selectedDog) return;
    
    try {
      setActionInProgress(selectedDog.dog_id);
      await handleQuickPottyBreak(selectedDog.dog_id, selectedDog.dog_name, notes);
      setNotesOpen(false);
      setNotes('');
      setSelectedDog(null);
    } catch (error) {
      console.error('Error logging potty break with notes:', error);
    } finally {
      setActionInProgress(null);
    }
  };

  if (dogs.length === 0) {
    return (
      <Card className="p-4 text-center text-muted-foreground">
        No dogs found. Please add dogs to the system first.
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dogs.map(dog => (
          <Card key={dog.dog_id} className="p-4 flex flex-col">
            <div className="flex items-center space-x-3 mb-3">
              {dog.dog_photo ? (
                <img 
                  src={dog.dog_photo} 
                  alt={dog.dog_name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">{dog.dog_name.charAt(0)}</span>
                </div>
              )}
              <div>
                <h3 className="font-medium">{dog.dog_name}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  {getTimeSinceLastPottyBreak(dog)}
                </div>
              </div>
            </div>
            <div className="mt-auto pt-2">
              <Button 
                variant="default" 
                size="sm" 
                className="w-full"
                onClick={() => handleOpenNotes(dog)}
                disabled={isLoading || actionInProgress !== null}
              >
                <PenLine className="h-4 w-4 mr-2" />
                Add Potty Break Notes
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Notes Dialog */}
      <Dialog open={notesOpen} onOpenChange={setNotesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Potty Break Observations for {selectedDog?.dog_name}</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm text-muted-foreground mb-4">
              Record observations about {selectedDog?.dog_name}'s potty break. 
              This helps track patterns and health indicators over time.
            </p>
            <Textarea
              placeholder="Enter observations (e.g., unusual color, consistency, duration, frequency, straining, etc.)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setNotesOpen(false)} disabled={actionInProgress !== null}>
              Cancel
            </Button>
            <Button 
              onClick={handleLogWithNotes} 
              disabled={isLoading || actionInProgress !== null || !notes.trim()}
            >
              {actionInProgress !== null ? (
                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-1" />
              ) : (
                <FileText className="h-4 w-4 mr-1" />
              )}
              Log Potty Break
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuickPottyBreakTab;
