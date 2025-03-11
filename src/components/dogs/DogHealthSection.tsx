
import React from 'react';
import { format, addDays } from 'date-fns';
import { Baby, Calendar, Heart, Syringe, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface DogHealthSectionProps {
  dog: any;
}

const DogHealthSection: React.FC<DogHealthSectionProps> = ({ dog }) => {
  // Extract relevant health data from the dog object
  const lastHeatDate = dog.last_heat_date ? new Date(dog.last_heat_date) : null;
  const isPregnant = dog.is_pregnant || false;
  const tieDate = dog.tie_date ? new Date(dog.tie_date) : null;
  const litterNumber = dog.litter_number || 0;
  const lastVaccinationDate = dog.last_vaccination_date ? new Date(dog.last_vaccination_date) : null;
  const vaccinationType = dog.vaccination_type || '';
  const vaccinationNotes = dog.vaccination_notes || '';

  // Calculate next heat date (approximately 6 months after last heat)
  const nextHeatDate = lastHeatDate ? addDays(lastHeatDate, 180) : null;
  
  // Calculate due date (63-65 days after tie date, we'll use 65 for safety)
  const dueDate = tieDate ? addDays(tieDate, 65) : null;
  
  // Calculate next vaccination date (approximately 1 year after last vaccination)
  const nextVaccinationDate = lastVaccinationDate ? addDays(lastVaccinationDate, 365) : null;

  // Map vaccination type to human-readable name
  const getVaccinationTypeLabel = (type: string) => {
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
  };

  return (
    <div className="text-sm space-y-4">
      {/* Vaccination information */}
      <div className="space-y-2">
        <h4 className="font-semibold text-sm">Vaccination</h4>
        
        {lastVaccinationDate && (
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Syringe className="h-3.5 w-3.5 mr-1" />
              <span className="text-muted-foreground">Last Vaccination:</span>
            </div>
            <span>{format(lastVaccinationDate, 'PPP')}</span>
          </div>
        )}

        {vaccinationType && (
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Shield className="h-3.5 w-3.5 mr-1" />
              <span className="text-muted-foreground">Type:</span>
            </div>
            <span>{getVaccinationTypeLabel(vaccinationType)}</span>
          </div>
        )}

        {nextVaccinationDate && (
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span className="text-muted-foreground">Next Due:</span>
            </div>
            <span className="font-medium text-green-600">{format(nextVaccinationDate, 'PPP')}</span>
          </div>
        )}
        
        {vaccinationNotes && (
          <div className="mt-1 text-xs text-muted-foreground">
            {vaccinationNotes}
          </div>
        )}
        
        {!lastVaccinationDate && !vaccinationType && (
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
                <span className="font-medium text-blue-600">{format(nextHeatDate, 'PPP')}</span>
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
