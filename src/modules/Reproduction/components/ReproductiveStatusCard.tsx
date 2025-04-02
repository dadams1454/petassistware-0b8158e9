
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Baby, Clock, Info } from 'lucide-react';
import { format } from 'date-fns';
import { ReproductiveStatus, HeatStage, Dog } from '@/types/reproductive';

interface ReproductiveStatusCardProps {
  dog: Dog;
  status: ReproductiveStatus;
  nextHeatDate: Date | null | undefined;
  daysUntilNextHeat: number | null | undefined;
  averageCycleLength: number | null | undefined;
  currentHeatStage: HeatStage | null | undefined;
  fertilityWindow: { start: Date; end: Date } | null | undefined;
  gestationDays: number | null | undefined;
  estimatedDueDate: Date | null | undefined;
}

const ReproductiveStatusCard: React.FC<ReproductiveStatusCardProps> = ({
  dog,
  status,
  nextHeatDate,
  daysUntilNextHeat,
  averageCycleLength,
  currentHeatStage,
  fertilityWindow,
  gestationDays,
  estimatedDueDate
}) => {
  // Get status display information
  const getStatusInfo = () => {
    switch (status) {
      case ReproductiveStatus.IN_HEAT:
        return {
          label: 'In Heat',
          description: currentHeatStage
            ? `Day ${currentHeatStage.day} - ${currentHeatStage.name}`
            : 'Active heat cycle',
          color: 'bg-red-500',
          icon: <Clock className="h-5 w-5 text-white" />
        };
      case ReproductiveStatus.PRE_HEAT:
        return {
          label: 'Pre-Heat',
          description: `Heat expected in ${daysUntilNextHeat} days`,
          color: 'bg-amber-500',
          icon: <Clock className="h-5 w-5 text-white" />
        };
      case ReproductiveStatus.PREGNANT:
        return {
          label: 'Pregnant',
          description: gestationDays 
            ? `Day ${gestationDays} of pregnancy`
            : 'Pregnancy confirmed',
          color: 'bg-pink-500',
          icon: <Baby className="h-5 w-5 text-white" />
        };
      case ReproductiveStatus.WHELPING:
        return {
          label: 'Whelping',
          description: 'Active whelping in progress',
          color: 'bg-purple-500',
          icon: <Baby className="h-5 w-5 text-white" />
        };
      case ReproductiveStatus.NURSING:
        return {
          label: 'Nursing',
          description: 'Nursing puppies',
          color: 'bg-blue-500',
          icon: <Baby className="h-5 w-5 text-white" />
        };
      case ReproductiveStatus.RECOVERY:
        return {
          label: 'Recovery',
          description: 'Post-whelping recovery',
          color: 'bg-green-500',
          icon: <Info className="h-5 w-5 text-white" />
        };
      default:
        return {
          label: 'Not in Heat',
          description: nextHeatDate
            ? `Next heat expected ${format(nextHeatDate, 'MMM d, yyyy')}`
            : 'No heat cycles recorded yet',
          color: 'bg-blue-500',
          icon: <Calendar className="h-5 w-5 text-white" />
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Reproductive Status</CardTitle>
          <Badge className={`${statusInfo.color} text-white`}>
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{statusInfo.description}</p>
        
        <div className="space-y-3">
          {dog.last_heat_date && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Last Heat:</span>
              <span className="font-medium">{format(new Date(dog.last_heat_date), 'MMM d, yyyy')}</span>
            </div>
          )}
          
          {nextHeatDate && status !== ReproductiveStatus.PREGNANT && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Next Heat Expected:</span>
              <span className="font-medium">{format(nextHeatDate, 'MMM d, yyyy')}</span>
            </div>
          )}
          
          {averageCycleLength && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Average Cycle:</span>
              <span className="font-medium">{averageCycleLength} days</span>
            </div>
          )}
          
          {status === ReproductiveStatus.IN_HEAT && fertilityWindow && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Fertility Window:</span>
              <span className="font-medium">
                {format(fertilityWindow.start, 'MMM d')} - {format(fertilityWindow.end, 'MMM d')}
              </span>
            </div>
          )}
          
          {status === ReproductiveStatus.IN_HEAT && currentHeatStage && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Fertility:</span>
              <span 
                className={`font-medium ${
                  currentHeatStage.fertility === 'peak' 
                    ? 'text-red-500' 
                    : currentHeatStage.fertility === 'high'
                      ? 'text-orange-500'
                      : 'text-blue-500'
                }`}
              >
                {currentHeatStage.fertility.charAt(0).toUpperCase() + currentHeatStage.fertility.slice(1)}
              </span>
            </div>
          )}
          
          {status === ReproductiveStatus.PREGNANT && estimatedDueDate && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Due Date:</span>
              <span className="font-medium">{format(estimatedDueDate, 'MMM d, yyyy')}</span>
            </div>
          )}
          
          {status === ReproductiveStatus.PREGNANT && gestationDays !== null && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Gestation:</span>
              <span className="font-medium">{gestationDays} days (of ~63)</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReproductiveStatusCard;
