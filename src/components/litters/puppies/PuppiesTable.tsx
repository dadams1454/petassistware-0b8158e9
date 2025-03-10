
import React, { useState, useMemo } from 'react';
import PuppyTableView from './table/PuppyTableView';
import PuppyCardView from './card/PuppyCardView';
import PuppyFilters from './filters/PuppyFilters';

interface PuppiesTableProps {
  puppies: Puppy[];
  onEditPuppy: (puppy: Puppy) => void;
  onDeletePuppy: (puppy: Puppy) => void;
}

const PuppiesTable: React.FC<PuppiesTableProps> = ({ 
  puppies, 
  onEditPuppy, 
  onDeletePuppy 
}) => {
  const [filters, setFilters] = useState({
    search: '',
    status: [] as string[],
    gender: [] as string[],
    color: [] as string[],
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Extract unique colors from puppies
  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    puppies.forEach(puppy => {
      if (puppy.color) {
        colors.add(puppy.color);
      }
    });
    return Array.from(colors);
  }, [puppies]);

  // Filter puppies based on current filters
  const filteredPuppies = useMemo(() => {
    return puppies.filter(puppy => {
      // Filter by search text
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        !filters.search ||
        (puppy.name && puppy.name.toLowerCase().includes(searchLower)) ||
        (puppy.color && puppy.color.toLowerCase().includes(searchLower)) ||
        (puppy.microchip_number && puppy.microchip_number.toLowerCase().includes(searchLower));
      
      // Filter by status
      const matchesStatus = 
        filters.status.length === 0 || 
        (puppy.status && filters.status.includes(puppy.status));
      
      // Filter by gender
      const matchesGender = 
        filters.gender.length === 0 || 
        (puppy.gender && filters.gender.includes(puppy.gender));
      
      // Filter by color
      const matchesColor = 
        filters.color.length === 0 || 
        (puppy.color && filters.color.includes(puppy.color));
      
      return matchesSearch && matchesStatus && matchesGender && matchesColor;
    });
  }, [puppies, filters]);

  if (puppies.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No puppies have been added to this litter yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      <PuppyFilters 
        filters={filters} 
        onFilterChange={handleFilterChange}
        availableColors={availableColors}
      />

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredPuppies.length} of {puppies.length} puppies
      </div>
      
      {/* Desktop View - Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border">
        <PuppyTableView 
          puppies={filteredPuppies} 
          onEditPuppy={onEditPuppy} 
          onDeletePuppy={onDeletePuppy} 
        />
      </div>
      
      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-4">
        {filteredPuppies.length > 0 ? (
          <PuppyCardView 
            puppies={filteredPuppies} 
            onEditPuppy={onEditPuppy} 
            onDeletePuppy={onDeletePuppy} 
          />
        ) : (
          <div className="text-center py-4 border rounded-md">
            <p className="text-muted-foreground">No puppies match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PuppiesTable;
