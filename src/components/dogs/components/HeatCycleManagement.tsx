
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Heart, AlertTriangle, Clock, Plus } from 'lucide-react';
import { format, differenceInDays, addDays } from 'date-fns';
import { useDogStatus } from '../hooks/useDogStatus';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HeatCycleMonitor from './breeding/HeatCycleMonitor';
import RecordHeatCycleDialog from './breeding/RecordHeatCycleDialog';

interface HeatCycleManagementProps {
  dog: any;
  onRefresh?: () => void;
}

const HeatCycleManagement: React.FC<HeatCycleManagementProps> = ({ 
  dog,
  onRefresh
}) => {
  const [isRecordHeatOpen, setIsRecordHeatOpen] = useState(false);
  const { toast } = useToast();
  
  // Only applicable for female dogs
  if (dog.gender !== 'Female') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Heat Cycle Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Heat cycle management is only available for female dogs.</p>
        </CardContent>
      </Card>
    );
  }
  
  const { heatCycle } = useDogStatus(dog);
  
  const { 
    lastHeatDate, 
    nextHeatDate,
    isInHeat,
    daysUntilNextHeat
  } = heatCycle;
  
  const handleRecordSuccess = () => {
    if (onRefresh) {
      onRefresh();
    }
    
    toast({
      title: "Heat Cycle Updated",
      description: "The heat cycle information has been updated successfully."
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-500" />
          Heat Cycle Management
        </h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsRecordHeatOpen(true)}
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          Record Heat
        </Button>
      </div>
      
      <Tabs defaultValue="monitor" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="monitor">Monitor</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monitor" className="mt-4">
          <HeatCycleMonitor dog={dog} />
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Heat Cycle History</CardTitle>
            </CardHeader>
            <CardContent>
              {lastHeatDate ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium">Last Heat Cycle</p>
                      <p className="text-sm text-muted-foreground">
                        {format(lastHeatDate, 'MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  {nextHeatDate && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Next Expected Heat</p>
                        <p className="text-sm text-muted-foreground">
                          {format(nextHeatDate, 'MMMM d, yyyy')}
                          {daysUntilNextHeat !== null && (
                            <span className="ml-2">
                              ({isInHeat ? 'In progress' : `in ${daysUntilNextHeat} days`})
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="font-medium">Cycle Information</p>
                      <p className="text-sm text-muted-foreground">
                        Heat cycles typically occur every 6 months and last about 2-3 weeks.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Heart className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No heat cycle history recorded</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setIsRecordHeatOpen(true)}
                  >
                    Record First Heat Cycle
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setIsRecordHeatOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add Heat Record
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <RecordHeatCycleDialog 
        isOpen={isRecordHeatOpen}
        onClose={() => setIsRecordHeatOpen(false)}
        dog={dog}
        onSuccess={handleRecordSuccess}
      />
    </div>
  );
};

export default HeatCycleManagement;
