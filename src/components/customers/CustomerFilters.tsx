
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CustomerFilter, SortField, SortOrder } from '@/pages/Customers';
import { ArrowDownAZ, ArrowUpAZ, Calendar, CalendarDays, Users } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface CustomerFiltersProps {
  filters: CustomerFilter;
  onFiltersChange: (filters: CustomerFilter) => void;
  sort: { field: SortField; order: SortOrder };
  onSortChange: (sort: { field: SortField; order: SortOrder }) => void;
}

const CustomerFilters: React.FC<CustomerFiltersProps> = ({
  filters,
  onFiltersChange,
  sort,
  onSortChange
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Customer Type Filter */}
          <div className="flex-1">
            <Label htmlFor="customer-type" className="block mb-2">Customer Type</Label>
            <Select
              value={filters.type}
              onValueChange={(value: 'all' | 'new' | 'returning') => {
                onFiltersChange({ ...filters, type: value });
              }}
            >
              <SelectTrigger id="customer-type" className="w-full">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="new">New Customers</SelectItem>
                <SelectItem value="returning">Returning Customers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Puppy Interest Filter */}
          <div className="flex-1">
            <Label htmlFor="puppy-interest" className="block mb-2">Puppy Interest</Label>
            <Select
              value={filters.interestedInPuppies === null ? 'all' : filters.interestedInPuppies ? 'yes' : 'no'}
              onValueChange={(value) => {
                const interestedInPuppies = value === 'all' ? null : value === 'yes';
                onFiltersChange({ ...filters, interestedInPuppies });
              }}
            >
              <SelectTrigger id="puppy-interest" className="w-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="yes">Interested in Puppies</SelectItem>
                <SelectItem value="no">Not Interested in Puppies</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator className="md:h-10 md:w-[1px] w-full h-[1px]" orientation="vertical" />

          {/* Sorting Controls */}
          <div className="flex-1">
            <Label className="block mb-2">Sort By</Label>
            <div className="flex gap-2">
              <ToggleGroup 
                type="single" 
                value={sort.field}
                onValueChange={(value: SortField) => {
                  if (value) onSortChange({ ...sort, field: value });
                }}
                className="justify-start"
              >
                <ToggleGroupItem value="name" aria-label="Sort by name">
                  <Users className="h-4 w-4 mr-1" />
                  Name
                </ToggleGroupItem>
                <ToggleGroupItem value="date" aria-label="Sort by date">
                  <CalendarDays className="h-4 w-4 mr-1" />
                  Date
                </ToggleGroupItem>
              </ToggleGroup>

              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  onSortChange({
                    ...sort,
                    order: sort.order === 'asc' ? 'desc' : 'asc'
                  });
                }}
                className="ml-2"
              >
                {sort.order === 'asc' ? (
                  <ArrowUpAZ className="h-4 w-4" />
                ) : (
                  <ArrowDownAZ className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Reset Filters Button */}
          <div className="flex items-end justify-end md:justify-start">
            <Button
              variant="ghost"
              onClick={() => {
                onFiltersChange({ type: 'all', interestedInPuppies: null });
                onSortChange({ field: 'name', order: 'asc' });
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerFilters;
