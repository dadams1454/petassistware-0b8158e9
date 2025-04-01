
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { format, addDays, differenceInDays } from 'date-fns';
import { useDogStatus } from '@/components/dogs/hooks/useDogStatus';
import { Calendar, Heart, AlertTriangle, Plus, LineChart, Clock } from 'lucide-react';
import { SectionHeader } from '@/components/ui/standardized';
import HeatCycleChart from './HeatCycleChart';
import BreedingTimingOptimizer from './BreedingTimingOptimizer';

interface ReproductiveCycleDashboardProps {
  dog: any;
}

const ReproductiveCycleDashboard: React.FC<ReproductiveCycleDashboardProps> = ({ dog }) => {
  const [showAddCycleDialog, setShowAddCycleDialog] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('overview');
  
  const { 
    heatCycle,
    isPregnant
  } = useDogStatus(dog);
  
  const { data: heatCycles, isLoading: isLoadingCycles } = useQuery({
    queryKey: ['heat-cycles', dog.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('heat_cycles')
        .select('*')
        .eq('dog_id', dog.id)
        .order('start_date', { ascending: false });
        
      if (error) throw error;
      return data || [];
    }
  });
  
  const handleAddCycle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const cycleData = {
      dog_id: dog.id,
      start_date: formData.get('start_date'),
      end_date: formData.get('end_date') || null,
      notes: formData.get('notes') || null
    };
    
    try {
      const { error } = await supabase
        .from('heat_cycles')
        .insert(cycleData);
        
      if (error) throw error;
      
      // Also update the dog's last heat date
      if (cycleData.start_date) {
        await supabase
          .from('dogs')
          .update({ last_heat_date: cycleData.start_date })
          .eq('id', dog.id);
      }
      
      setShowAddCycleDialog(false);
      // You would normally trigger a refetch of heat cycles data here
    } catch (error) {
      console.error('Error adding heat cycle:', error);
    }
  };
  
  // Determine reproductive status for display
  const getReproductiveStatus = () => {
    if (isPregnant) {
      return { label: 'Pregnant', color: 'bg-pink-500' };
    }
    
    if (heatCycle.isInHeat) {
      return { label: `In Heat (${heatCycle.currentStage?.name || 'Active'})`, color: 'bg-red-500' };
    }
    
    if (heatCycle.isPreHeat) {
      return { label: 'Heat Approaching', color: 'bg-amber-500' };
    }
    
    return { label: 'Not in Heat', color: 'bg-blue-500' };
  };
  
  const status = getReproductiveStatus();
  
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Reproductive Cycle Management" 
        description="Track heat cycles and optimize breeding timing"
        action={{
          label: "Record Heat Cycle",
          onClick: () => setShowAddCycleDialog(true),
          icon: <Plus className="h-4 w-4 mr-2" />
        }}
      />
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Current Status</CardTitle>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${status.color} text-white`}>
              {status.label}
            </span>
          </div>
          <CardDescription>
            {isPregnant 
              ? 'Currently pregnant - see pregnancy tab for details'
              : heatCycle.isInHeat 
                ? 'Active heat cycle - optimal breeding recommendations available' 
                : 'Monitoring reproductive status'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatusCard 
              title="Last Heat Cycle"
              value={dog.last_heat_date ? format(new Date(dog.last_heat_date), 'MMM d, yyyy') : 'Not recorded'}
              icon={<Calendar className="h-5 w-5 text-blue-500" />}
              description={dog.last_heat_date ? `${differenceInDays(new Date(), new Date(dog.last_heat_date))} days ago` : 'No data'}
            />
            
            {!isPregnant && heatCycle.nextHeatDate && (
              <StatusCard 
                title="Next Expected Heat"
                value={format(heatCycle.nextHeatDate, 'MMM d, yyyy')}
                icon={<Calendar className="h-5 w-5 text-red-500" />}
                description={heatCycle.daysUntilNextHeat ? `In ${heatCycle.daysUntilNextHeat} days` : 'Calculating...'}
              />
            )}
            
            {heatCycle.isInHeat && heatCycle.currentStage && (
              <StatusCard 
                title="Current Cycle Stage"
                value={heatCycle.currentStage.name}
                icon={<Clock className="h-5 w-5 text-purple-500" />}
                description={heatCycle.currentStage.description}
                className="md:col-span-2"
              />
            )}
            
            {heatCycle.fertileDays.start && heatCycle.fertileDays.end && heatCycle.isInHeat && (
              <StatusCard 
                title="Fertile Window"
                value={`${format(heatCycle.fertileDays.start, 'MMM d')} - ${format(heatCycle.fertileDays.end, 'MMM d')}`}
                icon={<Heart className="h-5 w-5 text-red-500" />}
                description="Period when breeding has highest chance of success"
                className="md:col-span-2"
              />
            )}
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="overview">Cycle History</TabsTrigger>
          <TabsTrigger value="chart">Analysis</TabsTrigger>
          <TabsTrigger value="optimizer">Breeding Optimizer</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Heat Cycle History</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingCycles ? (
                <div className="py-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading cycle history...</p>
                </div>
              ) : heatCycles && heatCycles.length > 0 ? (
                <div className="space-y-6">
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800"></div>
                    <ul className="space-y-6 relative z-10">
                      {heatCycles.map((cycle) => (
                        <li key={cycle.id} className="relative pl-10">
                          <div className="absolute left-0 top-1 rounded-full bg-primary h-8 w-8 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-primary-foreground" />
                          </div>
                          <div className="bg-card rounded-lg border p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold">Started: {format(new Date(cycle.start_date), 'MMM d, yyyy')}</h4>
                                {cycle.end_date && (
                                  <p className="text-sm text-muted-foreground">
                                    Ended: {format(new Date(cycle.end_date), 'MMM d, yyyy')}
                                    <span className="ml-2">
                                      ({differenceInDays(new Date(cycle.end_date), new Date(cycle.start_date))} days)
                                    </span>
                                  </p>
                                )}
                              </div>
                              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                                {cycle.end_date ? 'Complete' : 'Ongoing'}
                              </span>
                            </div>
                            {cycle.notes && (
                              <p className="mt-2 text-sm border-t pt-2 text-muted-foreground">
                                {cycle.notes}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                  <p>No heat cycles recorded yet.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setShowAddCycleDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Record First Heat Cycle
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="chart" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cycle Analysis</CardTitle>
              <CardDescription>
                Visual analysis of heat cycle patterns and duration
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <HeatCycleChart dogId={dog.id} heatCycles={heatCycles || []} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="optimizer" className="mt-4">
          <BreedingTimingOptimizer dog={dog} heatCycle={heatCycle} />
        </TabsContent>
      </Tabs>
      
      {/* Add Heat Cycle Dialog */}
      <Dialog open={showAddCycleDialog} onOpenChange={setShowAddCycleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record Heat Cycle</DialogTitle>
            <DialogDescription>
              Enter the details of the heat cycle for accurate tracking and predictions.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddCycle} className="space-y-4 pt-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <label htmlFor="start_date" className="text-sm font-medium">
                  Start Date <span className="text-destructive">*</span>
                </label>
                <input
                  id="start_date"
                  name="start_date"
                  type="date"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  defaultValue={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="end_date" className="text-sm font-medium">
                  End Date (Optional)
                </label>
                <input
                  id="end_date"
                  name="end_date"
                  type="date"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank if the cycle is ongoing.
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Any observations or special notes for this cycle"
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowAddCycleDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Heat Cycle</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface StatusCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  className?: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ title, value, icon, description, className }) => (
  <div className={`bg-card rounded-lg border p-4 ${className || ''}`}>
    <div className="flex items-start">
      <div className="mr-3">{icon}</div>
      <div>
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        <p className="text-base font-semibold">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  </div>
);

export default ReproductiveCycleDashboard;
