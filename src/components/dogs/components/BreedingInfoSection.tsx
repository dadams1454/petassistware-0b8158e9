
import React from 'react';
import { format, addDays } from 'date-fns';
import { Baby, Calendar, Heart, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface BreedingInfoSectionProps {
  lastHeatDate: Date | null;
  isPregnant: boolean;
  tieDate: Date | null;
  litterNumber: number;
  nextHeatDate: Date | null;
  hasVaccinationConflict: boolean;
}

const BreedingInfoSection: React.FC<BreedingInfoSectionProps> = ({
  lastHeatDate,
  isPregnant,
  tieDate,
  litterNumber,
  nextHeatDate,
  hasVaccinationConflict
}) => {
  // Calculate due date (63-65 days after tie date, we'll use 65 for safety)
  const dueDate = tieDate ? addDays(tieDate, 65) : null;

  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-sm">Breeding</h4>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Baby className="h-3.5 w-3.5 mr-1" />
          <span className="text-muted-foreground">Pregnant:</span>
        </div>
        <Badge 
          variant={isPregnant ? "default" : "outline"} 
          className={isPregnant ? "bg-pink-500" : ""}
        >
          {isPregnant ? "Yes" : "No"}
        </Badge>
      </div>

      {lastHeatDate && (
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span className="text-muted-foreground">Last Heat:</span>
          </div>
          <span>{format(lastHeatDate, 'PPP')}</span>
        </div>
      )}

      {nextHeatDate && !isPregnant && (
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span className="text-muted-foreground">Next Heat:</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-blue-600">{format(nextHeatDate, 'PPP')}</span>
            
            {hasVaccinationConflict && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="ml-1.5">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Warning: Heat cycle is predicted within 1 month of next vaccination. Consider rescheduling.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      )}

      {isPregnant && tieDate && (
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span className="text-muted-foreground">Tie Date:</span>
          </div>
          <span>{format(tieDate, 'PPP')}</span>
        </div>
      )}

      {isPregnant && dueDate && (
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span className="text-muted-foreground">Due Date:</span>
          </div>
          <span className="font-medium text-pink-600">{format(dueDate, 'PPP')}</span>
        </div>
      )}

      {litterNumber > 0 && (
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Heart className="h-3.5 w-3.5 mr-1" />
            <span className="text-muted-foreground">Litter:</span>
          </div>
          <span>{litterNumber} of 4</span>
        </div>
      )}
    </div>
  );
};

export default BreedingInfoSection;
