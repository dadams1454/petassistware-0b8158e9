
import React from 'react';
import { format } from 'date-fns';
import { Plus, Trash2, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDogVaccinations } from '../hooks/useDogVaccinations';
import VaccinationForm from './VaccinationForm';
import { Card, CardContent } from '@/components/ui/card';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getVaccinationInfo } from '../utils/vaccinationUtils';

interface VaccinationManagerProps {
  dogId: string;
}

const VaccinationManager: React.FC<VaccinationManagerProps> = ({ dogId }) => {
  const {
    vaccinations,
    isLoading,
    isAddingVaccination,
    setIsAddingVaccination,
    addVaccination,
    deleteVaccination,
    isAdding,
    isDeleting,
  } = useDogVaccinations(dogId);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-sm">Vaccination Records</h4>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAddingVaccination(true)}
          className="text-xs"
        >
          <Plus className="h-3 w-3 mr-1" /> Add Vaccination
        </Button>
      </div>

      {isAddingVaccination && (
        <VaccinationForm 
          dogId={dogId}
          onSubmit={addVaccination}
          onCancel={() => setIsAddingVaccination(false)}
          isSubmitting={isAdding}
        />
      )}

      {isLoading ? (
        <div className="text-center py-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : vaccinations && vaccinations.length > 0 ? (
        <div className="grid gap-2">
          {vaccinations.map((vaccination) => {
            // Get vaccination info for tooltip
            const vacInfo = getVaccinationInfo(vaccination.vaccination_type);
            
            return (
              <Card key={vaccination.id} className="overflow-hidden">
                <CardContent className="p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm flex items-center">
                        {vacInfo.name}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex ml-1.5 cursor-help">
                                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs p-3">
                              <div className="space-y-2">
                                <p className="font-medium">{vacInfo.name}</p>
                                <p className="text-xs">{vacInfo.description}</p>
                                <p className="text-xs font-medium mt-1">Recommended schedule:</p>
                                <p className="text-xs">{vacInfo.schedule}</p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(vaccination.vaccination_date), 'MMM d, yyyy')}
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                            <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive cursor-pointer"
                          onClick={() => deleteVaccination(vaccination.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {vaccination.notes && (
                    <div className="mt-2 text-xs border-t pt-2 text-muted-foreground">
                      {vaccination.notes}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-muted-foreground italic text-xs p-2">
          No vaccination records found
        </div>
      )}
    </div>
  );
};

export default VaccinationManager;
