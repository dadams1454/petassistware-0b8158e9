
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Baby, PlusCircle, RefreshCw } from 'lucide-react';
import { usePuppyTracking } from '@/hooks/usePuppyTracking';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '@/components/ui/standardized';
import PuppyAgeGroupList from './puppies/PuppyAgeGroupList';

interface PuppiesTabProps {
  onRefresh?: () => void;
}

const PuppiesTab: React.FC<PuppiesTabProps> = ({ onRefresh }) => {
  const navigate = useNavigate();
  const { 
    puppiesByAgeGroup, 
    ageGroups, 
    isLoading, 
    error 
  } = usePuppyTracking();

  const hasAnyPuppies = Object.values(puppiesByAgeGroup).some(group => group.length > 0);
  const totalPuppies = Object.values(puppiesByAgeGroup).reduce(
    (sum, group) => sum + group.length, 0
  );

  const handleNavigateToLitters = () => {
    navigate('/litters');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="text-red-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Error Loading Puppies</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={onRefresh} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" /> Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasAnyPuppies) {
    return (
      <div className="space-y-4">
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
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Puppy Management</h2>
          <p className="text-muted-foreground">
            Tracking {totalPuppies} {totalPuppies === 1 ? 'puppy' : 'puppies'} across different developmental stages
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button onClick={handleNavigateToLitters} className="gap-2">
            <PlusCircle className="h-4 w-4" /> Add Litter
          </Button>
        </div>
      </div>

      <PuppyAgeGroupList 
        puppiesByAgeGroup={puppiesByAgeGroup} 
        ageGroups={ageGroups} 
      />
    </div>
  );
};

export default PuppiesTab;
