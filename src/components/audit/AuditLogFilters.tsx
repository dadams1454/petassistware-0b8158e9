
import React from 'react';
import { CalendarIcon, FilterIcon, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { AuditLogFilters } from '@/hooks/useAuditLogs';

interface AuditLogFiltersProps {
  filters: AuditLogFilters;
  setFilters: (filters: AuditLogFilters) => void;
  entityTypes: string[];
  actionTypes: string[];
  onResetFilters: () => void;
}

export function AuditLogFiltersComponent({
  filters,
  setFilters,
  entityTypes,
  actionTypes,
  onResetFilters,
}: AuditLogFiltersProps) {
  const updateFilter = (key: keyof AuditLogFilters, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const hasActiveFilters = () => {
    return (
      !!filters.entity_type ||
      !!filters.action ||
      !!filters.startDate ||
      !!filters.endDate ||
      !!filters.searchTerm
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search audit logs..."
            className="pl-8"
            value={filters.searchTerm || ''}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <FilterIcon className="mr-2 h-4 w-4" />
                Filters
                {hasActiveFilters() && (
                  <Badge variant="secondary" className="ml-2 px-1 py-0">
                    {Object.values(filters).filter(Boolean).length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Filter Audit Logs</h4>
                  <p className="text-sm text-muted-foreground">
                    Narrow down results by specific criteria
                  </p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="entity-type">Entity Type</Label>
                  <Select
                    value={filters.entity_type || ''}
                    onValueChange={(value) => updateFilter('entity_type', value || undefined)}
                  >
                    <SelectTrigger id="entity-type">
                      <SelectValue placeholder="All entity types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All entity types</SelectItem>
                      {entityTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="action-type">Action Type</Label>
                  <Select
                    value={filters.action || ''}
                    onValueChange={(value) => updateFilter('action', value || undefined)}
                  >
                    <SelectTrigger id="action-type">
                      <SelectValue placeholder="All actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All actions</SelectItem>
                      {actionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label>Date Range</Label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.startDate ? (
                            format(filters.startDate, 'PPP')
                          ) : (
                            <span>From date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.startDate}
                          onSelect={(date) => updateFilter('startDate', date)}
                          disabled={(date) =>
                            filters.endDate ? date > filters.endDate : false
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.endDate ? (
                            format(filters.endDate, 'PPP')
                          ) : (
                            <span>To date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.endDate}
                          onSelect={(date) => updateFilter('endDate', date)}
                          disabled={(date) =>
                            filters.startDate ? date < filters.startDate : false
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  className="justify-self-start" 
                  onClick={onResetFilters}
                >
                  <X className="mr-2 h-4 w-4" />
                  Reset Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          {hasActiveFilters() && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onResetFilters}
              className="h-9"
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>
      
      {hasActiveFilters() && (
        <div className="flex flex-wrap gap-2">
          {filters.entity_type && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Entity: {filters.entity_type.replace(/_/g, ' ')}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter('entity_type', undefined)}
              />
            </Badge>
          )}
          {filters.action && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Action: {filters.action}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter('action', undefined)}
              />
            </Badge>
          )}
          {filters.startDate && (
            <Badge variant="secondary" className="flex items-center gap-1">
              From: {format(filters.startDate, 'PP')}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter('startDate', undefined)}
              />
            </Badge>
          )}
          {filters.endDate && (
            <Badge variant="secondary" className="flex items-center gap-1">
              To: {format(filters.endDate, 'PP')}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter('endDate', undefined)}
              />
            </Badge>
          )}
          {filters.searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {filters.searchTerm}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter('searchTerm', undefined)}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
