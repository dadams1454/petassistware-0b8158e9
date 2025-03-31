
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock, Calendar, Plus, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Mock staff schedule data
const mockScheduleData = [
  { 
    id: '1', 
    staffId: '1', 
    name: 'John Smith',
    role: 'Caretaker',
    monday: { start: '09:00', end: '17:00' },
    tuesday: { start: '09:00', end: '17:00' },
    wednesday: { start: '09:00', end: '17:00' },
    thursday: { start: '09:00', end: '17:00' },
    friday: { start: '09:00', end: '17:00' },
    saturday: null,
    sunday: null
  },
  { 
    id: '2', 
    staffId: '2', 
    name: 'Emma Johnson',
    role: 'Veterinarian',
    monday: { start: '08:00', end: '16:00' },
    tuesday: { start: '08:00', end: '16:00' },
    wednesday: null,
    thursday: { start: '08:00', end: '16:00' },
    friday: { start: '08:00', end: '16:00' },
    saturday: null,
    sunday: null
  },
  { 
    id: '3', 
    staffId: '3', 
    name: 'Michael Brown',
    role: 'Trainer',
    monday: { start: '10:00', end: '18:00' },
    tuesday: { start: '10:00', end: '18:00' },
    wednesday: { start: '10:00', end: '18:00' },
    thursday: null,
    friday: { start: '10:00', end: '18:00' },
    saturday: { start: '09:00', end: '13:00' },
    sunday: null
  },
  { 
    id: '4', 
    staffId: '4', 
    name: 'Sarah Davis',
    role: 'Groomer',
    monday: null,
    tuesday: { start: '09:00', end: '17:00' },
    wednesday: { start: '09:00', end: '17:00' },
    thursday: { start: '09:00', end: '17:00' },
    friday: { start: '09:00', end: '17:00' },
    saturday: null,
    sunday: null
  },
  { 
    id: '5', 
    staffId: '5', 
    name: 'David Wilson',
    role: 'Assistant',
    monday: { start: '11:00', end: '19:00' },
    tuesday: { start: '11:00', end: '19:00' },
    wednesday: { start: '11:00', end: '19:00' },
    thursday: { start: '11:00', end: '19:00' },
    friday: { start: '11:00', end: '19:00' },
    saturday: null,
    sunday: null
  }
];

const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const StaffSchedule: React.FC = () => {
  const { toast } = useToast();
  const [selectedWeek, setSelectedWeek] = useState<Date | undefined>(new Date());
  const [scheduleData, setScheduleData] = useState(mockScheduleData);
  const [selectedStaff, setSelectedStaff] = useState<string>('all');
  
  const filteredSchedule = selectedStaff === 'all' 
    ? scheduleData 
    : scheduleData.filter(schedule => schedule.staffId === selectedStaff);

  const handleScheduleChange = (
    staffId: string, 
    day: string, 
    field: 'start' | 'end', 
    value: string
  ) => {
    // In a real app, this would update the database
    setScheduleData(prevData => 
      prevData.map(item => {
        if (item.staffId === staffId) {
          return {
            ...item,
            [day]: {
              ...item[day as keyof typeof item],
              [field]: value
            }
          };
        }
        return item;
      })
    );
  };

  const handleSaveSchedule = () => {
    // In a real app, this would save to your database
    toast({
      title: "Schedule saved",
      description: "Staff schedule has been updated successfully."
    });
  };

  const formatWeekDateRange = (date: Date) => {
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    
    const startMonth = startOfWeek.toLocaleString('default', { month: 'short' });
    const endMonth = endOfWeek.toLocaleString('default', { month: 'short' });
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startOfWeek.getDate()} - ${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`;
    } else {
      return `${startMonth} ${startOfWeek.getDate()} - ${endMonth} ${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`;
    }
  };

  const formatDay = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Staff Schedule
            </div>
            <Button onClick={handleSaveSchedule} className="gap-2">
              <Save className="h-4 w-4" />
              Save Schedule
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Week Starting</label>
                <DatePicker date={selectedWeek} onSelect={setSelectedWeek} className="w-[240px]" />
              </div>
              <div className="text-lg font-medium self-end">
                {selectedWeek && formatWeekDateRange(selectedWeek)}
              </div>
            </div>
            
            <div className="space-y-2 w-full md:w-auto">
              <label className="text-sm font-medium">Filter by Staff</label>
              <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger className="w-full md:w-[240px]">
                  <SelectValue placeholder="All Staff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Staff</SelectItem>
                  {scheduleData.map(staff => (
                    <SelectItem key={staff.staffId} value={staff.staffId}>
                      {staff.name} ({staff.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="p-3 text-left font-medium">Staff</th>
                  {weekdays.map(day => (
                    <th key={day} className="p-3 text-left font-medium">{formatDay(day)}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredSchedule.map(staff => (
                  <tr key={staff.id} className="hover:bg-muted/30">
                    <td className="p-3">
                      <div className="font-medium">{staff.name}</div>
                      <div className="text-sm text-muted-foreground">{staff.role}</div>
                    </td>
                    {weekdays.map(day => (
                      <td key={`${staff.id}-${day}`} className="p-3">
                        {staff[day as keyof typeof staff] ? (
                          <div className="space-y-2">
                            <div className="flex gap-2 items-center">
                              <span className="text-sm text-muted-foreground w-10">Start:</span>
                              <input
                                type="time"
                                value={(staff[day as keyof typeof staff] as any)?.start || ''}
                                onChange={(e) => handleScheduleChange(
                                  staff.staffId, 
                                  day, 
                                  'start', 
                                  e.target.value
                                )}
                                className="border rounded px-2 py-1 text-sm w-24"
                              />
                            </div>
                            <div className="flex gap-2 items-center">
                              <span className="text-sm text-muted-foreground w-10">End:</span>
                              <input
                                type="time"
                                value={(staff[day as keyof typeof staff] as any)?.end || ''}
                                onChange={(e) => handleScheduleChange(
                                  staff.staffId, 
                                  day, 
                                  'end', 
                                  e.target.value
                                )}
                                className="border rounded px-2 py-1 text-sm w-24"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-2">
                            <span className="text-muted-foreground text-sm">Off</span>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffSchedule;
