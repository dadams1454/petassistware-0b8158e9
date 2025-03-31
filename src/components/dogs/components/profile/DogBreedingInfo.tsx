
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Calendar, AlertTriangle } from 'lucide-react';
import { useDogStatus } from '../../hooks/useDogStatus';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface DogBreedingInfoProps {
  dog: any;
}

const DogBreedingInfo: React.FC<DogBreedingInfoProps> = ({ dog }) => {
  const navigate = useNavigate();
  
  // Only show detailed information for female dogs
  if (dog.gender !== 'Female') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Breeding Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Male dogs don't have heat cycles</p>
              <p className="text-sm mt-1">View detailed breeding information on the dog details page</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/dogs/${dog.id}?tab=breeding`)}
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const { 
    isPregnant, 
    heatCycle, 
    tieDate,
    estimatedDueDate,
    hasVaccinationHeatConflict
  } = useDogStatus(dog);
  
  const { 
    isInHeat, 
    isPreHeat, 
    lastHeatDate, 
    nextHeatDate,
    currentStage,
    daysUntilNextHeat
  } = heatCycle;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Breeding Information</span>
          {(isPregnant || isInHeat || isPreHeat) && (
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              isPregnant 
                ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300' 
                : isInHeat 
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
            }`}>
              {isPregnant 
                ? 'Pregnant' 
                : isInHeat
                  ? `In Heat${currentStage ? ` (${currentStage.name})` : ''}`
                  : 'Heat Approaching'}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isPregnant && (
            <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-md border border-pink-200 dark:border-pink-800">
              <div className="flex items-start">
                <Heart className="h-5 w-5 text-pink-600 dark:text-pink-400 mt-0.5 mr-2" />
                <div>
                  <p className="font-medium">Currently Pregnant</p>
                  {tieDate && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Breeding date: {format(new Date(tieDate), 'MMM d, yyyy')}
                    </p>
                  )}
                  {estimatedDueDate && (
                    <p className="text-sm font-medium mt-1">
                      Due date: {format(estimatedDueDate, 'MMM d, yyyy')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {isInHeat && !isPregnant && currentStage && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md border border-red-200 dark:border-red-800">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2" />
                <div>
                  <p className="font-medium">In Heat - {currentStage.name} Stage</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentStage.description}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {isPreHeat && !isInHeat && !isPregnant && nextHeatDate && (
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md border border-purple-200 dark:border-purple-800">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 mr-2" />
                <div>
                  <p className="font-medium">Heat Cycle Approaching</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Expected in {daysUntilNextHeat} days ({format(nextHeatDate, 'MMM d, yyyy')})
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Heat Date</h3>
              <p>{lastHeatDate ? format(lastHeatDate, 'MMM d, yyyy') : 'Not recorded'}</p>
            </div>
            
            {!isPregnant && nextHeatDate && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Next Heat (est.)</h3>
                <p>{format(nextHeatDate, 'MMM d, yyyy')}</p>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Litter Count</h3>
              <p>{dog.litter_number || '0'}</p>
            </div>
            
            {isPregnant && tieDate && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Breeding Date</h3>
                <p>{format(new Date(tieDate), 'MMM d, yyyy')}</p>
              </div>
            )}
          </div>
          
          {hasVaccinationHeatConflict && (
            <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md border border-amber-200 dark:border-amber-800 text-sm">
              <div className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
                <p>Warning: Vaccination schedule conflicts with projected heat cycle. Consider rescheduling.</p>
              </div>
            </div>
          )}
          
          <div className="pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => navigate(`/dogs/${dog.id}?tab=breeding`)}
            >
              View Detailed Breeding Information
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DogBreedingInfo;
