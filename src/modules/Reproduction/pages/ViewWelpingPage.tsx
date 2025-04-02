
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; 
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { ArrowLeft, Baby, Clock, Plus } from 'lucide-react';

const ViewWelpingPage: React.FC = () => {
  const { welpingId } = useParams<{ welpingId: string }>();
  const navigate = useNavigate();
  
  const { data: welpingRecord, isLoading } = useQuery({
    queryKey: ['welping-record', welpingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('welping_records')
        .select(`
          *,
          litter:litter_id (
            *,
            dam:dam_id (*),
            sire:sire_id (*)
          )
        `)
        .eq('id', welpingId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!welpingId
  });
  
  // Fetch observations
  const { data: observations = [], isLoading: isLoadingObservations } = useQuery({
    queryKey: ['welping-observations', welpingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('welping_observations')
        .select('*')
        .eq('welping_record_id', welpingId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: !!welpingId
  });
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Button 
          variant="ghost" 
          className="flex items-center" 
          onClick={() => navigate('/reproduction/welping')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Whelping
        </Button>
        
        <div className="text-center py-12">
          <p>Loading whelping record...</p>
        </div>
      </div>
    );
  }
  
  if (!welpingRecord) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Button 
          variant="ghost" 
          className="flex items-center" 
          onClick={() => navigate('/reproduction/welping')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Whelping
        </Button>
        
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg text-muted-foreground">Whelping record not found</p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/reproduction/welping')} 
              className="mt-4"
            >
              Return to Whelping Management
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button 
        variant="ghost" 
        className="flex items-center" 
        onClick={() => navigate('/reproduction/welping')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Whelping
      </Button>
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Live Whelping Session</h1>
          <p className="text-muted-foreground">
            {welpingRecord.litter?.dam?.name || 'Unknown Dam'}'s Whelping - {format(new Date(welpingRecord.birth_date), 'MMM d, yyyy')}
          </p>
        </div>
        
        <div className="flex space-x-2">
          {welpingRecord.status === 'in-progress' && (
            <Button>
              <Clock className="h-4 w-4 mr-2" />
              End Whelping
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={() => navigate(`/reproduction/litters/${welpingRecord.litter_id}`)}
          >
            <Baby className="h-4 w-4 mr-2" />
            View Litter
          </Button>
        </div>
      </div>
      
      {/* Whelping Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Whelping Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Dam</h3>
              <p>{welpingRecord.litter?.dam?.name || 'Unknown'}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Sire</h3>
              <p>{welpingRecord.litter?.sire?.name || 'Unknown'}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Birth Date</h3>
              <p>{format(new Date(welpingRecord.birth_date), 'MMM d, yyyy')}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Start Time</h3>
              <p>{welpingRecord.start_time || 'Not recorded'}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">End Time</h3>
              <p>{welpingRecord.end_time || 'In progress'}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="capitalize">{welpingRecord.status}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Attended By</h3>
              <p>{welpingRecord.attended_by || 'Not recorded'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Male Puppies</h3>
              <p>{welpingRecord.males}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Female Puppies</h3>
              <p>{welpingRecord.females}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Total Puppies</h3>
              <p>{welpingRecord.total_puppies}</p>
            </div>
          </div>
          
          {welpingRecord.complications && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground text-red-500">Complications</h3>
              <p>{welpingRecord.complication_notes || 'Yes - No details provided'}</p>
            </div>
          )}
          
          {welpingRecord.notes && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
              <p>{welpingRecord.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Observations */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Observations</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Observation
        </Button>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          {isLoadingObservations ? (
            <div className="text-center py-4">
              <p>Loading observations...</p>
            </div>
          ) : observations.length > 0 ? (
            <div className="space-y-4">
              {observations.map((observation) => (
                <div key={observation.id} className="border-b pb-4">
                  <div className="flex justify-between">
                    <h3 className="font-medium capitalize">{observation.observation_type}</h3>
                    <span className="text-sm text-muted-foreground">{observation.observation_time}</span>
                  </div>
                  <p className="mt-1">{observation.description}</p>
                  {observation.action_taken && (
                    <div className="mt-2">
                      <span className="text-sm font-medium">Action taken:</span>
                      <p className="text-sm">{observation.action_taken}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No observations recorded yet</p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add First Observation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewWelpingPage;
