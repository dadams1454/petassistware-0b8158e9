
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Puppy } from '@/types/puppy';
import { PuppyCareLogProps } from '@/types/puppy';
import PuppyCareLog from '@/components/puppies/dashboard/PuppyCareLog';
import { DataTable } from '@/components/ui/data-table';
import { 
  ColumnDef, 
  ColumnFiltersState, 
  SortingState, 
  VisibilityState 
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, Calendar as CalendarIcon } from 'lucide-react';
import WeightTrackingGraph from '@/components/puppies/growth/WeightTrackingGraph';
import { Calendar } from '@/components/ui/calendar';
import { DatePicker } from '@/components/ui/date-picker';

const PuppyTestingDashboard = () => {
  const [puppies, setPuppies] = useState<Puppy[]>([]);
  const [selectedPuppy, setSelectedPuppy] = useState<Puppy | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPuppies();
  }, []);

  const fetchPuppies = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('puppies')
        .select('*');
      if (error) throw error;
      setPuppies(data);
    } catch (error) {
      console.error("Error fetching puppies:", error);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchPuppies();
  };

  const columns: ColumnDef<Puppy>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Name
              <ArrowUp className="h-4 w-4"/>
              <ArrowDown className="h-4 w-4"/>
            </Button>
          )
        },
      },
      {
        accessorKey: "gender",
        header: "Gender",
      },
      {
        accessorKey: "color",
        header: "Color",
      },
      {
        accessorKey: "birth_date",
        header: "Birth Date",
      },
      {
        accessorKey: "litter_id",
        header: "Litter ID",
      },
      {
        accessorKey: "status",
        header: "Status",
      },
    ],
    []
  )

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Puppy Testing Dashboard</h1>

      {/* Puppy Selection */}
      <div className="mb-6">
        <label htmlFor="puppySelect" className="block text-sm font-medium text-gray-700">
          Select a Puppy:
        </label>
        <select
          id="puppySelect"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={selectedPuppy ? selectedPuppy.id : ''}
          onChange={(e) => {
            const selectedId = e.target.value;
            const puppy = puppies.find(p => p.id === selectedId);
            setSelectedPuppy(puppy || null);
          }}
        >
          <option value="">Select a puppy</option>
          {puppies.map((puppy) => (
            <option key={puppy.id} value={puppy.id}>{puppy.name}</option>
          ))}
        </select>
      </div>

      {/* Date Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">
          Select Date:
        </label>
        <DatePicker
          date={date}
          onSelect={(d) => setDate(d)}
        />
      </div>

      {/* Refresh Button */}
      <div className="mb-6">
        <Button 
          size="sm" 
          variant="secondary" 
          onClick={refetch}
        >
          Refresh
        </Button>
      </div>

      {/* Data Table */}
      <div className="mb-6">
        {puppies.length > 0 && (
          <DataTable
            columns={columns}
            data={puppies}
            searchKey="name"
          />
        )}
      </div>

      {/* Puppy Care Log */}
      {selectedPuppy && (
        <div className="mb-6">
          <PuppyCareLog
            puppyId={selectedPuppy.id}
            puppyName={selectedPuppy.name}
            puppyGender={selectedPuppy.gender}
            puppyColor={selectedPuppy.color}
            puppyAge={30} // Replace with actual age calculation
            onSuccess={() => {}}
            onRefresh={refetch}
          />
        </div>
      )}

      {/* Weight Tracking Graph */}
      {selectedPuppy && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Weight Tracking</h2>
          <WeightTrackingGraph
            puppyId={selectedPuppy.id}
          />
        </div>
      )}
    </div>
  );
};

export default PuppyTestingDashboard;
