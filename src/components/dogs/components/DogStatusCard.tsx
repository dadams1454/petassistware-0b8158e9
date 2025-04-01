
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDogStatus } from '../hooks/useDogStatus';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { Info, Calendar, AlertTriangle, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface DogStatusCardProps {
  dog: any;
}

const DogStatusCard: React.FC<DogStatusCardProps> = ({ dog }) => {
  const navigate = useNavigate();
  const { 
    isPregnant, 
    isInHeat, 
    nextVaccinationDue,
    lastHealthCheckup,
    age, 
    healthStatus,
    breedingStatus,
    nextHeatDate,
    estimatedDueDate,
    hasVaccinationHeatConflict
  } = useDogStatus(dog);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'good':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'fair':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'poor':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'unknown':
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  const getBreedingStatusColor = (status: string) => {
    switch (status) {
      case 'breeding':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'pregnant':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300';
      case 'heat':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'resting':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'not breeding':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  const handleVaccinationsClick = () => {
    navigate(`/dogs/${dog.id}?tab=health&section=vaccinations`);
  };
  
  const handleHealthClick = () => {
    navigate(`/dogs/${dog.id}?tab=health`);
  };
  
  const handleBreedingClick = () => {
    navigate(`/dogs/${dog.id}?tab=breeding`);
  };
  
  const handleReproductiveClick = () => {
    navigate(`/dogs/${dog.id}/reproductive`);
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          Status & Alerts
          <div className="flex space-x-1">
            {healthStatus && (
              <Badge variant="outline" className={`${getStatusColor(healthStatus)} text-xs`}>
                Health: {healthStatus}
              </Badge>
            )}
            {breedingStatus && dog.gender === 'Female' && (
              <Badge variant="outline" className={`${getBreedingStatusColor(breedingStatus)} text-xs`}>
                {breedingStatus}
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {/* Health Alerts */}
        <div className="space-y-2">
          {nextVaccinationDue && (
            <div className="flex items-start rounded-md bg-blue-50 dark:bg-blue-900/20 p-2 text-sm">
              <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 mr-2" />
              <div>
                <p className="font-medium">Vaccination due</p>
                <p className="text-muted-foreground text-xs">
                  {format(new Date(nextVaccinationDue), 'MMM d, yyyy')} ({formatDistanceToNow(new Date(nextVaccinationDue), { addSuffix: true })})
                </p>
              </div>
            </div>
          )}
          
          {lastHealthCheckup && (
            <div className="flex items-start rounded-md bg-slate-50 dark:bg-slate-900/20 p-2 text-sm">
              <Info className="h-4 w-4 text-slate-600 dark:text-slate-400 mt-0.5 mr-2" />
              <div>
                <p className="font-medium">Last checkup</p>
                <p className="text-muted-foreground text-xs">
                  {format(new Date(lastHealthCheckup), 'MMM d, yyyy')} ({formatDistanceToNow(new Date(lastHealthCheckup), { addSuffix: true })})
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Breeding Status for Female Dogs */}
        {dog.gender === 'Female' && (
          <div className="space-y-2">
            {isPregnant && estimatedDueDate && (
              <div className="flex items-start rounded-md bg-pink-50 dark:bg-pink-900/20 p-2 text-sm">
                <Heart className="h-4 w-4 text-pink-600 dark:text-pink-400 mt-0.5 mr-2" />
                <div>
                  <p className="font-medium">Currently pregnant</p>
                  <p className="text-muted-foreground text-xs">
                    Due date: {format(new Date(estimatedDueDate), 'MMM d, yyyy')} ({formatDistanceToNow(new Date(estimatedDueDate), { addSuffix: true })})
                  </p>
                </div>
              </div>
            )}
            
            {isInHeat && (
              <div className="flex items-start rounded-md bg-red-50 dark:bg-red-900/20 p-2 text-sm">
                <Calendar className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 mr-2" />
                <div>
                  <p className="font-medium">Currently in heat</p>
                  <p className="text-muted-foreground text-xs">
                    Special care and monitoring required
                  </p>
                </div>
              </div>
            )}
            
            {!isInHeat && !isPregnant && nextHeatDate && (
              <div className="flex items-start rounded-md bg-purple-50 dark:bg-purple-900/20 p-2 text-sm">
                <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5 mr-2" />
                <div>
                  <p className="font-medium">Next heat cycle</p>
                  <p className="text-muted-foreground text-xs">
                    Expected: {format(new Date(nextHeatDate), 'MMM d, yyyy')} ({formatDistanceToNow(new Date(nextHeatDate), { addSuffix: true })})
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {hasVaccinationHeatConflict && (
          <div className="flex items-start rounded-md bg-amber-50 dark:bg-amber-900/20 p-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 mr-2" />
            <div>
              <p className="font-medium">Scheduling conflict</p>
              <p className="text-muted-foreground text-xs">
                Vaccination scheduled during projected heat cycle
              </p>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleVaccinationsClick}
              className="text-xs"
            >
              Vaccinations
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleHealthClick}
              className="text-xs"
            >
              Health Records
            </Button>
          </div>
          
          {dog.gender === 'Female' && (
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBreedingClick}
                className="text-xs"
              >
                Breeding Status
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleReproductiveClick}
                className="text-xs"
              >
                Reproductive Mgmt
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DogStatusCard;
