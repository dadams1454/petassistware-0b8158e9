
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SocializationTrackerProps } from './types';
import { useSocializationTracker } from '@/hooks/useSocializationTracker';
import SocializationForm from './SocializationForm';
import SocializationList from './SocializationList';

const SocializationTracker: React.FC<SocializationTrackerProps> = ({
  puppyId,
  onExperienceAdded
}) => {
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  
  const {
    experiences,
    isLoading,
    isSubmitting,
    addExperience,
    deleteExperience
  } = useSocializationTracker(puppyId);

  const handleFormSubmit = async (data: any) => {
    await addExperience({
      puppy_id: puppyId,
      ...data
    });
    
    setIsAddingExperience(false);
    if (onExperienceAdded) onExperienceAdded();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Socialization Tracking</CardTitle>
            <CardDescription>
              Record new experiences and puppy reactions
            </CardDescription>
          </div>
          
          {!isAddingExperience && (
            <Button 
              onClick={() => setIsAddingExperience(true)}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Experience
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-5">
        {isAddingExperience && (
          <SocializationForm 
            onSubmit={handleFormSubmit}
            onCancel={() => setIsAddingExperience(false)}
            isSubmitting={isSubmitting}
          />
        )}
        
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <SocializationList 
            experiences={experiences || []} 
            onDelete={deleteExperience} 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SocializationTracker;
