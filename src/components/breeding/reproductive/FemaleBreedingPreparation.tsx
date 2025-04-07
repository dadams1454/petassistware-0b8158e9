
import React from 'react';
import { format, addDays } from 'date-fns';
import { Calendar, Clock, HeartPulse, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dog } from '@/types/dog';
import { BreedingRecord, HeatCycle } from '@/types/reproductive';

interface FemaleBreedingPreparationProps {
  dog: Dog;
  breedingData?: {
    heatCycles?: HeatCycle[];
    breedingRecords?: BreedingRecord[];
    estimatedNextHeat?: string;
    daysUntilNextHeat?: number;
    isInHeat?: boolean;
    isPregnant?: boolean;
    estimatedDueDate?: string;
  };
}

const FemaleBreedingPreparation: React.FC<FemaleBreedingPreparationProps> = ({ dog, breedingData }) => {
  const lastHeatDate = dog.last_heat_date || breedingData?.heatCycles?.[0]?.start_date;
  const daysUntilNextHeat = breedingData?.daysUntilNextHeat || null;
  const estimatedNextHeat = breedingData?.estimatedNextHeat;
  const isInHeat = breedingData?.isInHeat || false;
  const isPregnant = dog.is_pregnant || breedingData?.isPregnant || false;
  const estimatedDueDate = breedingData?.estimatedDueDate || 
    (dog.tie_date ? format(addDays(new Date(dog.tie_date), 63), 'yyyy-MM-dd') : null);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HeartPulse className="h-5 w-5 text-pink-500" />
          Breeding Preparation
          {isInHeat && <Badge className="ml-2 bg-pink-500">In Heat</Badge>}
          {isPregnant && <Badge className="ml-2 bg-blue-500">Pregnant</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Reproductive health and breeding preparation details for {dog.name}.
        </p>
        
        <div className="space-y-4">
          {isInHeat && (
            <Alert className="bg-pink-50 border-pink-200">
              <AlertCircle className="h-4 w-4 text-pink-500" />
              <AlertDescription className="text-pink-800">
                {dog.name} is currently in heat. Monitor closely for breeding opportunities.
              </AlertDescription>
            </Alert>
          )}
          
          {isPregnant && (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-800">
                {dog.name} is pregnant. Estimated due date: {estimatedDueDate || 'Not calculated'}.
              </AlertDescription>
            </Alert>
          )}
          
          <div>
            <h3 className="font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              Heat Cycle Status
            </h3>
            <div className="ml-6 mt-1">
              <p className="text-sm">{isInHeat ? 'Currently in heat' : 'Not in heat'}</p>
              {lastHeatDate && (
                <p className="text-sm text-gray-600">
                  Last heat started: {format(new Date(lastHeatDate), 'MMM d, yyyy')}
                </p>
              )}
              {!isInHeat && estimatedNextHeat && (
                <p className="text-sm text-gray-600">
                  Next heat estimated: {format(new Date(estimatedNextHeat), 'MMM d, yyyy')}
                  {daysUntilNextHeat !== null && ` (in ~${daysUntilNextHeat} days)`}
                </p>
              )}
            </div>
          </div>
          
          {dog.tie_date && (
            <div>
              <h3 className="font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                Last Breeding
              </h3>
              <div className="ml-6 mt-1">
                <p className="text-sm">
                  Last successful breeding: {format(new Date(dog.tie_date), 'MMM d, yyyy')}
                </p>
                {estimatedDueDate && (
                  <p className="text-sm text-gray-600">
                    Estimated due date: {format(new Date(estimatedDueDate), 'MMM d, yyyy')}
                  </p>
                )}
              </div>
            </div>
          )}
          
          {breedingData?.breedingRecords && breedingData.breedingRecords.length > 0 && (
            <div>
              <h3 className="font-medium">Recent Breeding Records</h3>
              <ul className="ml-6 mt-1 space-y-2">
                {breedingData.breedingRecords.slice(0, 3).map(record => (
                  <li key={record.id} className="text-sm">
                    {format(new Date(record.breeding_date), 'MMM d, yyyy')} - 
                    Bred with {record.sire?.name || 'Unknown sire'}
                    {record.success && ' (Successful)'}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {(!breedingData?.breedingRecords || breedingData.breedingRecords.length === 0) && (
            <div>
              <h3 className="font-medium">Recent Breeding Records</h3>
              <p className="text-sm text-gray-500 ml-6 mt-1">No recent breeding records found.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FemaleBreedingPreparation;
