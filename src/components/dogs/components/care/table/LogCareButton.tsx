
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
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
  const handleClick = (e: React.MouseEvent) => {
    // Stop event propagation to prevent parent elements from handling it
    e.stopPropagation();
    e.preventDefault();
    
    console.log(`🔍 Log care clicked for dog: ${dogId}`);
    onLogCare(dogId);
    
    // Explicitly open the dialog (optional if DialogTrigger handles this)
    setDialogOpen(true);
  };

  return (
    <Dialog open={dialogOpen && isSelected} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={hasLastCare ? "ghost" : "secondary"} 
          size="sm"
          onClick={handleClick}
          className="z-10 relative"
        >
          {hasLastCare ? "Update" : "Log Care"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
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
