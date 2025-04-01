
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePuppySocialization } from '@/hooks/usePuppySocialization';
import SocializationExperienceForm from './SocializationExperienceForm';
import SocializationList from './SocializationList';
import SocializationStats from './SocializationStats';

interface SocializationDashboardProps {
  puppyId: string;
}

const SocializationDashboard: React.FC<SocializationDashboardProps> = ({ 
  puppyId 
}) => {
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('experiences');
  
  const { 
    experiences, 
    isLoading, 
    error, 
    addExperience,
    deleteExperience 
  } = usePuppySocialization(puppyId);

  const handleSubmit = async (data: any) => {
    await addExperience(data);
    setIsAddingExperience(false);
  };

  const handleCancel = () => {
    setIsAddingExperience(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      deleteExperience(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Socialization Tracking</h2>
        {!isAddingExperience && (
          <Button onClick={() => setIsAddingExperience(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        )}
      </div>

      {isAddingExperience ? (
        <Card>
          <CardHeader>
            <CardTitle>Record Socialization Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <SocializationExperienceForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              puppyId={puppyId}
            />
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="experiences">Experiences</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="experiences">
            <SocializationList 
              experiences={experiences}
              isLoading={isLoading}
              onDelete={handleDelete}
            />
          </TabsContent>
          
          <TabsContent value="stats">
            <SocializationStats experiences={experiences} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default SocializationDashboard;
