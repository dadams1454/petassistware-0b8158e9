
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RefreshCw, Paw, AlertCircle } from 'lucide-react';
import { usePuppyTracking } from '@/hooks/usePuppyTracking';
import { PuppyAgeGroup } from '@/types/puppyTracking';
import PuppyAgeGroupSection from './PuppyAgeGroupSection';
import { Skeleton } from '@/components/ui/skeleton';

interface PuppiesTabProps {
  onRefresh?: () => void;
}

const PuppiesTab: React.FC<PuppiesTabProps> = ({ onRefresh }) => {
  const { 
    puppiesByAgeGroup, 
    ageGroups,
    isLoading, 
    error, 
    refetch 
  } = usePuppyTracking();
  
  const [activeGroup, setActiveGroup] = useState<PuppyAgeGroup>('first24hours');
  
  const handleRefresh = () => {
    refetch();
    if (onRefresh) onRefresh();
  };
  
  const totalPuppies = Object.values(puppiesByAgeGroup).flat().length;
  
  // Get counts for each age group for the tabs
  const getGroupCount = (groupId: PuppyAgeGroup) => {
    return puppiesByAgeGroup[groupId]?.length || 0;
  };
  
  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      );
    }
    
    if (error) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-medium">Error Loading Puppies</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleRefresh}>Retry</Button>
          </CardContent>
        </Card>
      );
    }
    
    if (totalPuppies === 0) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <Paw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No Puppies Found</h3>
            <p className="text-muted-foreground mb-4">
              There are no puppies currently tracked in the system.
            </p>
            <Button onClick={handleRefresh}>Refresh</Button>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <Tabs 
        value={activeGroup} 
        onValueChange={(value) => setActiveGroup(value as PuppyAgeGroup)}
        className="w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <ScrollArea className="w-[80%]">
            <TabsList className="w-full flex">
              {ageGroups.map(group => (
                <TabsTrigger 
                  key={group.id} 
                  value={group.id}
                  disabled={getGroupCount(group.id) === 0}
                  className="flex flex-col items-center px-4 py-2 relative"
                >
                  <span>{group.label}</span>
                  {getGroupCount(group.id) > 0 && (
                    <span className="text-xs px-1.5 py-0.5 bg-primary/10 rounded-full mt-1">
                      {getGroupCount(group.id)}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="ml-2"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
        
        {ageGroups.map(group => (
          <TabsContent key={group.id} value={group.id} className="mt-0">
            <PuppyAgeGroupSection 
              ageGroup={group}
              puppies={puppiesByAgeGroup[group.id] || []}
              onRefresh={handleRefresh}
            />
          </TabsContent>
        ))}
      </Tabs>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Puppy Development Tracker</h2>
      </div>
      
      {renderTabContent()}
    </div>
  );
};

export default PuppiesTab;
