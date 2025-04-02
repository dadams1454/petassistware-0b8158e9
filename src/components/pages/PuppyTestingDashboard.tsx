import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState
} from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import WeightTrackingGraph from '@/components/puppies/growth/WeightTrackingGraph';

interface Puppy {
  id: string;
  name: string;
  birth_date?: string;
}

const PuppyTestingDashboard: React.FC = () => {
  const [puppies, setPuppies] = useState<Puppy[]>([]);
  const [selectedPuppy, setSelectedPuppy] = useState<Puppy | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [visibility, setVisibility] = React.useState<VisibilityState>({});

  const columns: ColumnDef<Puppy>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'birth_date',
      header: 'Birth Date',
      cell: ({ row }) => {
        const date = row.getValue('birth_date');
        return date ? format(new Date(date as string), 'MMM dd, yyyy') : 'Unknown';
      },
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('puppies')
        .select('id, name, birth_date')
        .limit(10);

      if (error) {
        console.error('Error fetching puppies:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch puppies. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      setPuppies(data || []);
    } catch (error) {
      console.error('Error fetching puppies:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch puppies. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePuppySelect = (puppy: Puppy) => {
    setSelectedPuppy(puppy);
  };

  const refetch = async () => {
    await fetchData();
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Puppy Testing Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Puppy List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Select a Puppy</h2>
          {loading ? (
            <p>Loading puppies...</p>
          ) : (
            <DataTable
              columns={columns}
              data={puppies}
              searchKey="name"
              showPagination={false}
            />
          )}
        </div>

        {/* Weight Tracking */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Weight Tracking</h2>
          {selectedPuppy ? (
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-2">
                {selectedPuppy.name}
              </h3>
              <WeightTrackingGraph
                puppyId={selectedPuppy.id}
              />
            </div>
          ) : (
            <p>Select a puppy to view weight tracking data.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PuppyTestingDashboard;
