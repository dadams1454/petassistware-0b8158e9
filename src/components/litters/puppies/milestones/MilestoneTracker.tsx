
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Award } from 'lucide-react';
import MilestoneForm from './MilestoneForm';
import MilestoneList from './MilestoneList';
import { useMilestoneTracker } from '@/hooks/useMilestoneTracker';
import { MilestoneTrackerProps } from './types';

const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({ 
  puppyId,
  birthDate,
  onMilestoneAdded
}) => {
  const {
    milestones,
    isLoading,
    isAddingMilestone,
    setIsAddingMilestone,
    isSubmitting,
    addMilestone,
    deleteMilestone
  } = useMilestoneTracker(puppyId);

  const handleFormSubmit = async (data: any) => {
    await addMilestone(data);
    setIsAddingMilestone(false);
    
    if (onMilestoneAdded) {
      onMilestoneAdded();
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this milestone?')) {
      await deleteMilestone(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Developmental Milestones</CardTitle>
            <CardDescription>
              Track important developmental milestones
            </CardDescription>
          </div>
          
          {!isAddingMilestone && (
            <Button 
              onClick={() => setIsAddingMilestone(true)}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Milestone
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-5">
        {isAddingMilestone && (
          <MilestoneForm 
            onSubmit={handleFormSubmit}
            onCancel={() => setIsAddingMilestone(false)}
            isSubmitting={isSubmitting}
            birthDate={birthDate}
          />
        )}
        
        {isLoading ? (
          <div className="h-[150px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <MilestoneList 
            milestones={milestones || []} 
            onDelete={handleDeleteMilestone}
            birthDate={birthDate}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default MilestoneTracker;
