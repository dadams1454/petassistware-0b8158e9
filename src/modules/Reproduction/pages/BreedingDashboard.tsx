
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertTriangle,
  Calendar,
  Heart,
  Clock,
  ArrowRight,
  Search,
  Plus
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { format, addDays } from 'date-fns';

interface Dog {
  id: string;
  name: string;
  breed: string;
  gender: string;
  birthdate: string;
  photoUrl?: string; // Changed from photo_url to photoUrl
}

interface BreedingDashboardProps {
  // Props if needed
}

const useBreedingManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [breedingData, setBreedingData] = useState<any>(null);
  const [femaleDogs, setFemaleDogs] = useState<Dog[]>([]);
  const [maleDogs, setMaleDogs] = useState<Dog[]>([]);

  const fetchDogs = async () => {
    try {
      // Fetch female dogs
      const { data: females, error: femaleError } = await supabase
        .from('dogs')
        .select('*')
        .eq('gender', 'Female');

      if (femaleError) throw femaleError;
      
      // Fetch male dogs
      const { data: males, error: maleError } = await supabase
        .from('dogs')
        .select('*')
        .eq('gender', 'Male');

      if (maleError) throw maleError;
      
      setFemaleDogs(females || []);
      setMaleDogs(males || []);
      setIsLoading(false);
    } catch (err: any) {
      console.error('Error fetching dogs:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  const fetchBreedingData = async (dogId: string) => {
    try {
      const { data, error } = await supabase
        .from('breeding_records')
        .select('*')
        .eq('dam_id', dogId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setBreedingData(data);
      return data;
    } catch (err: any) {
      console.error('Error fetching breeding data:', err);
      setError(err.message);
      return null;
    }
  };

  useEffect(() => {
    fetchDogs();
  }, []);

  return { isLoading, error, breedingData, fetchBreedingData, femaleDogs, maleDogs };
};

const BreedingDashboard: React.FC<BreedingDashboardProps> = () => {
  const navigate = useNavigate();
  const { isLoading, error, breedingData, femaleDogs, maleDogs } = useBreedingManagement();
  const [currentTab, setCurrentTab] = useState('females');
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateBreeding = () => {
    navigate('/reproduction/breeding/new');
  };

  const filteredFemaleDogs = femaleDogs.filter(dog => 
    dog.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    dog.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMaleDogs = maleDogs.filter(dog => 
    dog.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    dog.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="w-full p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-slate-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Error loading breeding data: {error}
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Breeding Management</h1>
          <p className="text-muted-foreground">Manage your breeding program and track breeding status</p>
        </div>
        <Button onClick={handleCreateBreeding}>
          <Plus className="h-4 w-4 mr-2" />
          Record Breeding
        </Button>
      </div>
      
      <div className="w-full space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Tabs defaultValue="females" className="w-full" onValueChange={setCurrentTab}>
            <TabsList>
              <TabsTrigger value="females">Female Dogs</TabsTrigger>
              <TabsTrigger value="males">Male Dogs</TabsTrigger>
              <TabsTrigger value="planned">Planned Breedings</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search dogs..."
              className="pl-8 h-9 w-full sm:w-[200px] rounded-md border border-input bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs value={currentTab}>
          <TabsContent value="females" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFemaleDogs.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No female dogs found.</p>
                </div>
              ) : (
                filteredFemaleDogs.map(dog => (
                  <Card key={dog.id} className="overflow-hidden">
                    <div className="aspect-[4/3] relative">
                      {dog.photoUrl ? (
                        <img 
                          src={dog.photoUrl} 
                          alt={dog.name} 
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="bg-slate-200 w-full h-full flex items-center justify-center">
                          <Heart className="h-12 w-12 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="text-xl">{dog.name}</CardTitle>
                      <CardDescription>{dog.breed}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Age</p>
                          <p>{calculateAge(dog.birthdate)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Heat</p>
                          <p>Unknown</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full mt-4"
                        onClick={() => navigate(`/dogs/${dog.id}/reproductive`)}
                      >
                        Reproductive Management
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="males" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMaleDogs.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No male dogs found.</p>
                </div>
              ) : (
                filteredMaleDogs.map(dog => (
                  <Card key={dog.id} className="overflow-hidden">
                    <div className="aspect-[4/3] relative">
                      {dog.photoUrl ? (
                        <img 
                          src={dog.photoUrl} 
                          alt={dog.name} 
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="bg-slate-200 w-full h-full flex items-center justify-center">
                          <Heart className="h-12 w-12 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="text-xl">{dog.name}</CardTitle>
                      <CardDescription>{dog.breed}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Age</p>
                          <p>{calculateAge(dog.birthdate)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Stud Service</p>
                          <p>Available</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full mt-4"
                        onClick={() => navigate(`/dogs/${dog.id}`)}
                      >
                        View Profile
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="planned" className="space-y-4">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Planned breedings will appear here.</p>
              <Button className="mt-4" onClick={handleCreateBreeding}>
                <Plus className="h-4 w-4 mr-2" />
                Record New Breeding
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Helper function to calculate age from birthdate
const calculateAge = (birthdate: string) => {
  if (!birthdate) return 'Unknown';
  
  const birth = new Date(birthdate);
  const now = new Date();
  const yearDiff = now.getFullYear() - birth.getFullYear();
  
  // Adjust if birthday hasn't occurred yet this year
  const hasBirthdayOccurred = 
    now.getMonth() > birth.getMonth() || 
    (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate());
  
  const age = hasBirthdayOccurred ? yearDiff : yearDiff - 1;
  
  return age === 1 ? `${age} year` : `${age} years`;
};

export default BreedingDashboard;
