
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const staffMembers = [
  { id: 'staff1', name: 'Jane Smith' },
  { id: 'staff2', name: 'John Doe' },
  { id: 'staff3', name: 'Emma Wilson' },
  { id: 'staff4', name: 'Mike Johnson' },
];

const StaffHoursTracker: React.FC = () => {
  const [staffId, setStaffId] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [hours, setHours] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!staffId || !hours || isNaN(Number(hours)) || Number(hours) <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill out all required fields correctly",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format the date to ISO string
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      // Get staff name from the selected ID
      const staffMember = staffMembers.find(s => s.id === staffId);
      
      const staffHoursData = {
        staff_id: staffId,
        staff_name: staffMember?.name || '',
        date: formattedDate,
        hours: Number(hours),
        notes,
        created_at: new Date().toISOString()
      };
      
      // Insert into database
      const { error } = await supabase
        .from('staff_hours')
        .insert(staffHoursData);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Staff hours have been recorded"
      });
      
      // Reset form
      setStaffId('');
      setDate(new Date());
      setHours('');
      setNotes('');
    } catch (error) {
      console.error('Error recording staff hours:', error);
      toast({
        title: "Error",
        description: "Failed to record staff hours",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Staff Hours</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="staff">Staff Member</Label>
            <Select value={staffId} onValueChange={setStaffId}>
              <SelectTrigger id="staff">
                <SelectValue placeholder="Select staff member" />
              </SelectTrigger>
              <SelectContent>
                {staffMembers.map(staff => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <div className="max-w-[280px]">
              <DatePicker 
                value={date}
                onChange={setDate}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hours">Hours Worked</Label>
            <Input
              id="hours"
              type="number"
              placeholder="Enter hours"
              min="0.5"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Hours'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StaffHoursTracker;
