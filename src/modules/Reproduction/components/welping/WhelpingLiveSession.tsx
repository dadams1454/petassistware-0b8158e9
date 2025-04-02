
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Baby, Clock, Plus, Save } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { useWelping } from '@/pages/Welping/hooks/useWelping';
import WelpingLogForm from '@/pages/Welping/components/WelpingLogForm';
import WelpingLogTimeline from '@/pages/Welping/components/WelpingLogTimeline';
import AddWelpingPuppyDialog from '@/pages/Welping/components/AddWelpingPuppyDialog';

const WhelpingLiveSession: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('timeline');
  const [isEndingWhelping, setIsEndingWhelping] = useState(false);
  const [isAddPuppyOpen, setIsAddPuppyOpen] = useState(false);
  
  const {
    litter,
    welpingLogs,
    isLoading,
    isLoadingLogs,
    updateWelping,
    addWelpingLog,
    refetchLitter,
    refetchLogs
  } = useWelping(id);
  
  // Format birth date
  const formattedBirthDate = litter?.birth_date 
    ? format(parseISO(litter.birth_date), 'MMMM d, yyyy')
    : 'Unknown';
  
  // Handle adding a log event
  const handleAddLog = async (logData: any) => {
    if (!id) return;
    
    try {
      await addWelpingLog({
        litter_id: id,
        ...logData
      });
      
      toast({
        title: 'Event recorded',
        description: 'The whelping event has been recorded successfully',
      });
      
      await refetchLogs();
    } catch (error) {
      console.error('Error adding whelping log:', error);
      toast({
        title: 'Error',
        description: 'Failed to record whelping event',
        variant: 'destructive',
      });
    }
  };
  
  // Handle ending the whelping session
  const handleEndWhelping = async () => {
    if (!id || !litter) return;
    
    setIsEndingWhelping(true);
    
    try {
      // Update the welping_records table if it exists
      try {
        await updateWelping({
          end_time: format(new Date(), 'HH:mm'),
          status: 'completed'
        });
      } catch (updateError) {
        console.log('Could not update welping_records (table may not exist)', updateError);
      }
      
      // Update the litter status
      await updateLitterStatus();
      
      // Add an end event to the whelping logs
      await addWelpingLog({
        litter_id: id,
        timestamp: new Date().toISOString(),
        event_type: 'end',
        notes: 'Whelping session completed'
      });
      
      toast({
        title: 'Whelping completed',
        description: 'The whelping session has been marked as completed',
      });
      
      await refetchLitter();
      await refetchLogs();
    } catch (error) {
      console.error('Error ending whelping session:', error);
      toast({
        title: 'Error',
        description: 'Failed to end whelping session',
        variant: 'destructive',
      });
    } finally {
      setIsEndingWhelping(false);
    }
  };
  
  // Update the litter status
  const updateLitterStatus = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('litters')
        .update({ status: 'active' })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      // If there was a dam marked as pregnant, update her status
      if (litter?.dam_id) {
        await supabase
          .from('dogs')
          .update({ is_pregnant: false })
          .eq('id', litter.dam_id);
      }
      
      return data;
    } catch (error) {
      console.error('Error updating litter status:', error);
      throw error;
    }
  };
  
  const handlePuppyAdded = async () => {
    await refetchLitter();
  };
  
  // Loading state
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
          <p>Loading whelping session...</p>
        </div>
      </div>
    );
  }
  
  // Not found state
  if (!litter) {
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
            <p className="text-lg text-muted-foreground">Whelping session not found</p>
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
            {litter.dam?.name || 'Unknown Dam'}'s Whelping - {formattedBirthDate}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setIsAddPuppyOpen(true)}
          >
            <Baby className="h-4 w-4 mr-2" />
            Record Puppy
          </Button>
          
          <Button 
            onClick={handleEndWhelping}
            disabled={isEndingWhelping}
          >
            <Clock className="h-4 w-4 mr-2" />
            End Whelping
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Whelping Live Session</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="record">Record Event</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timeline" className="space-y-4 pt-4">
              <WelpingLogTimeline 
                logs={welpingLogs} 
                puppies={litter.puppies || []}
              />
            </TabsContent>
            
            <TabsContent value="record" className="space-y-4 pt-4">
              <WelpingLogForm 
                litterId={id!} 
                onSave={handleAddLog}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <AddWelpingPuppyDialog
        litterId={id!}
        isOpen={isAddPuppyOpen}
        onOpenChange={setIsAddPuppyOpen}
        onSuccess={handlePuppyAdded}
      />
    </div>
  );
};

export default WhelpingLiveSession;
