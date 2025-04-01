
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { usePuppySocialization } from '@/hooks/usePuppySocialization';
import { LoadingState } from '@/components/ui/standardized';
import SocializationForm from './SocializationForm';
import SocializationExperiencesList from './SocializationExperiencesList';
import SocializationProgressTracker from './SocializationProgressTracker';

interface SocializationDashboardProps {
  puppyId: string;
}

const SocializationDashboard: React.FC<SocializationDashboardProps> = ({ puppyId }) => {
  const [activeTab, setActiveTab] = useState('experiences');
  
  const {
    experiences,
    isLoading,
    error,
    socializationProgress,
    overallProgress,
    puppyAge,
    addExperience,
    deleteExperience,
    isAddingExperience,
    isDeletingExperience
  } = usePuppySocialization(puppyId);
  
  // Adapt the addExperience function to handle the different type signature
  const handleAddExperience = (data: { 
    notes?: string; 
    experience?: string; 
    experience_date?: Date; 
    reaction?: string; 
    category_id?: string; 
  }) => {
    if (!data.experience || !data.experience_date || !data.category_id) {
      console.error("Missing required fields for socialization experience");
      return;
    }
    
    // Convert the date to string format
    const experience_date_str = data.experience_date.toISOString().split('T')[0];
    
    // Call the actual addExperience with the correct type
    addExperience({
      category_id: data.category_id,
      experience: data.experience,
      experience_date: experience_date_str,
      reaction: data.reaction,
      notes: data.notes
    });
  };
  
  if (isLoading) {
    return <LoadingState message="Loading socialization data..." />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="experiences">Experiences</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="add">Add New</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <TabsContent value="experiences" className="mt-0">
        <SocializationExperiencesList
          experiences={experiences}
          isLoading={isLoading}
          error={error}
          onDelete={deleteExperience}
          isDeleting={isDeletingExperience}
        />
      </TabsContent>
      
      <TabsContent value="progress" className="mt-0">
        <SocializationProgressTracker
          progressData={socializationProgress}
          overallProgress={overallProgress}
        />
      </TabsContent>
      
      <TabsContent value="add" className="mt-0">
        <SocializationForm
          onSubmit={handleAddExperience}
          isSubmitting={isAddingExperience}
          onCancel={() => setActiveTab('experiences')}
        />
      </TabsContent>
    </div>
  );
};

export default SocializationDashboard;
