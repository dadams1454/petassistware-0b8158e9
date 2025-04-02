
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, differenceInDays } from 'date-fns';
import { LitterWithDogs } from '@/types/litter';

const LitterOverviewTab: React.FC = () => {
  const navigate = useNavigate();
  
  // Fetch recent litters
  const { data: recentLitters = [], isLoading } = useQuery({
    queryKey: ['recentLitters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('litters')
        .select(`
          *,
          dam:dam_id(*),
          sire:sire_id(*),
          puppies(*)
        `)
        .order('birth_date', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      return data as LitterWithDogs[];
    },
  });
  
  const handleViewLitter = (litterId: string) => {
    navigate(`/reproduction/litters/${litterId}`);
  };
  
  const handleAddLitter = () => {
    navigate('/reproduction/litters/new');
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p>Loading litters...</p>
      </div>
    );
  }
  
  if (recentLitters.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-muted-foreground mb-4">
            No litters found. Create a new litter to get started.
          </p>
          <Button onClick={handleAddLitter}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Litter
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Recent Litters</h3>
        <Button onClick={handleAddLitter}>
          <Plus className="h-4 w-4 mr-2" />
          Add Litter
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentLitters.map((litter) => {
          const birthDate = litter.birth_date ? new Date(litter.birth_date) : null;
          const puppyCount = litter.puppies?.length || 0;
          const ageInDays = birthDate ? differenceInDays(new Date(), birthDate) : null;
          
          return (
            <Card key={litter.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {litter.litter_name || `${litter.dam?.name || 'Unknown'}'s Litter`}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Dam:</span>{' '}
                    <span>{litter.dam?.name || 'Unknown'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Sire:</span>{' '}
                    <span>{litter.sire?.name || 'Unknown'}</span>
                  </div>
                  
                  {birthDate && (
                    <div>
                      <span className="text-muted-foreground">Birth Date:</span>{' '}
                      <span>{format(birthDate, 'MMM d, yyyy')}</span>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-muted-foreground">Status:</span>{' '}
                    <span className="capitalize">{litter.status || 'Active'}</span>
                  </div>
                </div>
                
                <div className="text-sm">
                  <span className="text-muted-foreground">Puppies:</span>{' '}
                  <span>{puppyCount} total</span>
                  {ageInDays !== null && (
                    <span className="ml-2 text-muted-foreground">
                      ({ageInDays} days old)
                    </span>
                  )}
                </div>
                
                <div className="flex justify-center pt-2">
                  <Button variant="outline" onClick={() => handleViewLitter(litter.id)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="flex justify-center">
        <Button variant="outline" onClick={() => navigate('/reproduction/litters')}>
          View All Litters
        </Button>
      </div>
    </div>
  );
};

export default LitterOverviewTab;
