
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import { format, parseISO, addDays } from 'date-fns';
import { useHeatCycles } from '@/hooks/useHeatCycles';
import HeatCycleDialog from './breeding/HeatCycleDialog';
import { HeatCycle } from '@/types/heat-cycles';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

interface HeatCycleManagementProps {
  dogId: string;
}

const HeatCycleManagement: React.FC<HeatCycleManagementProps> = ({ dogId }) => {
  const { heatCycles, averageCycleLength, isLoading, error, addHeatCycle, updateHeatCycle } = useHeatCycles(dogId);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<HeatCycle | null>(null);
  const [nextCycleNumber, setNextCycleNumber] = useState(1);

  React.useEffect(() => {
    if (heatCycles && heatCycles.length > 0) {
      // Find the max cycle number to determine the next one
      const maxCycleNumber = Math.max(...heatCycles.map(cycle => cycle.cycle_number || 0));
      setNextCycleNumber(maxCycleNumber + 1);
    }
  }, [heatCycles]);

  const handleAddCycle = () => {
    setSelectedCycle(null);
    setOpenDialog(true);
  };

  const handleEditCycle = (cycle: HeatCycle) => {
    setSelectedCycle(cycle);
    setOpenDialog(true);
  };

  const handleSaveCycle = async (cycleData: Partial<HeatCycle>) => {
    if (selectedCycle) {
      // Update existing cycle
      await updateHeatCycle({
        id: selectedCycle.id,
        data: cycleData
      });
    } else {
      // Add new cycle
      await addHeatCycle(cycleData);
    }
  };

  // Calculate next heat date if we have enough data
  const calculateNextHeatDate = () => {
    if (!heatCycles || heatCycles.length === 0 || !averageCycleLength) {
      return null;
    }

    const lastCycle = heatCycles[0];
    const startDate = parseISO(lastCycle.start_date);
    return addDays(startDate, averageCycleLength);
  };

  const nextHeatDate = calculateNextHeatDate();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Heat Cycle Management</CardTitle>
          <CardDescription>Loading heat cycle data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Heat Cycle Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">
            Error loading heat cycle data: {(error as Error).message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Heat Cycle Management</CardTitle>
          <CardDescription>Track and record heat cycles</CardDescription>
        </div>
        <Button 
          onClick={handleAddCycle} 
          size="sm" 
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Record Cycle
        </Button>
      </CardHeader>
      <CardContent>
        {heatCycles && heatCycles.length > 0 ? (
          <div className="space-y-4">
            {averageCycleLength && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Cycle Analysis</p>
                    <p className="text-sm text-gray-600">Average cycle length: {averageCycleLength} days</p>
                    {nextHeatDate && (
                      <p className="text-sm text-gray-600">
                        Next heat expected around: {format(nextHeatDate, 'MMM d, yyyy')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cycle #</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Length</TableHead>
                  <TableHead>Intensity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {heatCycles.map((cycle) => (
                  <TableRow key={cycle.id}>
                    <TableCell>{cycle.cycle_number}</TableCell>
                    <TableCell>{format(new Date(cycle.start_date), 'MM/dd/yyyy')}</TableCell>
                    <TableCell>
                      {cycle.end_date 
                        ? format(new Date(cycle.end_date), 'MM/dd/yyyy')
                        : '—'
                      }
                    </TableCell>
                    <TableCell>
                      {cycle.cycle_length ? `${cycle.cycle_length} days` : '—'}
                    </TableCell>
                    <TableCell className="capitalize">{cycle.intensity}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditCycle(cycle)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed rounded-md">
            <Calendar className="h-10 w-10 mx-auto text-gray-400 mb-2" />
            <h3 className="text-lg font-medium mb-1">No Heat Cycles Recorded</h3>
            <p className="text-sm text-gray-500 mb-4">
              Start tracking this dog's reproductive health by recording heat cycles.
            </p>
            <Button onClick={handleAddCycle} size="sm">
              Record First Cycle
            </Button>
          </div>
        )}
      </CardContent>

      {/* Dialog for adding/editing heat cycles */}
      <HeatCycleDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        dogId={dogId}
        cycleNumber={selectedCycle?.cycle_number || nextCycleNumber}
        cycle={selectedCycle || undefined}
        onSave={handleSaveCycle}
      />
    </Card>
  );
};

export default HeatCycleManagement;
