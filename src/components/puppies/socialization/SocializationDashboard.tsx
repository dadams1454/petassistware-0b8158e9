
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
import { usePuppySocialization } from '@/hooks/usePuppySocialization';
import { LoadingState, ErrorState } from '@/components/ui/standardized';
import SocializationLogForm from './SocializationLogForm';
import SocializationExperiencesList from './SocializationExperiencesList';
import SocializationProgressChart from './SocializationProgressChart';
import SocializationCategoryList from './SocializationCategoryList';
import { SOCIALIZATION_CATEGORIES, SOCIALIZATION_REACTIONS } from '@/data/socializationCategories';

interface SocializationDashboardProps {
  puppyId: string;
}

const SocializationDashboard: React.FC<SocializationDashboardProps> = ({ puppyId }) => {
  const [activeTab, setActiveTab] = useState('experiences');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const puppyQuery = usePuppyDetail(puppyId);
  const { 
    experiences, 
    isLoading,
    error,
    addExperience,
    refreshExperiences,
    deleteExperience
  } = usePuppySocialization(puppyId);
  
  const puppy = puppyQuery.data;
  
  // For now, we'll use the predefined categories and reactions
  const categories = SOCIALIZATION_CATEGORIES;
  const reactions = SOCIALIZATION_REACTIONS;
  
  // Calculate progress
  const progress = React.useMemo(() => {
    return categories.map(category => {
      const categoryExperiences = experiences.filter(exp => exp.category_id === category.id);
      const targetCount = 10; // Default target, adjust based on age
      const count = categoryExperiences.length;
      const completionPercentage = Math.min(Math.round((count / targetCount) * 100), 100);
      
      return {
        categoryId: category.id,
        categoryName: category.name,
        count,
        target: targetCount,
        completionPercentage
      };
    });
  }, [categories, experiences]);
  
  const handleAddExperience = (data: {
    category_id: string;
    experience: string;
    experience_date: string;
    reaction?: string;
    notes?: string;
  }) => {
    addExperience(data);
    setIsDialogOpen(false);
  };
  
  if (puppyQuery.isLoading || isLoading) {
    return <LoadingState message="Loading socialization data..." />;
  }
  
  if (puppyQuery.error || error || !puppy) {
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
