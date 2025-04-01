import React from 'react';
import { format, isWithinInterval, addDays } from 'date-fns';
import { CalendarDays, Heart, Pill, Stethoscope } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DogStatusData } from '@/components/dogs/hooks/useDogStatus';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface HealthSectionHeaderProps {
  dogId: string;
  dogStatus: DogStatusData;
}

export const HealthSectionHeader: React.FC<HealthSectionHeaderProps> = ({ dogId, dogStatus }) => {
  const navigate = useNavigate();
  
  const getHeatStatusBadge = () => {
    if (dogStatus.isInHeat) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <Heart className="h-3 w-3 mr-1 fill-red-500 text-red-500" />
          In Heat
        </Badge>
      );
    }
    
    if (dogStatus.heatCycle.isPreHeat) {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          <Heart className="h-3 w-3 mr-1 text-amber-500" />
          Pre-Heat
        </Badge>
      );
    }
    
    if (dogStatus.heatCycle.nextHeatDate) {
      const daysUntil = dogStatus.heatCycle.daysUntilNextHeat;
      if (daysUntil && daysUntil < 30) {
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Heart className="h-3 w-3 mr-1 text-blue-500" />
            Heat in {daysUntil} days
          </Badge>
        );
      }
    }
    
    return null;
  };
  
  const getVaccinationBadge = () => {
    if (!dogStatus.nextVaccinationDue) return null;
    
    const nextVaccDate = new Date(dogStatus.nextVaccinationDue);
    const today = new Date();
    const isUpcoming = isWithinInterval(nextVaccDate, {
      start: today,
      end: addDays(today, 30),
    });
    
    const isOverdue = nextVaccDate < today;
    
    if (isOverdue) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <Pill className="h-3 w-3 mr-1 text-red-500" />
          Vaccination Overdue
        </Badge>
      );
    }
    
    if (isUpcoming) {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          <Pill className="h-3 w-3 mr-1 text-amber-500" />
          Vaccination Due Soon
        </Badge>
      );
    }
    
    return null;
  };
  
  const getHealthConflictBadge = () => {
    if (dogStatus.hasVaccinationHeatConflict) {
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          <Stethoscope className="h-3 w-3 mr-1 text-purple-500" />
          Vaccination/Heat Conflict
        </Badge>
      );
    }
    return null;
  };
  
  const handleAddHealthRecord = () => {
    navigate(`/dogs/${dogId}/health/add`);
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">Health Overview</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleAddHealthRecord}
            className="text-xs"
          >
            Add Health Record
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {getHeatStatusBadge()}
          {getVaccinationBadge()}
          {getHealthConflictBadge()}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={cn(
            "flex flex-col p-3 rounded-lg border",
            dogStatus.nextVaccinationDue && new Date(dogStatus.nextVaccinationDue) < new Date() 
              ? "bg-red-50 border-red-200" 
              : "bg-slate-50 border-slate-200"
          )}>
            <span className="text-sm text-slate-500 flex items-center">
              <Pill className="h-4 w-4 mr-1" />
              Next Vaccination
            </span>
            <span className="text-lg font-medium">
              {dogStatus.nextVaccinationDue 
                ? format(new Date(dogStatus.nextVaccinationDue), 'MMM d, yyyy')
                : 'Not scheduled'}
            </span>
          </div>
          
          <div className="flex flex-col p-3 rounded-lg border bg-slate-50 border-slate-200">
            <span className="text-sm text-slate-500 flex items-center">
              <Stethoscope className="h-4 w-4 mr-1" />
              Last Checkup
            </span>
            <span className="text-lg font-medium">
              {dogStatus.lastHealthCheckup 
                ? format(new Date(dogStatus.lastHealthCheckup), 'MMM d, yyyy')
                : 'No record'}
            </span>
          </div>
          
          <div className="flex flex-col p-3 rounded-lg border bg-slate-50 border-slate-200">
            <span className="text-sm text-slate-500 flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              Next Heat Cycle
            </span>
            <span className="text-lg font-medium">
              {dogStatus.heatCycle.nextHeatDate 
                ? format(dogStatus.heatCycle.nextHeatDate, 'MMM d, yyyy')
                : 'Not applicable'}
            </span>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="text-sm text-slate-500">
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-2 text-slate-400" />
            <span>
              {dogStatus.heatCycle.lastHeatDate 
                ? `Last heat started on ${format(dogStatus.heatCycle.lastHeatDate, 'MMM d, yyyy')}` 
                : 'No heat cycle recorded'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthSectionHeader;
