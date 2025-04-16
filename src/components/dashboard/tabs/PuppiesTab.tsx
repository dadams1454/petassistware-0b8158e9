
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PuppyAgeGroup, PuppyWithAge } from '@/modules/puppies/types';
import { usePuppyTracking } from '@/modules/puppies/hooks/usePuppyTracking';
import PuppyAgeGroupSection from '@/components/dogs/components/care/puppies/PuppyAgeGroupSection';
import { Skeleton } from '@/components/ui/skeleton';

interface PuppiesTabProps {
  onRefresh?: () => void;
}

const PuppiesTab: React.FC<PuppiesTabProps> = ({ onRefresh }) => {
  const navigate = useNavigate();
  const puppyStats = usePuppyTracking();
  
  // Extract properties with fallbacks to handle potential undefined values
  const allPuppies = puppyStats.allPuppies || puppyStats.puppies || [];
  const ageGroups = puppyStats.ageGroups || [];
  const byAgeGroup = puppyStats.byAgeGroup || {};
  const totalPuppies = puppyStats.totalPuppies || 0;
  const isLoading = puppyStats.isLoading || puppyStats.loading || false;
  
  // Add a loading state until puppy data is available
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setLocalLoading(false);
    }
  }, [isLoading]);

  const handleAddPuppy = () => {
    navigate('/puppies/new');
  };

  const handlePuppyClick = (puppyId: string) => {
    navigate(`/puppies/${puppyId}`);
  };

  if (localLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-9 w-32" />
        </div>
        
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  if (!allPuppies || allPuppies.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No Puppies Found</h3>
        <p className="text-muted-foreground mb-6">
          Start tracking puppies by adding your first puppy.
        </p>
        <Button onClick={handleAddPuppy}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add First Puppy
        </Button>
      </div>
    );
  }

  // Sort age groups by their sort_order property
  const sortedAgeGroups = [...ageGroups].sort((a, b) => {
    // Ensure sort_order exists, fallback to 0 if it doesn't
    const sortOrderA = a.sort_order !== undefined ? a.sort_order : 0;
    const sortOrderB = b.sort_order !== undefined ? b.sort_order : 0;
    return sortOrderA - sortOrderB;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          Puppies ({totalPuppies})
        </h3>
        <Button onClick={handleAddPuppy}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Puppy
        </Button>
      </div>

      {sortedAgeGroups.map((ageGroup: PuppyAgeGroup) => (
        <PuppyAgeGroupSection
          key={ageGroup.id}
          name={ageGroup.name}
          description={ageGroup.description}
          puppies={byAgeGroup[ageGroup.id] || []}
          onPuppyClick={handlePuppyClick}
          emptyState={
            <div className="text-center py-6">
              <p className="text-muted-foreground">No puppies in this age group</p>
            </div>
          }
        />
      ))}
    </div>
  );
};

export default PuppiesTab;
