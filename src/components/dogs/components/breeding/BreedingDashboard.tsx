
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Baby, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { Dog } from '@/types/dog';
import { useDogStatus } from '@/hooks/useDogStatus';
import HeatCycleManagement from '../HeatCycleManagement';

interface BreedingDashboardProps {
  dog: Dog;
}

const BreedingDashboard: React.FC<BreedingDashboardProps> = ({ dog }) => {
  const navigate = useNavigate();
  const { isPregnant, tieDate, estimatedDueDate, gestationProgressDays, heatCycle } = useDogStatus(dog);
  
  const handleViewReproductiveManagement = () => {
    navigate(`/dogs/${dog.id}/reproductive`);
  };
  
  if (dog.gender === 'Male') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Breeding Information</CardTitle>
          <CardDescription>Breeding details for {dog.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-blue-50 border-blue-200">
            <AlertTriangle className="h-4 w-4 text-blue-500" />
            <AlertTitle className="text-blue-700">Male Breeding Management</AlertTitle>
            <AlertDescription className="text-blue-600">
              For male dogs, breeding management focuses on stud services and genetic matching.
              Full breeding capabilities will be available in a future update.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reproductive Status</CardTitle>
          <CardDescription>Current reproductive state of {dog.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isPregnant ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Pregnant</h3>
                  <span className="inline-flex items-center rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-medium text-pink-800">
                    Confirmed
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card rounded-lg border p-4">
                    <Clock className="h-5 w-5 text-muted-foreground mb-1" />
                    <div className="text-xs text-muted-foreground">Gestation Progress</div>
                    <div className="text-2xl font-bold">{gestationProgressDays} days</div>
                    <div className="text-xs text-muted-foreground">of ~63 days</div>
                  </div>
                  
                  <div className="bg-card rounded-lg border p-4">
                    <Calendar className="h-5 w-5 text-muted-foreground mb-1" />
                    <div className="text-xs text-muted-foreground">Due Date</div>
                    <div className="text-2xl font-bold">
                      {estimatedDueDate ? format(estimatedDueDate, 'MMM d') : 'Unknown'}
                    </div>
                    {estimatedDueDate && (
                      <div className="text-xs text-muted-foreground">
                        in {Math.max(0, addDays(estimatedDueDate, 0).getDate() - new Date().getDate())} days
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">
                    {heatCycle.isInHeat ? 'Currently in Heat' : 'Not in Heat'}
                  </h3>
                  {heatCycle.isInHeat && (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                      Active
                    </span>
                  )}
                </div>
                
                {heatCycle.lastHeatDate && (
                  <div className="bg-card rounded-lg border p-4">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground">Last Heat Date</div>
                        <div className="text-lg font-medium">
                          {format(heatCycle.lastHeatDate, 'MMM d, yyyy')}
                        </div>
                      </div>
                      {heatCycle.nextHeatDate && (
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">Next Expected Heat</div>
                          <div className="text-lg font-medium">
                            {format(heatCycle.nextHeatDate, 'MMM d, yyyy')}
                          </div>
                          {heatCycle.daysUntilNextHeat && (
                            <div className="text-xs text-muted-foreground">
                              in ~{heatCycle.daysUntilNextHeat} days
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {!heatCycle.lastHeatDate && (
                  <Alert className="bg-amber-50 border-amber-200">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <AlertTitle className="text-amber-700">No Heat Cycles Recorded</AlertTitle>
                    <AlertDescription className="text-amber-600">
                      No heat cycles have been recorded for {dog.name}. 
                      Record her first heat cycle to start tracking her reproductive cycle.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleViewReproductiveManagement} className="w-full">
            <Baby className="h-4 w-4 mr-2" />
            Reproductive Management
          </Button>
        </CardFooter>
      </Card>
      
      <HeatCycleManagement dogId={dog.id} />
    </div>
  );
};

export default BreedingDashboard;
