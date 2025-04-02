
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Heart, 
  AlertTriangle, 
  Baby, 
  Plus, 
  ArrowRight,
  StethoscopeIcon
} from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface ReproductiveDog {
  id: string;
  name: string;
  gender: string;
  status?: 'in_heat' | 'pregnant' | 'normal';
  last_heat_date?: string;
  next_heat_date?: string;
  breeding_date?: string;
  due_date?: string;
}

const useReproductiveStatus = () => {
  const [dogsInHeat, setDogsInHeat] = useState<ReproductiveDog[]>([]);
  const [pregnantDogs, setPregnantDogs] = useState<ReproductiveDog[]>([]);
  const [upcomingCycles, setUpcomingCycles] = useState<ReproductiveDog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchReproductiveData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch dogs with reproductive data
      const { data, error } = await supabase
        .from('dogs')
        .select(`
          id,
          name,
          gender,
          reproductive_status:reproductive_status(
            status,
            last_heat_date,
            next_heat_date,
            breeding_date,
            due_date
          )
        `)
        .eq('gender', 'Female');
      
      if (error) throw error;
      
      // Process data into categories
      const inHeat: ReproductiveDog[] = [];
      const pregnant: ReproductiveDog[] = [];
      const upcoming: ReproductiveDog[] = [];
      
      data?.forEach(dog => {
        const status = dog.reproductive_status?.[0]?.status;
        
        if (status === 'in_heat') {
          inHeat.push({
            id: dog.id,
            name: dog.name,
            gender: dog.gender,
            status: 'in_heat',
            last_heat_date: dog.reproductive_status?.[0]?.last_heat_date,
            next_heat_date: dog.reproductive_status?.[0]?.next_heat_date
          });
        } else if (status === 'pregnant') {
          pregnant.push({
            id: dog.id,
            name: dog.name,
            gender: dog.gender,
            status: 'pregnant',
            breeding_date: dog.reproductive_status?.[0]?.breeding_date,
            due_date: dog.reproductive_status?.[0]?.due_date
          });
        } else if (dog.reproductive_status?.[0]?.next_heat_date) {
          // If next heat date is within 30 days, add to upcoming
          const nextHeat = new Date(dog.reproductive_status[0].next_heat_date);
          const daysUntil = differenceInDays(nextHeat, new Date());
          
          if (daysUntil >= 0 && daysUntil <= 30) {
            upcoming.push({
              id: dog.id,
              name: dog.name,
              gender: dog.gender,
              status: 'normal',
              last_heat_date: dog.reproductive_status?.[0]?.last_heat_date,
              next_heat_date: dog.reproductive_status?.[0]?.next_heat_date
            });
          }
        }
      });
      
      setDogsInHeat(inHeat);
      setPregnantDogs(pregnant);
      setUpcomingCycles(upcoming);
    } catch (err: any) {
      console.error('Error fetching reproductive data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReproductiveData();
  }, []);
  
  return {
    dogsInHeat,
    pregnantDogs,
    upcomingCycles,
    isLoading,
    error,
    refetch: fetchReproductiveData
  };
};

const ReproductiveDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    dogsInHeat, 
    pregnantDogs, 
    upcomingCycles, 
    isLoading, 
    error 
  } = useReproductiveStatus();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reproductive Dashboard</h1>
          <p className="text-muted-foreground">Monitor reproductive cycles and pregnancy status</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/reproduction/breeding')}>
            <Heart className="h-4 w-4 mr-2" />
            Breeding Management
          </Button>
          <Button onClick={() => navigate('/reproduction/welping')}>
            <Baby className="h-4 w-4 mr-2" />
            Whelping Management
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="bg-red-50 dark:bg-red-950/20">
            <CardTitle className="flex items-center text-red-700 dark:text-red-400">
              <Heart className="h-5 w-5 mr-2" /> 
              Dogs in Heat
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {dogsInHeat.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No dogs currently in heat</p>
              </div>
            ) : (
              <ul className="divide-y">
                {dogsInHeat.map(dog => (
                  <li key={dog.id} className="p-4 hover:bg-muted/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{dog.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Heat started: {dog.last_heat_date 
                            ? format(new Date(dog.last_heat_date), 'MMM d, yyyy')
                            : 'Unknown'}
                        </p>
                      </div>
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-200">In Heat</Badge>
                    </div>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto mt-2 text-sm"
                      onClick={() => navigate(`/dogs/${dog.id}/reproductive`)}
                    >
                      Manage Heat Cycle
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          <CardFooter className="border-t p-4">
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => navigate('/reproduction/breeding')}
            >
              View All Heat Cycles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="bg-pink-50 dark:bg-pink-950/20">
            <CardTitle className="flex items-center text-pink-700 dark:text-pink-400">
              <StethoscopeIcon className="h-5 w-5 mr-2" /> 
              Pregnant Dogs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {pregnantDogs.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No dogs currently pregnant</p>
              </div>
            ) : (
              <ul className="divide-y">
                {pregnantDogs.map(dog => (
                  <li key={dog.id} className="p-4 hover:bg-muted/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{dog.name}</h3>
                        <div className="text-sm space-y-1 mt-1">
                          <p className="text-muted-foreground flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Due: {dog.due_date 
                              ? format(new Date(dog.due_date), 'MMM d, yyyy')
                              : 'Unknown'}
                          </p>
                          {dog.due_date && (
                            <p className="text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {calculateTimeUntilDue(dog.due_date)}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200">Pregnant</Badge>
                    </div>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto mt-2 text-sm"
                      onClick={() => navigate(`/dogs/${dog.id}/reproductive`)}
                    >
                      View Pregnancy Details
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          <CardFooter className="border-t p-4">
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => navigate('/reproduction/welping')}
            >
              Whelping Management
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="bg-blue-50 dark:bg-blue-950/20">
            <CardTitle className="flex items-center text-blue-700 dark:text-blue-400">
              <Calendar className="h-5 w-5 mr-2" /> 
              Upcoming Heat Cycles
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {upcomingCycles.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No upcoming heat cycles</p>
              </div>
            ) : (
              <ul className="divide-y">
                {upcomingCycles.map(dog => (
                  <li key={dog.id} className="p-4 hover:bg-muted/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{dog.name}</h3>
                        <div className="text-sm space-y-1 mt-1">
                          <p className="text-muted-foreground flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Expected: {dog.next_heat_date 
                              ? format(new Date(dog.next_heat_date), 'MMM d, yyyy')
                              : 'Unknown'}
                          </p>
                          {dog.next_heat_date && (
                            <p className="text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              In {calculateDaysUntil(dog.next_heat_date)} days
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        {dog.next_heat_date && calculateDaysUntil(dog.next_heat_date) <= 7 
                          ? 'Imminent' 
                          : 'Upcoming'}
                      </Badge>
                    </div>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto mt-2 text-sm"
                      onClick={() => navigate(`/dogs/${dog.id}/reproductive`)}
                    >
                      View Heat Cycle History
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          <CardFooter className="border-t p-4">
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => navigate('/reproduction/breeding')}
            >
              Breeding Preparation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Litters</CardTitle>
            <CardDescription>Your recently whelped litters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <Baby className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No recent litters found</p>
            </div>
          </CardContent>
          <CardFooter className="border-t">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/reproduction/litters')}
            >
              View All Litters
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Planned Breedings</CardTitle>
            <CardDescription>Your scheduled breeding plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No planned breedings</p>
            </div>
          </CardContent>
          <CardFooter className="border-t">
            <Button 
              className="w-full"
              onClick={() => navigate('/reproduction/breeding/new')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Plan New Breeding
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

// Helper function to calculate days until due date
const calculateTimeUntilDue = (dueDate: string) => {
  const due = new Date(dueDate);
  const today = new Date();
  const daysLeft = differenceInDays(due, today);
  
  if (daysLeft < 0) {
    return `Overdue by ${Math.abs(daysLeft)} days`;
  } else if (daysLeft === 0) {
    return 'Due today!';
  } else if (daysLeft <= 7) {
    return `${daysLeft} days left`;
  } else {
    const weeks = Math.floor(daysLeft / 7);
    const remainingDays = daysLeft % 7;
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}${remainingDays > 0 ? `, ${remainingDays} ${remainingDays === 1 ? 'day' : 'days'}` : ''} left`;
  }
};

// Helper function to calculate days until a date
const calculateDaysUntil = (date: string) => {
  const targetDate = new Date(date);
  const today = new Date();
  return Math.max(0, differenceInDays(targetDate, today));
};

export default ReproductiveDashboard;
