
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export interface AuditLogFilters {
  search: string;
  action: string;
  entityType: string;
  dateRange: [Date | null, Date | null];
}

interface AuditLogFiltersProps {
  filters: AuditLogFilters;
  onFiltersChange: (filters: AuditLogFilters) => void;
}

export const AuditLogFilters: React.FC<AuditLogFiltersProps> = ({ 
  filters, 
  onFiltersChange = () => {} 
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="search">Search</Label>
            <Input 
              id="search" 
              placeholder="Search logs..." 
              value={filters.search} 
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="action">Action</Label>
            <Select 
              value={filters.action} 
              onValueChange={(value) => onFiltersChange({ ...filters, action: value })}
            >
              <SelectTrigger id="action">
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Actions</SelectItem>
                <SelectItem value="INSERT">Create</SelectItem>
                <SelectItem value="UPDATE">Update</SelectItem>
                <SelectItem value="DELETE">Delete</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="entityType">Entity Type</Label>
            <Select 
              value={filters.entityType} 
              onValueChange={(value) => onFiltersChange({ ...filters, entityType: value })}
            >
              <SelectTrigger id="entityType">
                <SelectValue placeholder="All Entities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Entities</SelectItem>
                <SelectItem value="dogs">Dogs</SelectItem>
                <SelectItem value="puppies">Puppies</SelectItem>
                <SelectItem value="litters">Litters</SelectItem>
                <SelectItem value="customers">Customers</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onFiltersChange({
                search: '',
                action: '',
                entityType: '',
                dateRange: [null, null]
              })}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
