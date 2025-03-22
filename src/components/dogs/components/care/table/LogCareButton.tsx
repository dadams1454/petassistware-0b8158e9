
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import CareLogForm from '../CareLogForm';

interface LogCareButtonProps {
  dogId: string;
  hasLastCare: boolean;
  isSelected: boolean;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  onLogCare: (dogId: string) => void;
  onCareLogSuccess: () => void;
  selectedCategory: string;
}

const LogCareButton: React.FC<LogCareButtonProps> = ({
  dogId,
  hasLastCare,
  isSelected,
  dialogOpen,
  setDialogOpen,
  onLogCare,
  onCareLogSuccess,
  selectedCategory
}) => {
  // Auto-focus effect - when the component is selected, ensure dialog opens
  useEffect(() => {
    if (isSelected && !dialogOpen) {
      console.log(`Auto-opening dialog for dog ${dogId} because it was selected`);
      // Small delay to ensure state updates have propagated
      const timer = setTimeout(() => {
        setDialogOpen(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isSelected, dialogOpen, setDialogOpen, dogId]);

  const handleClick = (e: React.MouseEvent) => {
    // Stop event propagation to prevent parent elements from handling it
    e.stopPropagation();
    e.preventDefault();
    
    console.log(`🔍 Log care clicked for dog: ${dogId}`);
    
    // Call the handler first (which should select the dog)
    onLogCare(dogId);
    
    // Then explicitly open the dialog
    setTimeout(() => {
      console.log(`Opening dialog for dog ${dogId}`);
      setDialogOpen(true);
    }, 100);
  };

  return (
    <Dialog open={dialogOpen && isSelected} onOpenChange={setDialogOpen}>
      <Button 
        variant={hasLastCare ? "ghost" : "secondary"} 
        size="sm"
        onClick={handleClick}
        className="z-30 relative hover:bg-blue-100"
      >
        {hasLastCare ? "Update" : "Log Care"}
      </Button>
      <DialogContent className="max-w-md z-50">
        {isSelected && (
          <CareLogForm 
            dogId={dogId} 
            onSuccess={onCareLogSuccess}
            initialCategory={selectedCategory}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LogCareButton;
