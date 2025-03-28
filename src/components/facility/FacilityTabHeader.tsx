
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clipboard, ListChecks } from 'lucide-react';

interface FacilityTabHeaderProps {
  currentView: 'tasks' | 'checklist';
  setCurrentView: (view: 'tasks' | 'checklist') => void;
}

const FacilityTabHeader: React.FC<FacilityTabHeaderProps> = ({ 
  currentView, 
  setCurrentView 
}) => {
  return (
    <div className="flex gap-2">
      <Button
        variant={currentView === 'tasks' ? "default" : "outline"}
        className="gap-1"
        onClick={() => setCurrentView('tasks')}
      >
        <Clipboard className="h-4 w-4" />
        <span>Manage Tasks</span>
      </Button>
      
      <Button
        variant={currentView === 'checklist' ? "default" : "outline"}
        className="gap-1"
        onClick={() => setCurrentView('checklist')}
      >
        <ListChecks className="h-4 w-4" />
        <span>Daily Checklist</span>
      </Button>
    </div>
  );
};

export default FacilityTabHeader;
