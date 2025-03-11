
import React, { useState, useEffect } from 'react';
import { format, addDays, differenceInDays, isWithinInterval, parseISO } from 'date-fns';
import { Baby, Calendar, Heart, Syringe, Shield, AlertTriangle, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { VaccinationDisplay } from './types/vaccination';
import { supabase } from '@/integrations/supabase/client';

interface DogHealthSectionProps {
  dog: any;
}

// Type to handle the Supabase response
type VaccinationResponse = {
  id: string;
  dog_id: string;
  vaccination_type: string;
  vaccination_date: string;
  notes: string | null;
  created_at: string;
}

const DogHealthSection: React.FC<DogHealthSectionProps> = ({ dog }) => {
  const [vaccinations, setVaccinations] = useState<VaccinationDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Extract relevant health data from the dog object
  const lastHeatDate = dog.last_heat_date ? new Date(dog.last_heat_date) : null;
  const isPregnant = dog.is_pregnant || false;
  const tieDate = dog.tie_date ? new Date(dog.tie_date) : null;
  const litterNumber = dog.litter_number || 0;

  // Calculate next heat date (approximately 6 months after last heat)
  const nextHeatDate = lastHeatDate ? addDays(lastHeatDate, 180) : null;
  
  // Calculate due date (63-65 days after tie date, we'll use 65 for safety)
  const dueDate = tieDate ? addDays(tieDate, 65) : null;

  // Fetch dog vaccinations
  useEffect(() => {
    const fetchVaccinations = async () => {
      if (!dog.id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('dog_vaccinations')
          .select('*')
          .eq('dog_id', dog.id)
          .order('vaccination_date', { ascending: false }) as { data: VaccinationResponse[] | null, error: any };
        
        if (error) throw error;
        
        // Transform data to display format
        const displayData: VaccinationDisplay[] = (data || []).map(vax => ({
          type: getVaccinationTypeLabel(vax.vaccination_type),
          date: new Date(vax.vaccination_date),
          notes: vax.notes || undefined,
          id: vax.id
        }));
        
        setVaccinations(displayData);
      } catch (error) {
        console.error('Error fetching vaccinations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVaccinations();
  }, [dog.id]);

  // Get most recent vaccination of each type
  const getLatestVaccinations = () => {
    const latestByType = new Map<string, VaccinationDisplay>();
    
    vaccinations.forEach(vax => {
      if (!latestByType.has(vax.type) || vax.date > latestByType.get(vax.type)!.date) {
        latestByType.set(vax.type, vax);
      }
    });
    
    return Array.from(latestByType.values());
  };

  const latestVaccinations = getLatestVaccinations();
  
  // Check upcoming vaccinations that might conflict with heat cycle
  const upcomingVaccinations = latestVaccinations.map(vax => {
    const nextDate = addDays(vax.date, 365); // Assume annual vaccinations
    
    // Check for scheduling conflict with heat cycle
    const hasConflict = React.useMemo(() => {
      if (!nextHeatDate || isPregnant || dog.gender !== 'Female') return false;
      
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

  // Map vaccination type to human-readable name
  function getVaccinationTypeLabel(type: string) {
    const types: Record<string, string> = {
      'rabies': 'Rabies',
      'distemper': 'Distemper',
      'parvovirus': 'Parvovirus',
      'adenovirus': 'Adenovirus',
      'leptospirosis': 'Leptospirosis',
      'bordetella': 'Bordetella',
      'lyme': 'Lyme Disease',
      'combo': 'Combo (DHPP)'
    };
    return types[type] || type;
  }

  return (
    <div className="text-sm space-y-4">
      {/* Vaccination information */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-sm">Vaccination History</h4>
        </div>
        
        {isLoading ? (
          <div className="text-center py-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : vaccinations.length > 0 ? (
          <div className="space-y-3">
            {latestVaccinations.map((vax, index) => (
              <div key={vax.id || index} className="border rounded-md p-3 bg-muted/10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Shield className="h-3.5 w-3.5 mr-1" />
                    <span className="font-medium">{vax.type}</span>
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
                    
                    {upcomingVaccinations.find(v => v.id === vax.id)?.hasConflict && dog.gender === 'Female' && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="ml-1.5">
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>Warning: Next vaccination is due within 1 month of predicted heat cycle ({format(nextHeatDate, 'PPP')}). Consider rescheduling.</p>
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
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground italic text-xs">
            No vaccination information available
          </div>
        )}
      </div>

      {/* Only show breeding section for females */}
      {dog.gender === 'Female' && (
        <>
          <Separator className="my-2" />
          
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
                  
                  {upcomingVaccinations.some(v => v.hasConflict) && (
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
        </>
      )}
    </div>
  );
};

export default DogHealthSection;
