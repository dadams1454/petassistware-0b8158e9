
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Calendar, Check, AlertTriangle, ArrowRight } from 'lucide-react';
import { Dog } from '@/types/dog';
import { Gender } from '@/types/common';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays } from 'date-fns';
import { useDogStatus } from '@/components/dogs/hooks/useDogStatus';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface BreedingPreparationProps {
  dogId?: string;
}

interface ExtendedDog {
  birthdate: string;
  breed: string;
  color: string;
  created_at: string;
  gender: string;
  id: string;
  is_pregnant: boolean;
  last_heat_date: string;
  last_vaccination_date: string;
  litter_number: number;
  microchip_number: string;
  name: string;
  notes: string;
  photo_url: string;
  pedigree: boolean;
  registration_number: string;
  requires_special_handling: boolean;
  status: string; // Required status property
  tenant_id: string;
  tie_date: string;
  vaccination_notes: string;
  vaccination_type: string;
  weight: number;
}

const BreedingPreparation: React.FC<BreedingPreparationProps> = ({ dogId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dog, setDog] = useState<ExtendedDog | null>(null);
  const [loading, setLoading] = useState(true);
  const [compatibleMales, setCompatibleMales] = useState<ExtendedDog[]>([]);
  const [selectedSire, setSelectedSire] = useState<string | null>(null);
  
  // Get dog ID from URL if not provided as prop
  const urlDogId = new URLSearchParams(location.search).get('dogId');
  const effectiveDogId = dogId || urlDogId;
  
  useEffect(() => {
    const fetchDogData = async () => {
      if (!effectiveDogId) {
        setLoading(false);
        return;
      }
      
      try {
        // Fetch the female dog data
        const { data: dogData, error: dogError } = await supabase
          .from('dogs')
          .select('*')
          .eq('id', effectiveDogId)
          .single();
          
        if (dogError) throw dogError;
        
        // Convert to Dog type with required status
        const dogWithStatus: ExtendedDog = {
          ...dogData,
          gender: (dogData.gender as Gender) || 'Female', // Ensure gender is typed correctly
          status: dogData.status || 'active' // Add status property
        };
        
        setDog(dogWithStatus);
        
        // Fetch compatible male dogs
        const { data: malesData, error: malesError } = await supabase
          .from('dogs')
          .select('*')
          .eq('gender', 'Male')
          .eq('breed', dogData.breed) // Same breed
          .neq('id', effectiveDogId) // Not the same dog
          .order('name');
          
        if (malesError) throw malesError;
        
        // Process and convert males to Dog type with status
        const malesWithStatus: ExtendedDog[] = malesData.map(male => ({
          ...male,
          gender: (male.gender as Gender) || 'Male',
          status: male.status || 'active' // Add status property
        }));
        
        setCompatibleMales(malesWithStatus);
      } catch (error) {
        console.error('Error fetching dog data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDogData();
  }, [effectiveDogId]);
  
  // Use our dog status hook to get heat cycle and fertility information
  const dogStatus = dog ? useDogStatus(dog as any) : null;
  
  const handleCreateLitter = () => {
    // Navigate to the add litter page with pre-filled information
    navigate(`/litters/new?damId=${effectiveDogId}${selectedSire ? `&sireId=${selectedSire}` : ''}`);
  };
  
  const handleSireSelect = (sireId: string) => {
    setSelectedSire(sireId === selectedSire ? null : sireId);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!dog) {
    return (
      <Alert className="max-w-3xl mx-auto">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Dog Not Found</AlertTitle>
        <AlertDescription>
          The selected dog could not be found. Please select a dog from your kennel.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (dog.gender !== 'Female') {
    return (
      <Alert className="max-w-3xl mx-auto">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Breeding Preparation</AlertTitle>
        <AlertDescription>
          This tool is designed for planning litters with female dogs. The selected dog is male.
          <div className="mt-4">
            <Button variant="outline" onClick={() => navigate('/dogs')}>
              Select a Female Dog
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }
  
  const isInHeat = dogStatus?.heatCycle?.isInHeat || false;
  const lastHeatDate = dogStatus?.heatCycle?.lastHeatDate;
  const nextHeatDate = dogStatus?.heatCycle?.nextHeatDate;
  const fertileStart = dogStatus?.heatCycle?.fertileDays?.start;
  const fertileEnd = dogStatus?.heatCycle?.fertileDays?.end;
  const isPregnant = dogStatus?.isPregnant || false;
  
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Breeding Preparation for {dog.name}</h1>
          <p className="text-muted-foreground">{dog.breed} • {dog.color || 'Unknown color'}</p>
        </div>
        <Button onClick={() => navigate('/litters')}>View All Litters</Button>
      </div>
      
      {/* Status Card */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <div className={`w-3 h-3 rounded-full mr-2 ${isInHeat ? 'bg-red-500' : isPregnant ? 'bg-pink-500' : 'bg-green-500'}`}></div>
                <span className="font-medium">
                  {isPregnant ? 'Currently Pregnant' : isInHeat ? 'Currently in Heat' : 'Not in Heat'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {lastHeatDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Last Heat Date</p>
                    <p className="font-medium">{format(lastHeatDate, 'MMM d, yyyy')}</p>
                  </div>
                )}
                
                {!isPregnant && nextHeatDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Next Heat (est.)</p>
                    <p className="font-medium">{format(nextHeatDate, 'MMM d, yyyy')}</p>
                  </div>
                )}
                
                {isInHeat && fertileStart && fertileEnd && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Fertile Window</p>
                    <p className="font-medium text-red-600">
                      {format(fertileStart, 'MMM d')} - {format(fertileEnd, 'MMM d, yyyy')}
                    </p>
                  </div>
                )}
                
                {isPregnant && dogStatus?.estimatedDueDate && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <p className="font-medium text-pink-600">{format(dogStatus.estimatedDueDate, 'MMM d, yyyy')}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-background rounded-lg p-4 border">
                <h3 className="font-medium mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                  Breeding Recommendations
                </h3>
                
                {isPregnant ? (
                  <div className="text-sm">
                    <p>Dam is currently pregnant. Create a litter to track the pregnancy and puppies.</p>
                    <Button 
                      className="mt-2 w-full" 
                      onClick={handleCreateLitter}
                    >
                      Create Litter for Pregnancy
                    </Button>
                  </div>
                ) : isInHeat ? (
                  <div className="text-sm">
                    <p className="text-green-600 font-medium">Optimal breeding time!</p>
                    <p>Select a sire below and create a breeding record.</p>
                  </div>
                ) : (
                  <div className="text-sm">
                    <p>The dam is not currently in heat.</p>
                    {nextHeatDate && (
                      <p>Plan for next heat cycle around {format(nextHeatDate, 'MMM d, yyyy')}.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Select Sire Section */}
      <Card>
        <CardHeader>
          <CardTitle>Select a Sire</CardTitle>
          <CardDescription>Choose a sire from your kennel</CardDescription>
        </CardHeader>
        <CardContent>
          {compatibleMales.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {compatibleMales.map((male) => (
                <div 
                  key={male.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedSire === male.id 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => handleSireSelect(male.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{male.name}</h3>
                      <p className="text-sm text-muted-foreground">{male.color || 'Unknown color'}</p>
                    </div>
                    {selectedSire === male.id && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  
                  {male.registration_number && (
                    <p className="text-xs mt-2">Reg: {male.registration_number}</p>
                  )}
                  
                  {male.birthdate && (
                    <p className="text-xs">DOB: {format(new Date(male.birthdate), 'MMM d, yyyy')}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No compatible males found in your kennel.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/dogs')}
              >
                Manage Dogs
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-4">
        <Button variant="outline" onClick={() => navigate('/litters')}>Cancel</Button>
        <Button 
          onClick={handleCreateLitter}
          disabled={isPregnant ? false : (!isInHeat || !selectedSire)}
        >
          {isPregnant ? 'Create Litter Record' : 'Plan Breeding'} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default BreedingPreparation;
