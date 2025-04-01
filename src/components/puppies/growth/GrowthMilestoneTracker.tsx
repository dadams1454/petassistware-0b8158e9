
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsList, TabsTrigger, Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Check, Clock, Calendar, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { usePuppyMilestones } from '@/hooks/usePuppyMilestones'; 
import { LoadingState, EmptyState } from '@/components/ui/standardized';
import AddMilestoneDialog from './AddMilestoneDialog';
import { PuppyMilestone } from '@/types/puppyTracking';

interface GrowthMilestoneTrackerProps {
  puppyId: string;
}

const GrowthMilestoneTracker: React.FC<GrowthMilestoneTrackerProps> = ({ puppyId }) => {
  const [activeTab, setActiveTab] = useState<'physical' | 'health' | 'behavioral'>('physical');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { 
    milestones, 
    completedMilestones,
    upcomingMilestones,
    overdueMilestones,
    isLoading, 
    markComplete 
  } = usePuppyMilestones(puppyId);
  
  if (isLoading) {
    return <LoadingState message="Loading milestone data..." />;
  }
  
  const getCategoryMilestones = (category: 'physical' | 'health' | 'behavioral'): PuppyMilestone[] => {
    return milestones.filter(m => m.category === category);
  };
  
  const getFilteredMilestones = (category: 'physical' | 'health' | 'behavioral') => {
    // Filter all milestone types by the selected category
    const categoryMilestones = getCategoryMilestones(category);
    
    if (categoryMilestones.length === 0) {
      return (
        <EmptyState 
          title={`No ${category} milestones`}
          description={`No ${category} milestones have been set for this puppy.`}
          action={{
            label: "Add Milestone",
            onClick: () => setDialogOpen(true)
          }}
        />
      );
    }
    
    return (
      <div className="space-y-4">
        {overdueMilestones.filter(m => m.category === category).length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              Overdue
            </h3>
            {renderMilestoneList(overdueMilestones.filter(m => m.category === category), 'overdue')}
          </div>
        )}
        
        {upcomingMilestones.filter(m => m.category === category).length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              Upcoming
            </h3>
            {renderMilestoneList(upcomingMilestones.filter(m => m.category === category), 'upcoming')}
          </div>
        )}
        
        {completedMilestones.filter(m => m.category === category).length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Completed
            </h3>
            {renderMilestoneList(completedMilestones.filter(m => m.category === category), 'completed')}
          </div>
        )}
      </div>
    );
  };
  
  const renderMilestoneList = (milestoneList: PuppyMilestone[], type: 'overdue' | 'upcoming' | 'completed') => {
    const getCardStyle = () => {
      switch (type) {
        case 'overdue':
          return 'border-destructive/20 bg-destructive/5';
        case 'upcoming':
          return 'border-amber-500/20 bg-amber-500/5';
        case 'completed':
          return 'border-green-500/20 bg-green-500/5';
        default:
          return '';
      }
    };
    
    return (
      <div className="space-y-2">
        {milestoneList.map((milestone) => (
          <div 
            key={milestone.id} 
            className={`border rounded-lg p-3 flex justify-between items-center ${getCardStyle()}`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{milestone.title}</span>
                <Badge variant="outline" className="text-xs">
                  {milestone.expected_age_days ? `Day ${milestone.expected_age_days}` : 'Custom'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
              {milestone.completion_date && (
                <div className="text-xs mt-1 flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Completed on {new Date(milestone.completion_date).toLocaleDateString()}
                </div>
              )}
            </div>
            
            {!milestone.completion_date && (
              <Button 
                size="sm" 
                variant={type === 'overdue' ? 'destructive' : 'default'}
                onClick={() => markComplete(milestone.id)}
              >
                <Check className="h-4 w-4 mr-1" />
                Complete
              </Button>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-md">Growth & Development Milestones</CardTitle>
            <Button size="sm" onClick={() => setDialogOpen(true)}>Add Milestone</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="physical">Physical</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
            </TabsList>
            
            <TabsContent value="physical" className="pt-4">
              {getFilteredMilestones('physical')}
            </TabsContent>
            
            <TabsContent value="health" className="pt-4">
              {getFilteredMilestones('health')}
            </TabsContent>
            
            <TabsContent value="behavioral" className="pt-4">
              {getFilteredMilestones('behavioral')}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <AddMilestoneDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        puppyId={puppyId}
      />
    </div>
  );
};

export default GrowthMilestoneTracker;
