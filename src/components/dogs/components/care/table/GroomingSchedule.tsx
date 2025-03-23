
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scissors, RefreshCw, Calendar } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';
import { format, addDays, isAfter, isBefore, parseISO } from 'date-fns';
import DogNameCell from './components/DogNameCell';
import { useNavigate } from 'react-router-dom';

interface GroomingScheduleProps {
  dogs: DogCareStatus[];
  onRefresh?: () => void;
}

const GroomingSchedule: React.FC<GroomingScheduleProps> = ({ dogs, onRefresh }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [groomingData, setGroomingData] = useState<any[]>([]);
  const navigate = useNavigate();
  
  // Mock grooming schedule data - in a real app, this would come from an API
  useEffect(() => {
    const mockGroomingData = dogs.map(dog => {
      const lastGrooming = new Date();
      lastGrooming.setDate(lastGrooming.getDate() - Math.floor(Math.random() * 30));
      
      const nextGrooming = addDays(lastGrooming, 30); // Schedule next grooming 30 days after last
      
      return {
        dogId: dog.dog_id,
        lastGrooming: lastGrooming.toISOString(),
        nextGrooming: nextGrooming.toISOString(),
        groomingType: Math.random() > 0.5 ? 'Full Groom' : 'Bath & Brush',
        notes: Math.random() > 0.7 ? 'Special coat care needed' : ''
      };
    });
    
    setGroomingData(mockGroomingData);
  }, [dogs]);
  
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (onRefresh) onRefresh();
    }, 1000);
  };
  
  const handleScheduleGrooming = (dogId: string) => {
    // Navigate to grooming scheduling page
    navigate(`/dogs/${dogId}/grooming`);
  };
  
  const handleCareLogClick = (dogId: string, dogName: string) => {
    console.log(`Opening grooming dialog for ${dogName} (ID: ${dogId})`);
    // In a real app, this would open a dialog to log grooming
  };
  
  const handleDogClick = (dogId: string) => {
    navigate(`/dogs/${dogId}`);
  };
  
  const getDueStatus = (nextGroomingDate: string) => {
    const today = new Date();
    const nextDate = parseISO(nextGroomingDate);
    
    if (isBefore(nextDate, today)) {
      return <span className="text-red-500 font-medium">Overdue</span>;
    }
    
    if (isBefore(nextDate, addDays(today, 7))) {
      return <span className="text-amber-500 font-medium">Due Soon</span>;
    }
    
    return <span className="text-green-500 font-medium">Scheduled</span>;
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Scissors className="h-5 w-5" />
          Grooming Schedule
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Dog</TableHead>
                <TableHead>Last Grooming</TableHead>
                <TableHead>Next Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dogs.length > 0 ? (
                dogs.map((dog, index) => {
                  const groomingInfo = groomingData.find(g => g.dogId === dog.dog_id);
                  if (!groomingInfo) return null;
                  
                  // Create adapter functions that match the expected signatures
                  const dogClickAdapter = () => handleDogClick(dog.dog_id);
                  const careLogClickAdapter = () => handleCareLogClick(dog.dog_id, dog.dog_name);
                  
                  return (
                    <TableRow key={dog.dog_id}>
                      <DogNameCell 
                        dog={dog} 
                        onClick={dogClickAdapter}
                        onCareLogClick={careLogClickAdapter}
                        activeCategory="grooming"
                        hasObservation={false}
                      />
                      <TableCell>
                        {format(parseISO(groomingInfo.lastGrooming), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        {format(parseISO(groomingInfo.nextGrooming), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        {getDueStatus(groomingInfo.nextGrooming)}
                      </TableCell>
                      <TableCell>{groomingInfo.groomingType}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleScheduleGrooming(dog.dog_id)}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No dogs available for grooming schedule
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroomingSchedule;
