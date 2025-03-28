
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useChecklistData } from './checklist/useChecklistData';
import ChecklistHeader from './checklist/ChecklistHeader';
import ChecklistProgress from './checklist/ChecklistProgress';
import TaskTable from './checklist/TaskTable';
import VerificationSection from './checklist/VerificationSection';

interface FacilityDailyChecklistProps {
  onEditTask?: (taskId: string) => void;
}

const FacilityDailyChecklist: React.FC<FacilityDailyChecklistProps> = ({ onEditTask }) => {
  const {
    isLoading,
    areas,
    comments,
    setComments,
    completedBy,
    setCompletedBy,
    verifiedBy,
    setVerifiedBy,
    currentDate,
    toggleTask,
    updateInitials,
    calculateProgress,
    saveChecklist
  } = useChecklistData();
  
  const progress = calculateProgress();

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Card className="shadow-md">
        <ChecklistHeader date={currentDate} />
        
        <CardContent className="p-0">
          {/* Progress Bar */}
          <ChecklistProgress 
            completedTasks={progress.completedTasks}
            totalTasks={progress.totalTasks}
            percentage={progress.percentage}
          />
          
          {/* Task Lists by Area */}
          <TaskTable 
            areas={areas} 
            toggleTask={toggleTask}
            updateInitials={updateInitials}
            onEditTask={onEditTask}
          />
          
          {/* Verification and Comments Sections */}
          <VerificationSection
            completedBy={completedBy}
            setCompletedBy={setCompletedBy}
            verifiedBy={verifiedBy}
            setVerifiedBy={setVerifiedBy}
            comments={comments}
            setComments={setComments}
            onSave={saveChecklist}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FacilityDailyChecklist;
