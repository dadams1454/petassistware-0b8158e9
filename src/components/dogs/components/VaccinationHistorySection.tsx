
import React from 'react';
import { format, addDays, isWithinInterval } from 'date-fns';
import { Shield, Calendar, AlertTriangle, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { VaccinationDisplay } from '../types/vaccination';
import { getVaccinationInfo } from '../utils/vaccinationUtils';

interface VaccinationHistorySectionProps {
  vaccinations: VaccinationDisplay[];
  isLoading: boolean;
  nextHeatDate: Date | null;
  isPregnant: boolean;
  dogGender: string;
}

const VaccinationHistorySection: React.FC<VaccinationHistorySectionProps> = ({
  vaccinations,
  isLoading,
  nextHeatDate,
  isPregnant,
  dogGender
}) => {
  // Check upcoming vaccinations that might conflict with heat cycle
  const upcomingVaccinations = vaccinations.map(vax => {
    const nextDate = addDays(vax.date, 365); // Assume annual vaccinations
    
    // Check for scheduling conflict with heat cycle
    const hasConflict = React.useMemo(() => {
      if (!nextHeatDate || isPregnant || dogGender !== 'Female') return false;
      
      // Check if vaccination is due within 30 days before or after the next heat
      const heatWindow = {
        start: addDays(nextHeatDate, -30),
        end: addDays(nextHeatDate, 30)
      };
      
      return isWithinInterval(nextDate, heatWindow);
    }, [nextDate, nextHeatDate, isPregnant]);
    
    return {
      ...vax,
      nextDate,
      hasConflict
    };
  });

  if (isLoading) {
    return (
      <div className="text-center py-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (vaccinations.length === 0) {
    return (
      <div className="text-muted-foreground italic text-xs">
        No vaccination history available. Add vaccinations using the form above.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {vaccinations.map((vax, index) => {
        // Get vaccination info for the tooltip
        const vaccinationTypeInfo = getVaccinationInfo(vax.type.toLowerCase());
        
        return (
          <div key={vax.id || index} className="border rounded-md p-3 bg-muted/10">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Shield className="h-3.5 w-3.5 mr-1" />
                <div className="flex items-center">
                  <span className="font-medium">{vax.type}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex ml-1 cursor-help">
                          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <div className="space-y-2">
                          <p className="font-medium">{vaccinationTypeInfo.name}</p>
                          <p className="text-xs">{vaccinationTypeInfo.description}</p>
                          <p className="text-xs font-medium mt-1">Recommended schedule:</p>
                          <p className="text-xs">{vaccinationTypeInfo.schedule}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <Badge variant="outline" className="font-normal">
                {format(vax.date, 'MMM d, yyyy')}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span className="text-muted-foreground">Next due:</span>
              </div>
              <div className="flex items-center">
                <span className={`font-medium ${upcomingVaccinations.find(v => v.id === vax.id)?.hasConflict ? 'text-amber-600' : 'text-green-600'}`}>
                  {format(addDays(vax.date, 365), 'MMM d, yyyy')}
                </span>
                
                {upcomingVaccinations.find(v => v.id === vax.id)?.hasConflict && dogGender === 'Female' && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="ml-1.5">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Warning: Next vaccination is due within 1 month of predicted heat cycle ({format(nextHeatDate!, 'PPP')}). Consider rescheduling.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
            
            {vax.notes && (
              <div className="mt-1 text-xs text-muted-foreground">
                {vax.notes}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default VaccinationHistorySection;
