
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuditLogTypes } from '@/hooks/useAuditLogs';

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
  const [dateOpen, setDateOpen] = useState(false);
  const { entityTypes, actionTypes } = useAuditLogTypes();

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                {actionTypes.map(action => (
                  <SelectItem key={action} value={action}>{action}</SelectItem>
                ))}
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
                {entityTypes.map(type => (
                  <SelectItem key={type} value={type}>{type.replace(/_/g, ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="dateRange">Date Range</Label>
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="dateRange"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange[0] ? (
                    filters.dateRange[1] ? (
                      <>
                        {format(filters.dateRange[0], "MMM d, yyyy")} -{" "}
                        {format(filters.dateRange[1], "MMM d, yyyy")}
                      </>
                    ) : (
                      format(filters.dateRange[0], "MMM d, yyyy")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={filters.dateRange[0] || undefined}
                  selected={{
                    from: filters.dateRange[0] || undefined,
                    to: filters.dateRange[1] || undefined,
                  }}
                  onSelect={(range) => {
                    onFiltersChange({
                      ...filters,
                      dateRange: [range?.from || null, range?.to || null],
                    });
                    if (range?.to) {
                      setDateOpen(false);
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
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
