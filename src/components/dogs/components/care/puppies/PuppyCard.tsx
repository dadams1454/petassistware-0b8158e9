
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle2, AlertCircle, Clipboard, Weight } from 'lucide-react';
import { PuppyWithAge, PuppyAgeGroupData } from '@/types/puppyTracking';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useDailyCare } from '@/contexts/dailyCare';

interface PuppyCardProps {
  puppy: PuppyWithAge;
  ageGroup: PuppyAgeGroupData;
  onRefresh: () => void;
}

const PuppyCard: React.FC<PuppyCardProps> = ({ puppy, ageGroup, onRefresh }) => {
  const { toast } = useToast();
  const { addCareLog } = useDailyCare();
  const [isLoading, setIsLoading] = useState(false);
  const [careDialogOpen, setCareDialogOpen] = useState(false);

  const handleLogCare = async () => {
    setIsLoading(true);
    try {
      // Create care log for puppy (assuming puppy.id works as dog_id)
      await addCareLog({
        dog_id: puppy.id,
        category: 'puppy_care',
        task_name: `${ageGroup.name} Check`,
        timestamp: new Date(),
        notes: `Routine care check for ${puppy.name || 'puppy'} (${puppy.ageInDays} days old)`
      });
      
      toast({
        title: "Care logged",
        description: `Recorded care for ${puppy.name || 'puppy'}`,
      });
      
      onRefresh();
    } catch (error) {
      console.error("Error logging puppy care:", error);
      toast({
        title: "Error",
        description: "Failed to log puppy care",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setCareDialogOpen(false);
    }
  };

  const getCareStatus = () => {
    // This is a placeholder - in a full implementation, we would check
    // if the puppy has had care logged today
    const hasCareLogs = false;
    return hasCareLogs;
  };

  const hasWellnessCheck = getCareStatus();

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex justify-between items-center">
          <span>{puppy.name || 'Unnamed Puppy'}</span>
          <Badge variant="outline" className="text-xs font-normal bg-primary/10 px-2 py-1 rounded-full">
            {puppy.ageInDays} days
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Color:</span> {puppy.color || 'Not specified'}
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Gender:</span> {puppy.gender || 'Not specified'}
          </div>
          
          {/* Status indicators */}
          <div className="flex flex-col gap-1 mt-3">
            {hasWellnessCheck ? (
              <div className="flex items-center text-xs text-green-600">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Care tracked today
              </div>
            ) : (
              <div className="flex items-center text-xs text-amber-600">
                <AlertCircle className="h-3 w-3 mr-1" /> Needs daily check
              </div>
            )}
            
            {puppy.current_weight && (
              <div className="flex items-center text-xs text-blue-600">
                <Weight className="h-3 w-3 mr-1" /> {puppy.current_weight} oz
              </div>
            )}
          </div>
          
          <Button 
            size="sm" 
            className="w-full mt-3"
            variant="outline"
            onClick={() => setCareDialogOpen(true)}
            disabled={isLoading}
          >
            <Clipboard className="h-3 w-3 mr-1" />
            Log Care
          </Button>
        </div>
      </CardContent>

      <Dialog open={careDialogOpen} onOpenChange={setCareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Care for {puppy.name || 'Puppy'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="text-sm">
              <p><strong>Age:</strong> {puppy.ageInDays} days</p>
              <p><strong>Development Stage:</strong> {ageGroup.name}</p>
            </div>
            
            <div className="border rounded p-3 bg-muted/20">
              <h3 className="font-medium mb-2">Recommended Checks:</h3>
              <ul className="text-sm space-y-1">
                {ageGroup.careChecks?.map((check, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary shrink-0 mt-0.5" />
                    <span>{check}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCareDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLogCare} disabled={isLoading}>
              {isLoading ? 'Recording...' : 'Record Care'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PuppyCard;
