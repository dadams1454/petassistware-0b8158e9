
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ViewIcon, LayoutGrid, LayoutList, Plus } from 'lucide-react';
import PuppyTableView from './table/PuppyTableView';
import PuppyCardView from './card/PuppyCardView';
import PuppyFilters from './filters/PuppyFilters';

interface PuppiesTableProps {
  puppies: Puppy[];
  onEditPuppy: (puppy: Puppy) => void;
  onDeletePuppy: (puppy: Puppy) => void;
  onAddPuppy?: () => void;
}

const PuppiesTable: React.FC<PuppiesTableProps> = ({ 
  puppies, 
  onEditPuppy, 
  onDeletePuppy,
  onAddPuppy
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card');
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
      <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed border-muted-foreground/50">
        <p className="text-muted-foreground mb-4">
          No puppies have been added to this litter yet.
        </p>
        {onAddPuppy && (
          <Button 
            onClick={onAddPuppy} 
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add First Puppy
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Bar - Filters & View Toggle */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center bg-muted/10 p-4 rounded-lg">
        <div className="flex items-center gap-3 w-full justify-between sm:justify-start sm:w-auto">
          {/* Results Count */}
          <div className="text-sm font-medium">
            Showing {filteredPuppies.length} of {puppies.length} puppies
          </div>
          
          {/* Add Puppy Button */}
          {onAddPuppy && (
            <Button 
              onClick={onAddPuppy} 
              size="sm"
              className="gap-1.5 whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              Add Puppy
            </Button>
          )}
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground mr-2">View:</span>
          <div className="bg-muted/20 rounded-md p-1 flex">
            <Button 
              variant={viewMode === 'card' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('card')}
              className="h-8 px-2"
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Cards</span>
            </Button>
            <Button 
              variant={viewMode === 'table' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('table')}
              className="h-8 px-2"
            >
              <LayoutList className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Table</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-card p-4 rounded-lg border shadow-sm">
        <PuppyFilters 
          filters={filters} 
          onFilterChange={handleFilterChange}
          availableColors={availableColors}
        />
      </div>
      
      {/* Content Section */}
      <div className="mt-6">
        {filteredPuppies.length > 0 ? (
          <>
            {/* Display based on view mode */}
            {viewMode === 'table' ? (
              <div className="rounded-lg border overflow-hidden">
                <PuppyTableView 
                  puppies={filteredPuppies} 
                  onEditPuppy={onEditPuppy} 
                  onDeletePuppy={onDeletePuppy} 
                />
              </div>
            ) : (
              <PuppyCardView 
                puppies={filteredPuppies} 
                onEditPuppy={onEditPuppy} 
                onDeletePuppy={onDeletePuppy} 
              />
            )}
          </>
        ) : (
          <div className="text-center py-8 bg-muted/20 rounded-lg border">
            <p className="text-muted-foreground mb-4">No puppies match your filters</p>
            {onAddPuppy && (
              <Button 
                onClick={onAddPuppy} 
                variant="outline"
                className="gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Add New Puppy
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PuppiesTable;
