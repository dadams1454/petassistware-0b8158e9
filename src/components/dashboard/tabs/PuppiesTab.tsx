
import React, { useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Baby } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { usePuppyTracking } from '@/modules/puppies';
import PuppyAgeGroupList from './puppies/PuppyAgeGroupList';
import PuppyStatCards from './puppies/PuppyStatCards';

interface PuppiesTabProps {
  onRefresh?: () => void;
}

const PuppiesTab: React.FC<PuppiesTabProps> = ({ onRefresh }) => {
  const { 
    puppies = [], 
    ageGroups = [], 
    puppiesByAgeGroup = {},
    totalPuppies = 0,
    availablePuppies = 0,
    reservedPuppies = 0,
    soldPuppies = 0,
    maleCount = 0,
    femaleCount = 0,
    puppiesByStatus = {},
    isLoading, 
    error,
    refetch,
    byAgeGroup = {
      newborn: [],
      twoWeek: [],
      fourWeek: [],
      sixWeek: [], 
      eightWeek: [],
      tenWeek: [],
      twelveWeek: [],
      older: [],
      all: [],
      total: 0
    },
    byGender = { 
      male: 0, 
      female: 0, 
      unknown: 0 
    },
    byStatus = {
      available: 0,
      reserved: 0,
      sold: 0,
      unavailable: 0
    }
  } = usePuppyTracking();
  
  const navigate = useNavigate();
  
  const handleNavigateToLitters = useCallback(() => {
    navigate('/litters');
  }, [navigate]);
  
  const handleRefresh = useCallback(() => {
    if (refetch) {
      refetch();
    }
    if (onRefresh) {
      onRefresh();
    }
  }, [refetch, onRefresh]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-xl font-semibold mb-2">Failed to Load Puppies</h3>
              <p className="text-muted-foreground mb-4">We couldn't load the puppy data. Please try again.</p>
              <Button onClick={handleRefresh} variant="default">Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No puppies case
  if (!puppies || puppies.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Baby className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Puppies Found</h3>
            <p className="text-muted-foreground mb-4">
              There are no active litters with puppies in the system.
            </p>
            <Button onClick={handleNavigateToLitters}>Manage Litters</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Complete stats object with all required properties from PuppyManagementStats
  const stats = {
    puppies,
    ageGroups,
    puppiesByAgeGroup,
    byAgeGroup,
    totalPuppies,
    availablePuppies,
    reservedPuppies,
    soldPuppies,
    maleCount,
    femaleCount,
    puppiesByStatus,
    byGender,
    byStatus,
    activeCount: availablePuppies,
    reservedCount: reservedPuppies,
    availableCount: availablePuppies,
    soldCount: soldPuppies,
    currentWeek: 0,
    isLoading: false,
    error: null,
    refetch: handleRefresh
  };

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <PuppyStatCards stats={stats} />
      
      {/* Age group sections */}
      <PuppyAgeGroupList 
        puppiesByAgeGroup={puppiesByAgeGroup}
        ageGroups={ageGroups}
      />
    </div>
  );
};

export default PuppiesTab;
