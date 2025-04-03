
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, differenceInDays } from 'date-fns';
import { ReproductiveStatus } from '@/types/reproductive';
import { Dog } from '@/types/litter';

interface ReproductiveStatusCardProps {
  dog: Dog;
  status: string | ReproductiveStatus;
  lastHeatDate?: Date | string | null;
  nextHeatDate?: Date | string | null;
  tieDate?: Date | string | null;
  dueDate?: Date | string | null;
  handleStartHeat?: () => void;
  handleEndHeat?: () => void;
  handleConfirmPregnancy?: () => void;
}

export const getStatusColor = (status: string | ReproductiveStatus): string => {
  // Convert the status to string for comparison
  const statusStr = typeof status === 'string' ? status : status;
  
  switch (statusStr) {
    case ReproductiveStatus.InHeat:
    case 'in_heat':
      return 'bg-red-100 text-red-800 border-red-200';
    case ReproductiveStatus.Pregnant:
    case 'pregnant':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case ReproductiveStatus.Nursing:
    case 'nursing':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case ReproductiveStatus.PreHeat:
    case 'pre_heat':
    case 'preheat':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'whelping':
    case ReproductiveStatus.Whelping:
      return 'bg-pink-100 text-pink-800 border-pink-200';
    case 'recovery':
    case ReproductiveStatus.Recovery:
      return 'bg-green-100 text-green-800 border-green-200';
    case ReproductiveStatus.Altered:
    case 'altered':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

export const getStatusDisplay = (status: string | ReproductiveStatus): string => {
  // Convert the status to string for comparison
  const statusStr = typeof status === 'string' ? status : status;
  
  switch (statusStr) {
    case ReproductiveStatus.InHeat:
    case 'in_heat':
      return 'In Heat';
    case ReproductiveStatus.Pregnant:
    case 'pregnant':
      return 'Pregnant';
    case ReproductiveStatus.Nursing:
    case 'nursing':
      return 'Nursing';
    case 'pre_heat':
    case 'preheat':
    case ReproductiveStatus.PreHeat:
      return 'Pre-Heat';
    case 'whelping':
    case ReproductiveStatus.Whelping:
      return 'Whelping';
    case 'recovery':
    case ReproductiveStatus.Recovery:
      return 'Recovery';
    case ReproductiveStatus.NotInHeat:
    case 'not_in_heat':
      return 'Not In Heat';
    case ReproductiveStatus.Altered:
    case 'altered':
      return 'Altered';
    default:
      return 'Unknown';
  }
};

const ReproductiveStatusCard: React.FC<ReproductiveStatusCardProps> = ({
  dog,
  status,
  lastHeatDate,
  nextHeatDate,
  tieDate,
  dueDate,
  handleStartHeat,
  handleEndHeat,
  handleConfirmPregnancy
}) => {
  // Format dates for display
  const formattedLastHeatDate = lastHeatDate ? format(new Date(lastHeatDate), 'MMM d, yyyy') : 'Not recorded';
  const formattedNextHeatDate = nextHeatDate ? format(new Date(nextHeatDate), 'MMM d, yyyy') : 'Unknown';
  const formattedTieDate = tieDate ? format(new Date(tieDate), 'MMM d, yyyy') : 'Not recorded';
  const formattedDueDate = dueDate ? format(new Date(dueDate), 'MMM d, yyyy') : 'Unknown';
  
  // Calculate days for various states
  const daysUntilNextHeat = nextHeatDate ? differenceInDays(new Date(nextHeatDate), new Date()) : null;
  const daysUntilDue = dueDate ? differenceInDays(new Date(dueDate), new Date()) : null;
  
  // Type guard for gender
  const isFemale = dog.gender === 'Female';
  
  // Don't display for male dogs
  if (!isFemale) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Reproductive Status</CardTitle>
        <CardDescription>Current status and important dates</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-muted-foreground">Current Status:</span>
          <Badge className={getStatusColor(status)}>
            {getStatusDisplay(status)}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Last Heat:</span>
            <span className="text-sm font-medium">{formattedLastHeatDate}</span>
          </div>
          
          {tieDate && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Breeding Date:</span>
              <span className="text-sm font-medium">{formattedTieDate}</span>
            </div>
          )}
          
          {dueDate && (status === ReproductiveStatus.Pregnant || status === 'pregnant') && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Due Date:</span>
              <span className="text-sm font-medium">
                {formattedDueDate}
                {daysUntilDue !== null && daysUntilDue > 0 ? ` (in ${daysUntilDue} days)` : ''}
              </span>
            </div>
          )}
          
          {nextHeatDate && !(status === ReproductiveStatus.Pregnant || status === 'pregnant') && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Next Heat:</span>
              <span className="text-sm font-medium">
                {formattedNextHeatDate}
                {daysUntilNextHeat !== null && daysUntilNextHeat > 0 ? ` (in ${daysUntilNextHeat} days)` : ''}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-1">
        <div className="flex flex-wrap gap-2 w-full">
          {handleStartHeat && !(status === ReproductiveStatus.InHeat || status === 'in_heat') && !(status === ReproductiveStatus.Pregnant || status === 'pregnant') && (
            <button 
              className="px-3 py-1.5 text-xs bg-red-100 text-red-800 hover:bg-red-200 rounded-md transition-colors flex-1"
              onClick={handleStartHeat}
            >
              Start Heat
            </button>
          )}
          
          {handleEndHeat && (status === ReproductiveStatus.InHeat || status === 'in_heat') && (
            <button 
              className="px-3 py-1.5 text-xs bg-green-100 text-green-800 hover:bg-green-200 rounded-md transition-colors flex-1"
              onClick={handleEndHeat}
            >
              End Heat
            </button>
          )}
          
          {handleConfirmPregnancy && (status === ReproductiveStatus.InHeat || status === 'in_heat') && (
            <button 
              className="px-3 py-1.5 text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-md transition-colors flex-1"
              onClick={handleConfirmPregnancy}
            >
              Confirm Pregnancy
            </button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ReproductiveStatusCard;
