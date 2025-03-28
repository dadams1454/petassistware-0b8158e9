
import React, { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Baby, AlertCircle } from 'lucide-react';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/standardized';
import { usePuppyTracking } from '../../../../../hooks/usePuppyTracking';
import PuppyAgeGroupSection from './PuppyAgeGroupSection';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import PuppyStatCards from './components/PuppyStatCards';

interface PuppiesTabProps {
  onRefresh: () => void;
}

const PuppiesTab: React.FC<PuppiesTabProps> = ({ onRefresh }) => {
  const { 
    puppies, 
    ageGroups, 
    puppiesByAgeGroup,
    puppyStats,
    isLoading, 
    error 
  } = usePuppyTracking();
  
  const navigate = useNavigate();
  
  const handleNavigateToLitters = useCallback(() => {
    navigate('/litters');
  }, [navigate]);

  if (isLoading) {
    return (
      <LoadingState 
        message="Loading puppy data..." 
        showSkeleton={true}
        skeletonVariant="card"
        skeletonCount={3}
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Puppies"
        message="We couldn't load the puppy data. Please try again."
        onRetry={onRefresh}
        actionLabel="Try Again"
      />
    );
  }

  // No puppies case
  if (!puppies || puppies.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <EmptyState
            icon={<Baby className="h-12 w-12 text-muted-foreground" />}
            title="No Puppies Found"
            description="There are no active litters with puppies in the system."
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
    <div className="space-y-6">
      {/* Stats cards */}
      <PuppyStatCards stats={puppyStats} />
      
      {/* Age group sections */}
      {Object.entries(puppiesByAgeGroup).map(([groupId, puppiesInGroup]) => {
        if (puppiesInGroup.length === 0) return null;
        
        const ageGroup = ageGroups.find(group => group.id === groupId);
        if (!ageGroup) return null;
        
        return (
          <PuppyAgeGroupSection
            key={ageGroup.id}
            ageGroup={ageGroup}
            puppies={puppiesInGroup}
            onRefresh={onRefresh}
          />
        );
      })}
    </div>
  );
};

export default PuppiesTab;
