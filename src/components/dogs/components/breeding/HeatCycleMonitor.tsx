
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { HeatCycle, HeatIntensity } from '@/types/reproductive';
import HeatCycleDialog from './HeatCycleDialog';

// Helper to ensure intensity is a valid HeatIntensity value
const ensureValidIntensity = (cycle: any): HeatCycle => {
  // Map string intensity to enum value
  let validIntensity: HeatIntensity;
  
  switch (cycle.intensity) {
    case 'mild':
      validIntensity = HeatIntensity.Mild;
      break;
    case 'strong':
      validIntensity = HeatIntensity.Strong;
      break;
    case 'unknown':
      validIntensity = HeatIntensity.Unknown;
      break;
    default:
      validIntensity = HeatIntensity.Moderate;
  }
  
  return {
    ...cycle,
    intensity: validIntensity
  };
};

interface HeatCycleMonitorProps {
  dogId: string;
  cycles: any[];
  onAddCycle: (data: Partial<HeatCycle>) => Promise<void>;
  onUpdateCycle: (id: string, data: Partial<HeatCycle>) => Promise<void>;
}

const HeatCycleMonitor: React.FC<HeatCycleMonitorProps> = ({
  dogId,
  cycles,
  onAddCycle,
  onUpdateCycle
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<HeatCycle | null>(null);

  const handleOpenAddDialog = () => {
    setSelectedCycle(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (cycle: any) => {
    setSelectedCycle(ensureValidIntensity(cycle));
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setSelectedCycle(null);
  };

  const handleSubmit = async (data: Partial<HeatCycle>) => {
    try {
      if (selectedCycle) {
        await onUpdateCycle(selectedCycle.id, data);
      } else {
        await onAddCycle({ ...data, dog_id: dogId });
      }
      handleClose();
    } catch (error) {
      console.error('Error submitting heat cycle:', error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Heat Cycle History</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleOpenAddDialog}
          className="gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Cycle</span>
        </Button>
      </CardHeader>
      
      <CardContent>
        {cycles.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No heat cycles recorded yet. Click "Add Cycle" to record the first one.
          </p>
        ) : (
          <div className="space-y-4">
            {cycles.map((cycle) => (
              <div 
                key={cycle.id} 
                className="flex justify-between items-center border-b pb-2 last:border-0"
                onClick={() => handleOpenEditDialog(cycle)}
                role="button"
                tabIndex={0}
              >
                <div>
                  <div className="font-medium">
                    {format(parseISO(cycle.start_date), 'MMM d, yyyy')}
                    {cycle.end_date && ` - ${format(parseISO(cycle.end_date), 'MMM d, yyyy')}`}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {cycle.cycle_length ? `${cycle.cycle_length} days` : 'Ongoing'}
                    {cycle.intensity && ` • ${cycle.intensity} intensity`}
                  </div>
                </div>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      {isDialogOpen && (
        <HeatCycleDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleSubmit}
          cycle={selectedCycle}
        />
      )}
    </Card>
  );
};

export default HeatCycleMonitor;
