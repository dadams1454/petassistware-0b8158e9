
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Define mock data for development without Supabase
const MOCK_STAFF_HOURS = [
  { id: '1', staff_name: 'John Doe', start_time: '2023-04-01T08:00:00', end_time: '2023-04-01T16:00:00', hours: 8, notes: 'Regular shift' },
  { id: '2', staff_name: 'Jane Smith', start_time: '2023-04-01T16:00:00', end_time: '2023-04-02T00:00:00', hours: 8, notes: 'Evening shift' },
  { id: '3', staff_name: 'Alice Johnson', start_time: '2023-04-02T00:00:00', end_time: '2023-04-02T08:00:00', hours: 8, notes: 'Night shift' },
];

const StaffHoursTracker: React.FC = () => {
  const { toast } = useToast();
  const [staffHours, setStaffHours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEntry, setNewEntry] = useState({
    staff_name: '',
    start_time: '',
    end_time: '',
    notes: ''
  });

  useEffect(() => {
    fetchStaffHours();
  }, []);

  const fetchStaffHours = async () => {
    setLoading(true);
    
    try {
      // In a real environment, uncomment this code to fetch from Supabase
      /*
      const { data, error } = await supabase
        .from('staff_hours')
        .select('*')
        .order('start_time', { ascending: false });
        
      if (error) throw error;
      setStaffHours(data || []);
      */
      
      // For development without Supabase, use mock data
      setStaffHours(MOCK_STAFF_HOURS);
    } catch (error) {
      console.error('Error fetching staff hours:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch staff hours. Using mock data instead.',
        variant: 'destructive'
      });
      
      // Fall back to mock data on error
      setStaffHours(MOCK_STAFF_HOURS);
    } finally {
      setLoading(false);
    }
  };

  const calculateHours = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    return Math.round(diffMs / (1000 * 60 * 60) * 10) / 10;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEntry(prev => ({ ...prev, [name]: value }));
  };

  const handleStaffNameChange = (value: string) => {
    setNewEntry(prev => ({ ...prev, staff_name: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEntry.staff_name || !newEntry.start_time || !newEntry.end_time) {
      toast({
        title: 'Validation Error',
        description: 'Staff name, start time, and end time are required.',
        variant: 'destructive'
      });
      return;
    }
    
    const hours = calculateHours(newEntry.start_time, newEntry.end_time);
    
    try {
      // In a real environment, uncomment this code to insert to Supabase
      /*
      const { data, error } = await supabase
        .from('staff_hours')
        .insert([
          {
            staff_name: newEntry.staff_name,
            start_time: newEntry.start_time,
            end_time: newEntry.end_time,
            hours,
            notes: newEntry.notes
          }
        ])
        .select();
        
      if (error) throw error;
      */
      
      // For development without Supabase
      const mockEntry = {
        id: Date.now().toString(),
        staff_name: newEntry.staff_name,
        start_time: newEntry.start_time,
        end_time: newEntry.end_time,
        hours,
        notes: newEntry.notes
      };
      
      setStaffHours(prev => [mockEntry, ...prev]);
      
      setNewEntry({
        staff_name: '',
        start_time: '',
        end_time: '',
        notes: ''
      });
      
      toast({
        title: 'Success',
        description: 'Staff hours entry added successfully.'
      });
    } catch (error) {
      console.error('Error adding staff hours entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to add staff hours entry.',
        variant: 'destructive'
      });
    }
  };

  const formatDateTime = (dateTimeStr: string): string => {
    try {
      const date = new Date(dateTimeStr);
      return date.toLocaleString();
    } catch (error) {
      return dateTimeStr;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Hours Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select value={newEntry.staff_name} onValueChange={handleStaffNameChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Staff Member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="John Doe">John Doe</SelectItem>
                  <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                  <SelectItem value="Alice Johnson">Alice Johnson</SelectItem>
                  <SelectItem value="Bob Wilson">Bob Wilson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                type="datetime-local"
                name="start_time"
                value={newEntry.start_time}
                onChange={handleInputChange}
                placeholder="Start Time"
              />
            </div>
            <div>
              <Input
                type="datetime-local"
                name="end_time"
                value={newEntry.end_time}
                onChange={handleInputChange}
                placeholder="End Time"
              />
            </div>
            <div>
              <Input
                name="notes"
                value={newEntry.notes}
                onChange={handleInputChange}
                placeholder="Notes"
              />
            </div>
          </div>
          <Button type="submit" className="w-full">Add Hours</Button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted">
                <th className="p-2 text-left">Staff</th>
                <th className="p-2 text-left">Start Time</th>
                <th className="p-2 text-left">End Time</th>
                <th className="p-2 text-left">Hours</th>
                <th className="p-2 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center">Loading...</td>
                </tr>
              ) : staffHours.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center">No staff hours recorded</td>
                </tr>
              ) : (
                staffHours.map(entry => (
                  <tr key={entry.id} className="border-b">
                    <td className="p-2">{entry.staff_name}</td>
                    <td className="p-2">{formatDateTime(entry.start_time)}</td>
                    <td className="p-2">{formatDateTime(entry.end_time)}</td>
                    <td className="p-2">{entry.hours}</td>
                    <td className="p-2">{entry.notes}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffHoursTracker;
