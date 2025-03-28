
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clipboard, ListChecks } from 'lucide-react';

interface FacilityTabHeaderProps {
  currentView: 'checklist';
  setCurrentView: (view: 'checklist') => void;
}

const FacilityTabHeader: React.FC<FacilityTabHeaderProps> = ({ 
  currentView
}) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="default"
        className="gap-1"
      >
        <ListChecks className="h-4 w-4" />
        <span>Daily Checklist</span>
      </Button>
    </div>
  );
};

export default FacilityTabHeader;
