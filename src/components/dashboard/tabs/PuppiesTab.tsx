import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Baby, PlusCircle, RefreshCw, Filter } from 'lucide-react';
import { usePuppyTracking } from '@/hooks/usePuppyTracking';
import { useNavigate } from 'react-router-dom';
import { EmptyState, LoadingState, ErrorState, SectionHeader } from '@/components/ui/standardized';
import PuppyAgeGroupList from './puppies/PuppyAgeGroupList';
import { PuppyManagementStats } from '@/types/puppyTracking';
import PuppyStatCards from './puppies/PuppyStatCards';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface PuppiesTabProps {
  onRefresh?: () => void;
}

const PuppiesTab: React.FC<PuppiesTabProps> = ({ onRefresh }) => {
  const navigate = useNavigate();
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const { 
    puppiesByAgeGroup, 
    ageGroups, 
    isLoading, 
    error,
    puppyStats
  } = usePuppyTracking();

  const hasAnyPuppies = Object.values(puppiesByAgeGroup).some(group => group.length > 0);
  const totalPuppies = Object.values(puppiesByAgeGroup).reduce(
    (sum, group) => sum + group.length, 0
  );

  const handleNavigateToLitters = () => {
    navigate('/litters');
  };

  if (isLoading) {
    return <LoadingState message="Loading puppy information..." />;
  }

  if (error) {
    return (
      <ErrorState 
        title="Error Loading Puppies" 
        message={error} 
        onRetry={onRefresh}
      />
    );
  }

  if (!hasAnyPuppies) {
    return (
      <Card>
        <CardContent className="pt-6">
          <EmptyState
            icon={<Baby className="h-12 w-12 text-muted-foreground" />}
            title="No Puppies Found"
            description="There are no active litters with puppies in the system. Add a litter first, then you can add puppies to it."
            action={{
              label: "Manage Litters",
              onClick: handleNavigateToLitters
            }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <SectionHeader
            title="Puppy Management"
            description={`Tracking ${totalPuppies} ${totalPuppies === 1 ? 'puppy' : 'puppies'} across different developmental stages`}
          />
        </div>
        <div className="flex gap-2">
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Puppies</SheetTitle>
                <SheetDescription>
                  Filter puppies by various criteria
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                {/* Filter options would go here */}
                <p className="text-sm text-muted-foreground">Filter options coming soon</p>
              </div>
            </SheetContent>
          </Sheet>
          
          <Button variant="outline" size="sm" onClick={onRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          
          <Button onClick={handleNavigateToLitters} size="sm" className="gap-2">
            <PlusCircle className="h-4 w-4" /> Add Litter
          </Button>
        </div>
      </div>

      {puppyStats && (
        <PuppyStatCards stats={puppyStats} />
      )}

      <PuppyAgeGroupList 
        puppiesByAgeGroup={puppiesByAgeGroup} 
        ageGroups={ageGroups} 
      />
    </div>
  );
};

export default PuppiesTab;
