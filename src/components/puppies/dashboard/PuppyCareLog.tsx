
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, PlusCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PuppyCareLogProps } from '@/types/puppy';

const PuppyCareLog: React.FC<PuppyCareLogProps> = ({ 
  puppyId, 
  puppyName, 
  puppyGender, 
  puppyColor,
  puppyAge,
  onSuccess,
  onRefresh
}) => {
  const [careType, setCareType] = useState('feeding');
  const [details, setDetails] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!details.trim()) {
      toast({
        title: "Details required",
        description: "Please provide care details",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const careLog = {
        puppy_id: puppyId,
        care_type: careType,
        timestamp: date.toISOString(),
        details: {
          activity: details,
          gender: puppyGender,
          color: puppyColor,
          age_days: puppyAge
        },
        notes: notes.trim() || null
      };
      
      // Insert the care log entry
      const { error } = await supabase
        .from('puppy_care_logs')
        .insert(careLog);
        
      if (error) throw error;
      
      // Reset form
      setDetails('');
      setNotes('');
      setDate(new Date());
      
      toast({
        title: "Care recorded",
        description: `${puppyName}'s ${careType} activity has been logged`
      });
      
      // Notify parent of success if callback is provided
      if (onSuccess) onSuccess();
      if (onRefresh) onRefresh();
      
    } catch (error) {
      console.error('Error saving care log:', error);
      toast({
        title: "Error",
        description: "Failed to save care log",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base flex items-center">
          <PlusCircle className="h-4 w-4 mr-2 text-primary" />
          Log Care Activity for {puppyName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Care Type</label>
              <Select 
                value={careType} 
                onValueChange={setCareType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select care type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feeding">Feeding</SelectItem>
                  <SelectItem value="weight">Weight Check</SelectItem>
                  <SelectItem value="medication">Medication</SelectItem>
                  <SelectItem value="grooming">Grooming</SelectItem>
                  <SelectItem value="bathroom">Bathroom</SelectItem>
                  <SelectItem value="socialization">Socialization</SelectItem>
                  <SelectItem value="health_check">Health Check</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date & Time</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Details</label>
            <Input
              placeholder={`Enter ${careType} details`}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (Optional)</label>
            <Textarea
              placeholder="Add any additional notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="justify-end">
        <Button 
          type="submit" 
          onClick={handleSubmit} 
          disabled={isSubmitting || !details.trim()}
        >
          {isSubmitting ? "Saving..." : "Save Care Log"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PuppyCareLog;
