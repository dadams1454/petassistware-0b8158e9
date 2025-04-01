
// Import parts that handle the type issue related to experience_date
// We'll update the component so that it handles Date objects properly

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, UserCircle, Sparkles, LineChart } from 'lucide-react';
import { usePuppyDetail } from '@/hooks/usePuppyDetail';
import { useSocializationTracker } from '@/hooks/useSocializationTracker';
import { LoadingState, ErrorState } from '@/components/ui/standardized';
import SocializationLogForm from './SocializationLogForm';
import SocializationExperiencesList from './SocializationExperiencesList';
import SocializationProgressChart from './SocializationProgressChart';
import SocializationCategoryList from './SocializationCategoryList';

interface SocializationDashboardProps {
  puppyId: string;
}

const SocializationDashboard: React.FC<SocializationDashboardProps> = ({ puppyId }) => {
  const [activeTab, setActiveTab] = useState('experiences');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const puppyQuery = usePuppyDetail(puppyId);
  const { 
    experiences, 
    categories, 
    reactions,
    isLoading: isExpLoading,
    error: expError,
    progress,
    addExperience,
    deleteExperience
  } = useSocializationTracker(puppyId);
  
  const isLoading = puppyQuery.isLoading || isExpLoading;
  const error = puppyQuery.error || expError;
  const puppy = puppyQuery.data;
  
  const handleAddExperience = (data: {
    category_id: string;
    experience: string;
    experience_date: Date | string; // Accept either Date or string
    reaction?: string;
    notes?: string;
  }) => {
    // Convert Date to string if it's a Date object
    const formattedData = {
      category_id: data.category_id,
      experience: data.experience,
      experience_date: data.experience_date instanceof Date 
        ? data.experience_date.toISOString().split('T')[0] 
        : data.experience_date,
      reaction: data.reaction,
      notes: data.notes
    };
    
    addExperience(formattedData);
    setIsDialogOpen(false);
  };
  
  if (isLoading) {
    return <LoadingState message="Loading socialization data..." />;
  }
  
  if (error || !puppy) {
    return <ErrorState title="Error" message="Failed to load puppy information." />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{puppy.name || 'Puppy'} Socialization Tracking</h2>
          <p className="text-muted-foreground">
            Log and track important socialization experiences
          </p>
        </div>
        
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Log Experience
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="experiences" className="flex items-center gap-1">
            <UserCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Experiences</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Categories</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-1">
            <LineChart className="h-4 w-4" />
            <span className="hidden sm:inline">Progress</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="experiences">
          <SocializationExperiencesList 
            experiences={experiences}
            categories={categories}
            reactions={reactions}
            onDelete={deleteExperience}
            onAdd={() => setIsDialogOpen(true)}
          />
        </TabsContent>
        
        <TabsContent value="categories">
          <SocializationCategoryList 
            categories={categories}
            progress={progress}
            onAddExperience={() => setIsDialogOpen(true)}
          />
        </TabsContent>
        
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Socialization Progress</CardTitle>
              <CardDescription>
                Track progress across all socialization categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SocializationProgressChart 
                progress={progress} 
                categories={categories}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Log Socialization Experience</DialogTitle>
            <DialogDescription>
              Record a new socialization experience for {puppy.name || 'this puppy'}.
            </DialogDescription>
          </DialogHeader>
          
          <SocializationLogForm 
            puppyId={puppyId}
            categories={categories}
            reactions={reactions}
            onSubmit={handleAddExperience}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SocializationDashboard;
