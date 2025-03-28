
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Baby, AlertCircle } from 'lucide-react';
import { EmptyState } from '@/components/ui/standardized';
import { usePuppyTracking } from './hooks/usePuppyTracking';
import PuppyAgeGroupSection from './PuppyAgeGroupSection';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PuppiesTabProps {
  onRefresh: () => void;
}

const PuppiesTab: React.FC<PuppiesTabProps> = ({ onRefresh }) => {
  const { 
    puppies, 
    ageGroups, 
    isLoading, 
    error 
  } = usePuppyTracking();

  // Create sections for each age group with puppies
  const puppiesByAgeGroup = useMemo(() => {
    if (!puppies) return [];
    
    return ageGroups.map(ageGroup => {
      const puppiesInGroup = puppies.filter(puppy => 
        puppy.ageInDays >= ageGroup.startDay && 
        puppy.ageInDays <= ageGroup.endDay
      );
      
      return {
        ageGroup,
        puppies: puppiesInGroup
      };
    }).filter(group => group.puppies.length > 0);
  }, [puppies, ageGroups]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load puppy data. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!puppies || puppies.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <EmptyState
            icon={<Baby className="h-12 w-12 text-muted-foreground" />}
            title="No Puppies Found"
            description="There are no active litters with puppies in the system."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {puppiesByAgeGroup.map(({ ageGroup, puppies }) => (
        <PuppyAgeGroupSection
          key={ageGroup.id}
          ageGroup={ageGroup}
          puppies={puppies}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
};

export default PuppiesTab;
