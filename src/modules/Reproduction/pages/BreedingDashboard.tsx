
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Heart, UserPlus, Calendar, Dog } from 'lucide-react';
import { Dog as DogType } from '@/types/dog';
import RecordBreedingDialog from '@/components/dogs/components/breeding/RecordBreedingDialog';
import { useBreedingPreparation } from '@/hooks/breeding/useBreedingPreparation';

const BreedingDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isRecordBreedingOpen, setIsRecordBreedingOpen] = useState(false);
  const [selectedDamId, setSelectedDamId] = useState<string | undefined>(undefined);
  
  // Fetch female dogs for breeding
  const { data: females = [], isLoading: isFemalesLoading } = useQuery({
    queryKey: ['breeding-females'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('gender', 'Female')
        .not('is_pregnant', 'eq', true)
        .order('name');
        
      if (error) throw error;
      return data as DogType[];
    }
  });
  
  // Fetch breeding records 
  const { data: breedingRecords = [], isLoading: isBreedingLoading } = useQuery({
    queryKey: ['recent-breeding-records'],
    queryFn: async () => {
      // This query might need adjustment depending on your actual schema
      const { data, error } = await supabase
        .from('dog_relationships')
        .select(`
          *,
          dogs:dog_id(*),
          related_dogs:related_dog_id(*)
        `)
        .eq('relationship_type', 'breeding')
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      return data;
    }
  });
  
  // We'll reuse the breeding preparation hook for its data
  const { 
    femaleDogs, 
    maleDogs, 
    isLoading: isBreedingPrepLoading 
  } = useBreedingPreparation();
  
  const isLoading = isFemalesLoading || isBreedingLoading || isBreedingPrepLoading;
  
  const handleOpenBreeding = (damId?: string) => {
    setSelectedDamId(damId);
    setIsRecordBreedingOpen(true);
  };
  
  const handleBreedingSuccess = () => {
    setIsRecordBreedingOpen(false);
    // Refetch breeding data
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Breeding Management</h2>
        <Button onClick={() => handleOpenBreeding()}>
          <Heart className="mr-2 h-4 w-4" /> Record Breeding
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="females">Females</TabsTrigger>
          <TabsTrigger value="males">Males</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Recent Breeding Records */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Breeding Records</CardTitle>
            </CardHeader>
            <CardContent>
              {isBreedingLoading ? (
                <div className="animate-pulse text-center py-4">Loading breeding records...</div>
              ) : breedingRecords.length > 0 ? (
                <div className="space-y-4">
                  {breedingRecords.map((record) => (
                    <div key={record.id} className="flex justify-between items-center border-b pb-3">
                      <div>
                        <div className="font-medium">
                          {record.related_dogs?.name || 'Unknown Dam'} × {record.dogs?.name || 'Unknown Sire'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(record.created_at), 'MMM d, yyyy')}
                        </div>
                        <div className="text-sm">
                          Est. due: {format(addDays(new Date(record.created_at), 63), 'MMM d, yyyy')}
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate(`/reproduction/litters/new?damId=${record.related_dogs?.id}&sireId=${record.dogs?.id}`)}
                      >
                        Create Litter
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No breeding records found</p>
                  <Button 
                    variant="outline" 
                    onClick={() => handleOpenBreeding()} 
                    className="mt-2"
                  >
                    Record First Breeding
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button onClick={() => navigate('/reproduction/welping')}>
                  View Whelping Management
                </Button>
                <Button onClick={() => navigate('/reproduction/litters')}>
                  View Litters
                </Button>
                <Button onClick={() => navigate('/reproduction/litters/new')}>
                  Create New Litter
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('females')}>
                  Manage Breeding Females
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="females" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Breeding Females</CardTitle>
            </CardHeader>
            <CardContent>
              {isFemalesLoading ? (
                <div className="animate-pulse text-center py-4">Loading female dogs...</div>
              ) : females.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {females.map(dog => (
                    <Card key={dog.id} className="overflow-hidden">
                      <div className="h-32 bg-gray-100 flex items-center justify-center">
                        {dog.photo_url ? (
                          <img 
                            src={dog.photo_url} 
                            alt={dog.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Dog className="h-12 w-12 text-gray-400" />
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg">{dog.name}</h3>
                        <p className="text-sm text-muted-foreground">{dog.breed}</p>
                        
                        {dog.last_heat_date && (
                          <div className="mt-2 text-sm">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Last heat: {format(new Date(dog.last_heat_date), 'MMM d, yyyy')}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex mt-4 space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => navigate(`/dogs/${dog.id}`)}
                            className="flex-1"
                          >
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleOpenBreeding(dog.id)}
                            className="flex-1"
                          >
                            Breed
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No female dogs found</p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/dogs/new')} 
                    className="mt-2"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Dog
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="males" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Breeding Males</CardTitle>
            </CardHeader>
            <CardContent>
              {isBreedingPrepLoading ? (
                <div className="animate-pulse text-center py-4">Loading male dogs...</div>
              ) : maleDogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {maleDogs.map(dog => (
                    <Card key={dog.id} className="overflow-hidden">
                      <div className="h-32 bg-gray-100 flex items-center justify-center">
                        {dog.photo_url ? (
                          <img 
                            src={dog.photo_url} 
                            alt={dog.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Dog className="h-12 w-12 text-gray-400" />
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg">{dog.name}</h3>
                        <p className="text-sm text-muted-foreground">{dog.breed}</p>
                        
                        <div className="flex mt-4">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => navigate(`/dogs/${dog.id}`)}
                            className="w-full"
                          >
                            View Profile
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No male dogs found</p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/dogs/new')} 
                    className="mt-2"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Dog
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Record Breeding Dialog */}
      <RecordBreedingDialog
        open={isRecordBreedingOpen}
        onOpenChange={setIsRecordBreedingOpen}
        damId={selectedDamId}
        onSuccess={handleBreedingSuccess}
      />
    </div>
  );
};

export default BreedingDashboard;
