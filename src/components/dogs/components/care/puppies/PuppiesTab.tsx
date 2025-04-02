
import React, { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Baby, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { usePuppyTracking } from './hooks/usePuppyTracking';
import { PuppyWithAge, PuppyAgeGroupData } from '@/types/puppyTracking';
import PuppyAgeGroupSection from './PuppyAgeGroupSection';

interface PuppiesTabProps {
  onRefresh: () => void;
}

// Placeholder component until real implementation is ready
const PuppyStatCards = ({ stats }: { stats: any }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <Card>
      <CardContent className="pt-6">
        <p>Total Puppies: {stats.totalPuppies}</p>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="pt-6">
        <p>Available: {stats.availablePuppies}</p>
      </CardContent>
    </Card>
  </div>
);

const PuppiesTab: React.FC<PuppiesTabProps> = ({ onRefresh }) => {
  const { 
    stats, 
    puppies = [], 
    ageGroups = [], 
    puppiesByAgeGroup = {},
    isLoading, 
    error 
  } = usePuppyTracking();
  
  const puppyStats = stats;
  const navigate = useNavigate();
  
  const handleNavigateToLitters = useCallback(() => {
    navigate('/litters');
  }, [navigate]);

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
              <Button onClick={onRefresh} variant="default">Try Again</Button>
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

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <PuppyStatCards stats={puppyStats} />
      
      {/* Age group sections */}
      {Object.entries(puppiesByAgeGroup).map(([groupId, puppiesInGroup]) => {
        if (!Array.isArray(puppiesInGroup) || puppiesInGroup.length === 0) return null;
        
        const ageGroup = ageGroups && typeof ageGroups === 'object' && 'find' in ageGroups ? 
          ageGroups.find((group: PuppyAgeGroupData) => group.id === groupId) : 
          null;
        
        if (!ageGroup) return null;
        
        return (
          <PuppyAgeGroupSection
            key={ageGroup.id}
            ageGroup={ageGroup}
            puppies={puppiesInGroup as PuppyWithAge[]}
            onRefresh={onRefresh}
          />
        );
      })}
    </div>
  );
};

export default PuppiesTab;
