
import React from 'react';

interface TaskSelectionTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TaskSelectionTabs: React.FC<TaskSelectionTabsProps> = ({
  activeTab,
  setActiveTab
}) => {
  return (
    <div className="flex space-x-2">
      <button
        type="button"
        className={`px-3 py-1 text-sm rounded-md ${activeTab === 'existing' 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted text-muted-foreground'}`}
        onClick={() => setActiveTab('existing')}
      >
        Use Existing Task
      </button>
      <button
        type="button"
        className={`px-3 py-1 text-sm rounded-md ${activeTab === 'new' 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted text-muted-foreground'}`}
        onClick={() => setActiveTab('new')}
      >
        Create New Task
      </button>
    </div>
  );
};

export default TaskSelectionTabs;
