
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { UserRound, Clock, Calendar, Plus, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock staff data - in a real app, would come from your database
const mockStaffMembers = [
  { id: '1', name: 'John Smith', role: 'Caretaker' },
  { id: '2', name: 'Emma Johnson', role: 'Veterinarian' },
  { id: '3', name: 'Michael Brown', role: 'Trainer' },
  { id: '4', name: 'Sarah Davis', role: 'Groomer' },
  { id: '5', name: 'David Wilson', role: 'Assistant' },
];

// Mock staff hours data
const mockStaffHours = [
  { id: '1', staffId: '1', date: new Date('2023-10-01'), clockIn: '09:00', clockOut: '17:00', hoursWorked: 8, notes: 'Regular shift' },
  { id: '2', staffId: '2', date: new Date('2023-10-01'), clockIn: '08:30', clockOut: '16:30', hoursWorked: 8, notes: 'Veterinary check-ups' },
  { id: '3', staffId: '3', date: new Date('2023-10-01'), clockIn: '10:00', clockOut: '15:00', hoursWorked: 5, notes: 'Training sessions' },
];

const StaffHoursTracker: React.FC = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [staffHours, setStaffHours] = useState(mockStaffHours);
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  const [clockIn, setClockIn] = useState<string>('');
  const [clockOut, setClockOut] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isAddingHours, setIsAddingHours] = useState(false);

  const handleSaveHours = () => {
    if (!selectedStaff || !clockIn) {
      toast({
        title: "Error",
        description: "Please select a staff member and enter clock in time",
        variant: "destructive"
      });
      return;
    }

    // Calculate hours worked
    let hoursWorked = 0;
    if (clockIn && clockOut) {
      const [inHours, inMinutes] = clockIn.split(':').map(Number);
      const [outHours, outMinutes] = clockOut.split(':').map(Number);
      hoursWorked = (outHours - inHours) + (outMinutes - inMinutes) / 60;
    }

    const newEntry = {
      id: `temp-${Date.now()}`,
      staffId: selectedStaff,
      date: selectedDate || new Date(),
      clockIn,
      clockOut,
      hoursWorked: parseFloat(hoursWorked.toFixed(2)),
      notes
    };

    setStaffHours([...staffHours, newEntry]);
    
    // Reset form
    setSelectedStaff('');
    setClockIn('');
    setClockOut('');
    setNotes('');
    setIsAddingHours(false);

    toast({
      title: "Hours saved",
      description: "Staff hours have been recorded successfully"
    });
  };

  const filteredHours = selectedDate 
    ? staffHours.filter(entry => 
        entry.date.toDateString() === selectedDate.toDateString()
      )
    : staffHours;

  const getStaffName = (staffId: string) => {
    const staff = mockStaffMembers.find(s => s.id === staffId);
    return staff ? staff.name : 'Unknown';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Staff Hours Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-end mb-6">
            <div className="flex items-center gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Date</label>
                <DatePicker 
                  date={selectedDate} 
                  onSelect={setSelectedDate} 
                  className="w-[240px]"
                />
              </div>
            </div>
            <Button onClick={() => setIsAddingHours(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Hours
            </Button>
          </div>

          {isAddingHours && (
            <Card className="mb-6 border-dashed">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Staff Member</label>
                    <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff member" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockStaffMembers.map(staff => (
                          <SelectItem key={staff.id} value={staff.id}>
                            {staff.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Clock In</label>
                    <Input 
                      type="time" 
                      value={clockIn} 
                      onChange={(e) => setClockIn(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Clock Out</label>
                    <Input 
                      type="time" 
                      value={clockOut} 
                      onChange={(e) => setClockOut(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Notes</label>
                    <Input 
                      placeholder="Enter optional notes" 
                      value={notes} 
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingHours(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveHours} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Hours
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHours.length > 0 ? (
                filteredHours.map(entry => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          {getStaffName(entry.staffId).charAt(0)}
                        </div>
                        <span>{getStaffName(entry.staffId)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {entry.date.toLocaleDateString()}
                    </TableCell>
                    <TableCell>{entry.clockIn}</TableCell>
                    <TableCell>{entry.clockOut || "-"}</TableCell>
                    <TableCell>{entry.hoursWorked}</TableCell>
                    <TableCell>{entry.notes || "-"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No hours recorded for the selected date
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffHoursTracker;
