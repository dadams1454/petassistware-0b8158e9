
import React from 'react';
import { Filter, Search, Calendar, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { expenseCategories } from './constants';

interface ExpenseFiltersProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  category: string | undefined;
  onCategoryChange: (category: string | undefined) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onResetFilters: () => void;
}

const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  dateRange,
  onDateRangeChange,
  category,
  onCategoryChange,
  searchQuery,
  onSearchQueryChange,
  onResetFilters,
}) => {
  const hasActiveFilters = !!dateRange || !!category || !!searchQuery;

  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:space-x-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search expenses..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
        />
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full md:w-auto justify-start">
            <Calendar className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'LLL dd, y')} -{' '}
                  {format(dateRange.to, 'LLL dd, y')}
                </>
              ) : (
                format(dateRange.from, 'LLL dd, y')
              )
            ) : (
              <span>Date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      
      <Select
        value={category}
        onValueChange={onCategoryChange}
      >
        <SelectTrigger className="w-full md:w-[200px]">
          <Filter className="mr-2 h-4 w-4" />
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={undefined}>All Categories</SelectItem>
          {expenseCategories.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetFilters}
          className="md:ml-2"
        >
          <X className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      )}
    </div>
  );
};

export default ExpenseFilters;
