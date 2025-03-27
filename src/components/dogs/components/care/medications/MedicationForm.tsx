
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { MedicationFrequency, MedicationType } from '@/types/medication';

interface MedicationFormProps {
  dogId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const MedicationForm: React.FC<MedicationFormProps> = ({ dogId, onSuccess, onCancel }) => {
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [dosageUnit, setDosageUnit] = useState('mg');
  const [frequency, setFrequency] = useState<MedicationFrequency>(MedicationFrequency.MONTHLY);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [isPreventative, setIsPreventative] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!medicationName.trim()) {
      toast({
        title: "Error",
        description: "Medication name is required",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Determine category based on whether it's preventative
      const medicationType = isPreventative ? MedicationType.PREVENTATIVE : MedicationType.TREATMENT;
      
      // Construct task name with frequency information
      const formattedFrequency = frequency === MedicationFrequency.DAILY ? 'Daily' :
                               frequency === MedicationFrequency.WEEKLY ? 'Weekly' :
                               frequency === MedicationFrequency.MONTHLY ? 'Monthly' :
                               frequency === MedicationFrequency.QUARTERLY ? 'Quarterly' :
                               frequency === MedicationFrequency.ANNUALLY ? 'Annually' : '';
      
      const taskName = `${medicationName} (${formattedFrequency})`;
      
      // Add notes about preventative status if applicable
      const medicationNotes = isPreventative 
        ? `${notes ? notes + '. ' : ''}Preventative medication.` 
        : notes;
        
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Create record in daily_care_logs
      const { error } = await supabase
        .from('daily_care_logs')
        .insert({
          dog_id: dogId,
          task_name: taskName,
          category: 'medications',
          created_by: user?.id || null,
          notes: medicationNotes,
          timestamp: new Date().toISOString(),
          status: 'completed',
          medication_metadata: {
            medication_name: medicationName,
            dosage,
            dosage_unit: dosageUnit,
            frequency,
            medication_type: medicationType,
            start_date: startDate.toISOString()
          }
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `${medicationName} has been logged successfully`
      });
      
      onSuccess();
    } catch (error: any) {
      console.error('Error logging medication:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to log medication",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="medication_name">Medication Name</Label>
        <Input 
          id="medication_name" 
          value={medicationName} 
          onChange={(e) => setMedicationName(e.target.value)}
          placeholder="e.g., Heartworm Prevention"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dosage">Dosage</Label>
          <Input 
            id="dosage" 
            value={dosage} 
            onChange={(e) => setDosage(e.target.value)}
            placeholder="e.g., 10"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dosage_unit">Unit</Label>
          <Select 
            value={dosageUnit} 
            onValueChange={setDosageUnit}
          >
            <SelectTrigger id="dosage_unit">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mg">mg</SelectItem>
              <SelectItem value="ml">ml</SelectItem>
              <SelectItem value="tablet">tablet</SelectItem>
              <SelectItem value="chew">chew</SelectItem>
              <SelectItem value="application">application</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="frequency">Frequency</Label>
        <Select 
          value={frequency} 
          onValueChange={(value) => setFrequency(value as MedicationFrequency)}
        >
          <SelectTrigger id="frequency">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={MedicationFrequency.DAILY}>Daily</SelectItem>
            <SelectItem value={MedicationFrequency.WEEKLY}>Weekly</SelectItem>
            <SelectItem value={MedicationFrequency.MONTHLY}>Monthly</SelectItem>
            <SelectItem value={MedicationFrequency.QUARTERLY}>Quarterly</SelectItem>
            <SelectItem value={MedicationFrequency.ANNUALLY}>Annually</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="start_date">Start Date</Label>
        <DatePicker 
          date={startDate} 
          onSelect={setStartDate} 
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="preventative" 
          checked={isPreventative} 
          onCheckedChange={(checked) => setIsPreventative(checked as boolean)}
        />
        <Label htmlFor="preventative">Preventative Medication</Label>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea 
          id="notes" 
          value={notes} 
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional details about this medication"
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Log Medication'}
        </Button>
      </div>
    </form>
  );
};

export default MedicationForm;
