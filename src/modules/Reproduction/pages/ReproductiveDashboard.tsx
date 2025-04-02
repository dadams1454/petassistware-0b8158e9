
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, differenceInDays, addDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Baby, Calendar, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ReproductiveDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Fetch active litters
  const { data: litters = [], isLoading: isLittersLoading } = useQuery({
    queryKey: ['active-litters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('litters')
        .select(`
          *,
          dam:dam_id(id, name, breed, color, photo_url),
          sire:sire_id(id, name, breed, color, photo_url),
          puppies:puppies(*)
        `)
        .order('birth_date', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      return data;
    }
  });
  
  // Fetch dogs in heat or pregnant
  const { data: reproductiveDogs = [], isLoading: isDogsLoading } = useQuery({
    queryKey: ['reproductive-dogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('gender', 'Female')
        .or('is_pregnant.eq.true,last_heat_date.gte.' + format(addDays(new Date(), -21), 'yyyy-MM-dd'))
        .order('last_heat_date', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      return data;
    }
  });
  
  // Fetch upcoming heat cycles based on previous cycles
  const { data: upcomingHeat = [], isLoading: isHeatLoading } = useQuery({
    queryKey: ['upcoming-heat'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('*, heat_cycles(*)')
        .eq('gender', 'Female')
        .not('is_pregnant', 'eq', true)
        .order('last_heat_date', { ascending: true })
        .limit(5);
        
      if (error) throw error;
      
      // Filter to dogs that might be coming into heat in the next 30 days
      // This is a client-side calculation based on average cycles or last heat date
      return data.filter(dog => {
        if (!dog.last_heat_date) return false;
        
        const lastHeat = new Date(dog.last_heat_date);
        const today = new Date();
        const daysSinceLastHeat = differenceInDays(today, lastHeat);
        
        // Assume average cycle of ~180 days if no other data
        // If dog had heat 150-210 days ago, they might be due soon
        return daysSinceLastHeat > 150 && daysSinceLastHeat < 210;
      });
    }
  });
  
  const isLoading = isLittersLoading || isDogsLoading || isHeatLoading;
  
  return (
    <div className="space-y-6">
      {/* Active Whelping and Pregnancies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Baby className="mr-2 h-5 w-5 text-purple-500" />
            Active Litters & Pregnancies
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-pulse">Loading dashboard data...</div>
            </div>
          ) : (
            <>
              {litters.length > 0 ? (
                <div className="space-y-4">
                  {litters.slice(0, 3).map(litter => (
                    <div key={litter.id} className="flex justify-between border-b pb-2">
                      <div>
                        <h3 className="font-medium">{litter.litter_name || 'Unnamed Litter'}</h3>
                        <p className="text-sm text-muted-foreground">
                          {litter.dam?.name || 'Unknown Dam'} × {litter.sire?.name || 'Unknown Sire'}
                        </p>
                        <p className="text-sm">
                          Birth: {format(new Date(litter.birth_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate(`/reproduction/litters/${litter.id}`)}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                  
                  {litters.length > 3 && (
                    <Button 
                      variant="ghost" 
                      className="w-full mt-2" 
                      onClick={() => navigate('/reproduction/litters')}
                    >
                      View all {litters.length} litters <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No active litters</p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/reproduction/litters/new')} 
                    className="mt-2"
                  >
                    Create Litter
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Reproductive Status Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="mr-2 h-5 w-5 text-pink-500" />
              Dogs in Heat / Pregnant
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-pulse">Loading reproductive status...</div>
              </div>
            ) : (
              <>
                {reproductiveDogs.length > 0 ? (
                  <div className="space-y-4">
                    {reproductiveDogs.map(dog => (
                      <div key={dog.id} className="flex justify-between border-b pb-2">
                        <div>
                          <h3 className="font-medium">{dog.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {dog.breed}, {dog.color}
                          </p>
                          <div className="flex items-center mt-1">
                            <div className={`w-2 h-2 rounded-full mr-2 ${dog.is_pregnant ? 'bg-purple-500' : 'bg-pink-500'}`}></div>
                            <span className="text-sm">
                              {dog.is_pregnant ? 'Pregnant' : 'In heat'}
                              {dog.last_heat_date && !dog.is_pregnant && ` (${differenceInDays(new Date(), new Date(dog.last_heat_date))} days)`}
                            </span>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigate(`/dogs/${dog.id}`)}
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No dogs currently in heat or pregnant</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-500" />
              Upcoming Heat Cycles
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-pulse">Loading upcoming cycles...</div>
              </div>
            ) : (
              <>
                {upcomingHeat.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingHeat.map(dog => {
                      const lastHeat = new Date(dog.last_heat_date);
                      const estimatedNextHeat = addDays(lastHeat, 180);
                      
                      return (
                        <div key={dog.id} className="flex justify-between border-b pb-2">
                          <div>
                            <h3 className="font-medium">{dog.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {dog.breed}, {dog.color}
                            </p>
                            <p className="text-sm">
                              Est. next heat: ~{format(estimatedNextHeat, 'MMM d, yyyy')}
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => navigate(`/dogs/${dog.id}`)}
                          >
                            View
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No upcoming heat cycles predicted</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={() => navigate('/reproduction/breeding')}>
              <Heart className="mr-2 h-4 w-4" />
              Breeding Management
            </Button>
            <Button onClick={() => navigate('/reproduction/welping')}>
              <Stethoscope className="mr-2 h-4 w-4" />
              Whelping Management
            </Button>
            <Button onClick={() => navigate('/reproduction/litters/new')}>
              <Baby className="mr-2 h-4 w-4" />
              Create New Litter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReproductiveDashboard;
