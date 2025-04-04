
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Baby, Search, Filter } from 'lucide-react';
import { usePuppyTracking } from '@/hooks/puppies/usePuppyTracking';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PuppyAgeGroupList from './puppies/PuppyAgeGroupList';
import PuppyStatCards from './puppies/PuppyStatCards';
import { PuppyManagementStats, PuppyWithAge, PuppyAgeGroup } from '@/types/puppyTracking';
import { LoadingState, ErrorState } from '@/components/ui/standardized';

interface PuppiesTabProps {
  onRefresh?: () => void;
}

const PuppiesTab: React.FC<PuppiesTabProps> = ({ onRefresh }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [ageGroupFilter, setAgeGroupFilter] = useState('all');
  
  // Get puppy tracking data
  const trackingData = usePuppyTracking();
  
  const { 
    puppies = [], 
    puppiesByAgeGroup, 
    ageGroups, 
    totalPuppies,
    availablePuppies,
    reservedPuppies,
    soldPuppies,
    isLoading, 
    error 
  } = trackingData;
  
  // Calculate gender counts properly
  const maleCount = puppies?.filter(p => p.gender?.toLowerCase() === 'male').length || 0;
  const femaleCount = puppies?.filter(p => p.gender?.toLowerCase() === 'female').length || 0;
  const unknownCount = (puppies?.length || 0) - maleCount - femaleCount;
  
  // Filter puppies based on search term and age group
  const filteredPuppiesByAgeGroup = React.useMemo(() => {
    if (!puppiesByAgeGroup) return {} as Record<string, PuppyWithAge[]>;
    
    if (ageGroupFilter === 'all') {
      // Filter all puppies by search term only
      if (!searchTerm) return puppiesByAgeGroup;
      
      // Apply search filter to all age groups
      const filtered: Record<string, PuppyWithAge[]> = {};
      Object.keys(puppiesByAgeGroup).forEach(groupId => {
        filtered[groupId] = (puppiesByAgeGroup[groupId] || []).filter(puppy => 
          puppy.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          puppy.color?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      return filtered;
    } else {
      // Only include the selected age group
      const filtered: Record<string, PuppyWithAge[]> = {};
      filtered[ageGroupFilter] = (puppiesByAgeGroup[ageGroupFilter] || []).filter(puppy => 
        !searchTerm || 
        puppy.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        puppy.color?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return filtered;
    }
  }, [puppiesByAgeGroup, searchTerm, ageGroupFilter]);
  
  // Create stats object for PuppyStatCards with proper type
  const stats: PuppyManagementStats = {
    puppies,
    puppiesByAgeGroup: puppiesByAgeGroup || {} as Record<string, PuppyWithAge[]>,
    ageGroups: ageGroups || [],
    totalPuppies,
    availablePuppies,
    reservedPuppies,
    soldPuppies,
    isLoading,
    error,
    activeCount: totalPuppies,
    availableCount: availablePuppies || 0,
    reservedCount: reservedPuppies || 0,
    soldCount: soldPuppies || 0,
    currentWeek: Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)),
    byAgeGroup: {
      newborn: [],
      twoWeek: [],
      fourWeek: [],
      sixWeek: [],
      eightWeek: [],
      tenWeek: [],
      twelveWeek: [],
      older: [],
      all: []
    },
    total: {
      count: totalPuppies,
      male: maleCount,
      female: femaleCount
    },
    byGender: {
      male: maleCount,
      female: femaleCount,
      unknown: unknownCount
    },
    byStatus: {
      available: availablePuppies || 0,
      reserved: reservedPuppies || 0,
      sold: soldPuppies || 0,
      unavailable: puppies.filter(p => p.status?.toLowerCase() === 'unavailable').length || 0
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <LoadingState message="Loading puppy information..." />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <ErrorState 
            title="Error loading puppies" 
            message="There was an error loading the puppy data. Please try again later."
            actionLabel="Try again"
            onAction={onRefresh}
          />
        </CardContent>
      </Card>
    );
  }

  if (puppies.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
            <Baby className="h-6 w-6 text-pink-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Puppies Yet</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            You don't have any puppies in your system yet. Create a litter to start tracking puppies.
          </p>
          <Button onClick={() => navigate("/litters")}>Go to Litters</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="py-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Puppy Management</h3>
            <Button onClick={() => navigate("/litters")}>
              Go to Litters
            </Button>
          </div>
          
          <PuppyStatCards stats={stats} />
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search puppies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={ageGroupFilter} onValueChange={setAgeGroupFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Age Groups" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Age Groups</SelectItem>
                {ageGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <PuppyAgeGroupList 
            puppiesByAgeGroup={filteredPuppiesByAgeGroup} 
            ageGroups={ageGroups} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PuppiesTab;
